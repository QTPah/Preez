<script>
  import { onMount } from 'svelte';
  import { getStatistics } from '$lib/api/statistics';

  let statistics = null;
  let loading = true;
  let error = null;

  onMount(async () => {
    try {
      statistics = await getStatistics();
      loading = false;
    } catch (err) {
      console.error('Error fetching statistics:', err);
      error = 'Failed to load statistics. Please try again later.';
      loading = false;
    }
  });
</script>

<h2 class="text-2xl font-bold mb-4">Overview</h2>

{#if loading}
  <p>Loading statistics...</p>
{:else if error}
  <p class="text-red-500">{error}</p>
{:else if statistics}
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
      <h3 class="text-lg font-semibold mb-2">Total Users</h3>
      <p class="text-3xl font-bold">{statistics.totalUsers}</p>
    </div>
    <div class="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
      <h3 class="text-lg font-semibold mb-2">Total Offers</h3>
      <p class="text-3xl font-bold">{statistics.totalOffers}</p>
    </div>
    <div class="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
      <h3 class="text-lg font-semibold mb-2">New Users Today</h3>
      <p class="text-3xl font-bold">{statistics.newUsersToday}</p>
    </div>
    <div class="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
      <h3 class="text-lg font-semibold mb-2">New Offers Today</h3>
      <p class="text-3xl font-bold">{statistics.newOffersToday}</p>
    </div>
    <div class="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
      <h3 class="text-lg font-semibold mb-2">Active Users (Last 7 Days)</h3>
      <p class="text-3xl font-bold">{statistics.activeUsers}</p>
    </div>
    <div class="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
      <h3 class="text-lg font-semibold mb-2">Total Messages</h3>
      <p class="text-3xl font-bold">{statistics.totalMessages}</p>
    </div>
    <div class="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
      <h3 class="text-lg font-semibold mb-2">Total Reports</h3>
      <p class="text-3xl font-bold">{statistics.totalReports}</p>
    </div>
    <div class="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
      <h3 class="text-lg font-semibold mb-2">Pending Reports</h3>
      <p class="text-3xl font-bold">{statistics.pendingReports}</p>
    </div>
  </div>
{/if}
