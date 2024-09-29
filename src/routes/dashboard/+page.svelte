<script>
  import { onMount } from 'svelte';
  import { auth } from '../../stores/auth';

  let activeTab = 'overview';
  let userPermissions = {};

  const tabs = [
    { id: 'overview', name: 'Overview', permission: null },
    { id: 'users', name: 'Users', permission: 'manageUsers' },
    { id: 'offers', name: 'Offers', permission: 'manageOffers' },
    { id: 'categories', name: 'Categories', permission: 'manageCategories' },
    { id: 'reports', name: 'Reports', permission: 'viewReports' },
    { id: 'settings', name: 'Settings', permission: 'manageSettings' }
  ];

  onMount(() => {
    userPermissions = $auth.user?.permissions || {};
  });

  function hasPermission(permission) {
    return permission === null || userPermissions[permission];
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">Dashboard</h1>

  <div class="mb-6">
    <ul class="flex border-b">
      {#each tabs as tab}
        {#if hasPermission(tab.permission)}
          <li class="-mb-px mr-1">
            <a
              href="#{tab.id}"
              class="bg-white inline-block py-2 px-4 font-semibold {activeTab === tab.id ? 'border-l border-t border-r rounded-t text-blue-700' : 'text-blue-500 hover:text-blue-800'}"
              on:click|preventDefault={() => activeTab = tab.id}
            >
              {tab.name}
            </a>
          </li>
        {/if}
      {/each}
    </ul>
  </div>

  <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    {#if activeTab === 'overview'}
      <h2 class="text-2xl font-bold mb-4">Overview</h2>
      <p>Welcome to the dashboard. Here you can manage various aspects of the platform.</p>
    {:else if activeTab === 'users' && hasPermission('manageUsers')}
      <h2 class="text-2xl font-bold mb-4">User Management</h2>
      <p>Manage user accounts, permissions, and activities.</p>
    {:else if activeTab === 'offers' && hasPermission('manageOffers')}
      <h2 class="text-2xl font-bold mb-4">Offer Management</h2>
      <p>Review, edit, or remove offers from the platform.</p>
    {:else if activeTab === 'categories' && hasPermission('manageCategories')}
      <h2 class="text-2xl font-bold mb-4">Category Management</h2>
      <p>Manage offer categories and subcategories.</p>
    {:else if activeTab === 'reports' && hasPermission('viewReports')}
      <h2 class="text-2xl font-bold mb-4">Reports</h2>
      <p>View and analyze platform statistics and user reports.</p>
    {:else if activeTab === 'settings' && hasPermission('manageSettings')}
      <h2 class="text-2xl font-bold mb-4">Platform Settings</h2>
      <p>Configure global settings for the platform.</p>
    {:else}
      <p>You don't have permission to view this section.</p>
    {/if}
  </div>
</div>
