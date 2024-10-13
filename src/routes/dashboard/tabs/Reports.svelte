<script>
  import { onMount } from 'svelte';
  import { getAllReports, updateReportStatus } from '$lib/api/reports';
  import { goto } from '$app/navigation';

  let reports = [];
  let loading = false;

  onMount(loadReports);

  async function loadReports() {
    loading = true;
    try {
      const response = await getAllReports();
      reports = response.reports;
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      loading = false;
    }
  }

  function redirectToUser(userId) {
    goto(`/dashboard?tab=users&userId=${userId}`);
  }

  async function handleReportAction(reportId, action) {
    try {
      await updateReportStatus(reportId, action);
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
  <table class="min-w-full">
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
      {#each reports as report}
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
                on:click={() => handleReportAction(report._id, 'resolve')}
                class="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded mr-2"
              >
                Resolve
              </button>
              <button 
                on:click={() => handleReportAction(report._id, 'reject')}
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
