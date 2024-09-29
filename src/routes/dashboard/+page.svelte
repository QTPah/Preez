<script>
  import { onMount } from 'svelte';
  import { auth } from '../../stores/auth';
  import { getAllUsers, addUser, updateUser, deleteUser } from '$lib/api/users';
  import { getAllOffers, updateOffer, deleteOffer } from '$lib/api/offers';

  let activeTab = 'overview';
  let users = [];
  let offers = [];
  let loading = false;
  let editingUser = null;
  let editingOffer = null;
  let showOfferModal = false;

  const tabs = [
    { id: 'overview', name: 'Overview', permission: null },
    { id: 'users', name: 'Users', permission: 'manageUsers' },
    { id: 'offers', name: 'Offers', permission: 'manageOffers' },
    { id: 'categories', name: 'Categories', permission: 'manageCategories' },
    { id: 'reports', name: 'Reports', permission: 'viewReports' },
    { id: 'settings', name: 'Settings', permission: 'manageSettings' }
  ];

  function hasPermission(permission) {
    if (!permission) return true;
    console.log($auth.user);
    return $auth.user?.permissions?.includes(permission);
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

  let showUserModal = false;
  let newPermission = '';

  function editUser(user) {
    editingUser = { ...user };
    showUserModal = true;
  }

  async function saveUser() {
    try {
      const userData = { ...editingUser };
      if (newPermission && !userData.permissions.includes(newPermission)) {
        userData.permissions.push(newPermission);
      }
      if (editingUser._id) {
        await updateUser(editingUser._id, userData);
      } else {
        await addUser(userData);
      }
      loadUsers();
      closeUserModal();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }

  function addNewUser() {
    editingUser = { username: '', email: '', permissions: [] };
    showUserModal = true;
  }

  function closeUserModal() {
    showUserModal = false;
    editingUser = null;
  }

  async function deleteUserConfirm(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        loadUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  }

  function editOffer(offer) {
    editingOffer = { ...offer };
    showOfferModal = true;
  }

  async function saveOffer() {
    try {
      await updateOffer(editingOffer._id, editingOffer);
      loadOffers();
      closeOfferModal();
    } catch (error) {
      console.error('Error saving offer:', error);
    }
  }

  function closeOfferModal() {
    showOfferModal = false;
    editingOffer = null;
  }

  async function deleteOfferConfirm(offerId) {
    if (confirm('Are you sure you want to delete this offer?')) {
      try {
        await deleteOffer(offerId);
        loadOffers();
      } catch (error) {
        console.error('Error deleting offer:', error);
      }
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
              <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
              <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each users as user}
              <tr>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{user.username}</td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{user.email}</td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                  {#each user.permissions as permission}
                    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{permission}</span>
                  {/each}
                </td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                  <button on:click={() => editUser(user)} class="text-blue-600 hover:text-blue-900">Edit</button>
                  <button on:click={() => deleteUserConfirm(user._id)} class="ml-2 text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
        <button on:click={addNewUser} class="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          Add User
        </button>
      {/if}

      {#if showUserModal}
        <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" on:click={closeUserModal}>
          <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
               on:click|stopPropagation>
            <div class="mt-3 text-center">
              <h3 class="text-lg leading-6 font-medium text-gray-900">{editingUser._id ? 'Edit User' : 'Add New User'}</h3>
              <div class="mt-2 px-7 py-3">
                <input type="text" placeholder="Username" bind:value={editingUser.username}
                       class="mb-3 px-3 py-2 border rounded-lg w-full" />
                <input type="email" placeholder="Email" bind:value={editingUser.email}
                       class="mb-3 px-3 py-2 border rounded-lg w-full" />
                <div class="mb-3">
                  <label class="block text-gray-700 text-sm font-bold mb-2">Permissions</label>
                  <div class="flex flex-wrap">
                    {#each editingUser.permissions as permission}
                      <span 
                        class="bg-blue-100 text-blue-800 text-sm font-medium mr-2 mb-2 px-2.5 py-0.5 rounded cursor-pointer hover:line-through"
                        on:click={() => editingUser.permissions = editingUser.permissions.filter(p => p !== permission)}
                      >
                        {permission}
                      </span>
                    {/each}
                  </div>
                  <div class="flex mt-2">
                    <input 
                      type="text" 
                      placeholder="Add new permission" 
                      class="flex-grow mr-2 px-3 py-2 border rounded-lg"
                      bind:value={newPermission}
                    />
                    <button 
                      on:click={() => {
                        if (newPermission && !editingUser.permissions.includes(newPermission)) {
                          editingUser.permissions = [...editingUser.permissions, newPermission];
                          newPermission = '';
                        }
                      }}
                      class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Add
                    </button>
                  </div>
                </div>
                {#if !editingUser._id}
                  <input type="password" placeholder="Password" bind:value={editingUser.password}
                         class="mb-3 px-3 py-2 border rounded-lg w-full" />
                {/if}
              </div>
              <div class="items-center px-4 py-3">
                <button on:click={saveUser}
                        class="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300">
                  {editingUser._id ? 'Update User' : 'Add User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      {/if}

      {#if showOfferModal}
        <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" on:click={closeOfferModal}>
          <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
               on:click|stopPropagation>
            <div class="mt-3 text-center">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Edit Offer</h3>
              <div class="mt-2 px-7 py-3">
                <input type="text" placeholder="Title" bind:value={editingOffer.title}
                       class="mb-3 px-3 py-2 border rounded-lg w-full" />
                <input type="number" placeholder="Price" bind:value={editingOffer.price}
                       class="mb-3 px-3 py-2 border rounded-lg w-full" />
                <input type="text" placeholder="Category" bind:value={editingOffer.category}
                       class="mb-3 px-3 py-2 border rounded-lg w-full" />
                <textarea placeholder="Description" bind:value={editingOffer.description}
                          class="mb-3 px-3 py-2 border rounded-lg w-full" rows="3"></textarea>
              </div>
              <div class="items-center px-4 py-3">
                <button on:click={saveOffer}
                        class="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300">
                  Update Offer
                </button>
              </div>
            </div>
          </div>
        </div>
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
                  <button on:click={() => editOffer(offer)} class="text-blue-600 hover:text-blue-900">Edit</button>
                  <button on:click={() => deleteOfferConfirm(offer._id)} class="ml-2 text-red-600 hover:text-red-900">Delete</button>
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
