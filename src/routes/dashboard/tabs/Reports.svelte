<script>
  import { onMount } from 'svelte';
  import { getAllUserReports, updateUserReportStatus } from '$lib/api/users';
  import { getAllOfferReports, updateOfferReportStatus, getOfferById } from '$lib/api/offers';
  import { goto } from '$app/navigation';
  import ReportReviewModal from '$lib/components/ReportReviewModal.svelte';

  let userReports = [];
  let offerReports = [];
  let loading = false;
  let sortOrder = 'newest';
  let showModal = false;
  let selectedReport = null;
  let selectedReportType = '';

  function showReviewModal(report, type) {
    selectedReport = report;
    selectedReportType = type;
    showModal = true;
  }

  onMount(loadReports);

  async function loadReports() {
    loading = true;
    try {
      const [userResponse, offerResponse] = await Promise.all([
        getAllUserReports(),
        getAllOfferReports()
      ]);
      userReports = userResponse.reports;
      offerReports = offerResponse.reports;
      
      try {
        for (const report of offerReports) {
          const offer = await getOfferById(report.targetId);
          report.reportedOffer = offer.offer;
        }
      } catch (error) {
        console.error('Error loading offer details:', error);
      }

      sortReports();
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      loading = false;
    }
  }

  function sortReports() {
    const sortFn = (a, b) => {
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      return sortOrder === 'newest' 
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt);
    };
    userReports = userReports.sort(sortFn);
    offerReports = offerReports.sort(sortFn);
  }

  function handleSortChange(event) {
    sortOrder = event.target.value;
    sortReports();
  }

  function redirectToUser(userId) {
    goto(`/dashboard?tab=users&userId=${userId}`);
  }

  function redirectToOffer(offerId) {
    goto(`/offer/${offerId}`);
  }

  async function handleReportAction(reportId, action, type) {
    try {
      if (type === 'user') {
        await updateUserReportStatus(reportId, action);
      } else if (type === 'offer') {
        await updateOfferReportStatus(reportId, action);
      }
      await loadReports();
    } catch (error) {
      console.error(`Error ${action}ing report:`, error);
    }
  }
</script>

<h2 class="text-xl sm:text-2xl font-bold mb-4">Reports</h2>

<div class="mb-4">
  <label for="sort-order" class="mr-2">Sort by:</label>
  <select id="sort-order" on:change={handleSortChange} class="border rounded p-1">
    <option value="newest">Newest</option>
    <option value="oldest">Oldest</option>
  </select>
</div>

{#if loading}
  <p>Loading reports...</p>
{:else}
  <h3 class="text-lg sm:text-xl font-bold mb-2">User Reports</h3>
  <div class="overflow-x-auto mb-8">
    <table class="min-w-full">
      <thead>
        <tr>
          <th class="px-4 sm:px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Reported User</th>
          <th class="px-4 sm:px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Reporter</th>
          <th class="px-4 sm:px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Reason</th>
          <th class="px-4 sm:px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th class="px-4 sm:px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each userReports as report}
          <tr>
            <td class="px-4 sm:px-6 py-4 whitespace-no-wrap border-b border-gray-300">
              <button 
                on:click={() => redirectToUser(report.reportedUser._id)}
                class="text-blue-600 hover:text-blue-900"
              >
                {report.reportedUser.username}
              </button>
            </td>
            <td class="px-4 sm:px-6 py-4 whitespace-no-wrap border-b border-gray-300 hidden sm:table-cell">
              <button 
                on:click={() => redirectToUser(report.reportedBy._id)}
                class="text-blue-600 hover:text-blue-900"
              >
                {report.reportedBy.username}
              </button>
            </td>
            <td class="px-4 sm:px-6 py-4 whitespace-no-wrap border-b border-gray-300 hidden md:table-cell">{report.reason}</td>
            <td class="px-4 sm:px-6 py-4 whitespace-no-wrap border-b border-gray-300">
              <span class={`px-2 py-1 text-xs font-semibold rounded-full 
                ${report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  report.status === 'resolved' ? 'bg-green-100 text-green-800' : 
                  'bg-red-100 text-red-800'}`}>
                {report.status}
              </span>
            </td>
            <td class="px-4 sm:px-6 py-4 whitespace-no-wrap border-b border-gray-300">
              <button 
                on:click={() => showReviewModal(report, 'user')}
                class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded text-sm"
              >
                Review
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h3 class="text-lg sm:text-xl font-bold mb-2">Offer Reports</h3>
  <div class="overflow-x-auto">
    <table class="min-w-full">
      <thead>
        <tr>
          <th class="px-4 sm:px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Reported Offer</th>
          <th class="px-4 sm:px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Reporter</th>
          <th class="px-4 sm:px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Reason</th>
          <th class="px-4 sm:px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th class="px-4 sm:px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each offerReports as report}
          <tr>
            <td class="px-4 sm:px-6 py-4 whitespace-no-wrap border-b border-gray-300">
              <button 
                on:click={() => redirectToOffer(report.targetId)}
                class="text-blue-600 hover:text-blue-900"
              >
                {report.reportedOffer.title}
              </button>
            </td>
            <td class="px-4 sm:px-6 py-4 whitespace-no-wrap border-b border-gray-300 hidden sm:table-cell">
              <button 
                on:click={() => redirectToUser(report.reportedBy._id)}
                class="text-blue-600 hover:text-blue-900"
              >
                {report.reportedBy.username}
              </button>
            </td>
            <td class="px-4 sm:px-6 py-4 whitespace-no-wrap border-b border-gray-300 hidden md:table-cell">{report.reason}</td>
            <td class="px-4 sm:px-6 py-4 whitespace-no-wrap border-b border-gray-300">
              <span class={`px-2 py-1 text-xs font-semibold rounded-full 
                ${report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  report.status === 'resolved' ? 'bg-green-100 text-green-800' : 
                  'bg-red-100 text-red-800'}`}>
                {report.status}
              </span>
            </td>
            <td class="px-4 sm:px-6 py-4 whitespace-no-wrap border-b border-gray-300">
              <button 
                on:click={() => showReviewModal(report, 'offer')}
                class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded text-sm"
              >
                Review
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}

{#if showModal}
  <ReportReviewModal
    report={selectedReport}
    reportType={selectedReportType}
    on:close={() => showModal = false}
    on:resolve={(event) => handleReportAction(event.detail.reportId, 'resolve', selectedReportType)}
    on:reject={(event) => handleReportAction(event.detail.reportId, 'reject', selectedReportType)}
  />
{/if}
