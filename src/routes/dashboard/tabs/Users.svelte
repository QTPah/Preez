<script>
  import { onMount } from 'svelte';
  import { getAllUsers, addUser, updateUser, deleteUser } from '$lib/api/users';

  let users = [];
  let loading = false;
  let editingUser = null;
  let showUserModal = false;
  let newPermission = '';

  onMount(loadUsers);

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
</script>

<h2 class="text-xl sm:text-2xl font-bold mb-4">User Management</h2>
{#if loading}
  <p>Loading users...</p>
{:else}
  <div class="overflow-x-auto">
    <table class="min-w-full">
      <thead>
        <tr>
          <th class="px-4 sm:px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Username</th>
          <th class="px-4 sm:px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
          <th class="px-4 sm:px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Permissions</th>
          <th class="px-4 sm:px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each users as user}
          <tr>
            <td class="px-4 sm:px-6 py-4 whitespace-no-wrap border-b border-gray-300">{user.username}</td>
            <td class="px-4 sm:px-6 py-4 whitespace-no-wrap border-b border-gray-300 hidden sm:table-cell">{user.email}</td>
            <td class="px-4 sm:px-6 py-4 whitespace-no-wrap border-b border-gray-300 hidden md:table-cell">
              <div class="flex flex-wrap">
                {#each user.permissions as permission}
                  <span class="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1">{permission}</span>
                {/each}
              </div>
            </td>
            <td class="px-4 sm:px-6 py-4 whitespace-no-wrap border-b border-gray-300">
              <button on:click={() => editUser(user)} class="text-blue-600 hover:text-blue-900 mr-2">Edit</button>
              <button on:click={() => deleteUserConfirm(user._id)} class="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <button on:click={addNewUser} class="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
    Add User
  </button>
{/if}

{#if showUserModal}
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" on:click={closeUserModal}>
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-900"
         on:click|stopPropagation>
      <div class="mt-3 text-center">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">{editingUser._id ? 'Edit User' : 'Add New User'}</h3>
        <div class="mt-2 px-7 py-3">
          <input type="text" placeholder="Username" bind:value={editingUser.username}
                 class="mb-3 px-3 py-2 border rounded-lg w-full dark:bg-gray-800 dark:text-white" />
          <input type="email" placeholder="Email" bind:value={editingUser.email}
                 class="mb-3 px-3 py-2 border rounded-lg w-full dark:bg-gray-800 dark:text-white" />
          <div class="mb-3">
            <label class="block text-gray-700 dark:text-gray-400 text-sm font-bold mb-2">Permissions</label>
            <div class="flex flex-wrap">
              {#each editingUser.permissions as permission}
                <span 
                  class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm font-medium mr-2 mb-2 px-2.5 py-0.5 rounded cursor-pointer hover:line-through"
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
                class="flex-grow mr-2 px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
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
                   class="mb-3 px-3 py-2 border rounded-lg w-full dark:bg-gray-800 dark:text-white" />
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
