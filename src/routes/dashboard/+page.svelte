<script>
  import { onMount } from 'svelte';
  import { auth } from '../../stores/auth';
  import { getAllUsers } from '$lib/api/users';
  import { getAllOffers } from '$lib/api/offers';

  let activeTab = 'overview';
  let userPermissions = {};
  let users = [];
  let offers = [];
  let loading = false;

  const tabs = [
    { id: 'overview', name: 'Overview', permission: null },
    { id: 'users', name: 'Users', permission: 'manageUsers' },
    { id: 'offers', name: 'Offers', permission: 'manageOffers' },
    { id: 'categories', name: 'Categories', permission: 'manageCategories' },
    { id: 'reports', name: 'Reports', permission: 'viewReports' },
    { id: 'settings', name: 'Settings', permission: 'manageSettings' }
  ];

  onMount(() => {
    userPermissions = $auth.user?.permissions;
    console.log('User permissions:', userPermissions);
  });

  function hasPermission(permission) {
    console.log('Checking permission:', permission);
    console.log('User permissions:', permission == null || userPermissions[permission.trim()]);
    return permission === null || userPermissions[permission.trim()];
  }

  async function loadUsers() {
    loading = true;
    try {
      const response = await getAllUsers();
      users = response.users;
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      loading = false;
    }
  }

  async function loadOffers() {
    loading = true;
    try {
      const response = await getAllOffers();
      offers = response.offers;
    } catch (error) {
      console.error('Error loading offers:', error);
    } finally {
      loading = false;
    }
  }

  $: if (activeTab === 'users' && hasPermission('manageUsers')) {
    loadUsers();
  }

  $: if (activeTab === 'offers' && hasPermission('manageOffers')) {
    loadOffers();
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
      {#if loading}
        <p>Loading users...</p>
      {:else}
        <table class="min-w-full">
          <thead>
            <tr>
              <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each users as user}
              <tr>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{user.username}</td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{user.email}</td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                  <button class="text-blue-600 hover:text-blue-900">Edit</button>
                  <button class="ml-2 text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      {/if}
    {:else if activeTab === 'offers' && hasPermission('manageOffers')}
      <h2 class="text-2xl font-bold mb-4">Offer Management</h2>
      {#if loading}
        <p>Loading offers...</p>
      {:else}
        <table class="min-w-full">
          <thead>
            <tr>
              <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each offers as offer}
              <tr>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{offer.title}</td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-300">${offer.price}</td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{offer.category}</td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                  <button class="text-blue-600 hover:text-blue-900">Edit</button>
                  <button class="ml-2 text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      {/if}
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
