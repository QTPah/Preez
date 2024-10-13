<script>
  import { onMount } from 'svelte';
  import { getAllUserReports, updateUserReportStatus } from '$lib/api/auth';
  import { getAllOfferReports, updateOfferReportStatus } from '$lib/api/offers';
  import { goto } from '$app/navigation';

  let userReports = [];
  let offerReports = [];
  let loading = false;

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
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      loading = false;
    }
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

<h2 class="text-2xl font-bold mb-4">Reports</h2>

{#if loading}
  <p>Loading reports...</p>
{:else}
  <h3 class="text-xl font-bold mb-2">User Reports</h3>
  <table class="min-w-full mb-8">
    <thead>
      <tr>
        <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Reported User</th>
        <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
        <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Reason</th>
        <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Status</th>
        <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each userReports as report}
        <tr>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
            <button 
              on:click={() => redirectToUser(report.reportedUser._id)}
              class="text-blue-600 hover:text-blue-900"
            >
              {report.reportedUser.username}
            </button>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
            <button 
              on:click={() => redirectToUser(report.reporter._id)}
              class="text-blue-600 hover:text-blue-900"
            >
              {report.reporter.username}
            </button>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{report.reason}</td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{report.status}</td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
            {#if report.status === 'pending'}
              <button 
                on:click={() => handleReportAction(report._id, 'resolve', 'user')}
                class="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded mr-2"
              >
                Resolve
              </button>
              <button 
                on:click={() => handleReportAction(report._id, 'reject', 'user')}
                class="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
              >
                Reject
              </button>
            {:else}
              <span class="text-gray-500">No actions available</span>
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  <h3 class="text-xl font-bold mb-2">Offer Reports</h3>
  <table class="min-w-full">
    <thead>
      <tr>
        <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Reported Offer</th>
        <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
        <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Reason</th>
        <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Status</th>
        <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each offerReports as report}
        <tr>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
            <button 
              on:click={() => redirectToOffer(report.reportedOffer._id)}
              class="text-blue-600 hover:text-blue-900"
            >
              {report.reportedOffer.title}
            </button>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
            <button 
              on:click={() => redirectToUser(report.reporter._id)}
              class="text-blue-600 hover:text-blue-900"
            >
              {report.reporter.username}
            </button>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{report.reason}</td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{report.status}</td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
            {#if report.status === 'pending'}
              <button 
                on:click={() => handleReportAction(report._id, 'resolve', 'offer')}
                class="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded mr-2"
              >
                Resolve
              </button>
              <button 
                on:click={() => handleReportAction(report._id, 'reject', 'offer')}
                class="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
              >
                Reject
              </button>
            {:else}
              <span class="text-gray-500">No actions available</span>
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
