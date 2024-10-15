<script>
  import { createEventDispatcher } from 'svelte';
  import { getAllUsers } from '$lib/api/users';
  import { debounce } from 'lodash-es';

  export let selectedUsers = [];
  export let placeholder = 'Search users...';

  const dispatch = createEventDispatcher();

  let searchTerm = '';
  let users = [];
  let loading = false;

  const debouncedSearch = debounce(async () => {
    if (searchTerm.length < 2) {
      users = [];
      return;
    }

    loading = true;
    try {
      const response = await getAllUsers();
      users = response.users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      loading = false;
    }
  }, 300);

  function handleInput() {
    debouncedSearch();
  }

  function selectUser(user) {
    if (!selectedUsers.some(u => u._id === user._id)) {
      selectedUsers = [...selectedUsers, user];
      dispatch('select', { users: selectedUsers });
    }
    searchTerm = '';
    users = [];
  }

  function removeUser(userId) {
    selectedUsers = selectedUsers.filter(u => u._id !== userId);
    dispatch('select', { users: selectedUsers });
  }
</script>

<div class="relative">
  <input
    type="text"
    bind:value={searchTerm}
    on:input={handleInput}
    {placeholder}
    class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
  />
  
  {#if loading}
    <div class="absolute z-10 w-full bg-white dark:bg-gray-800 border rounded mt-1 p-2">
      Loading...
    </div>
  {:else if users.length > 0}
    <ul class="absolute z-10 w-full bg-white dark:bg-gray-800 border rounded mt-1 max-h-60 overflow-y-auto">
      {#each users as user}
        <li 
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          on:click={() => selectUser(user)}
        >
          {user.username} ({user.email})
        </li>
      {/each}
    </ul>
  {/if}
</div>

<div class="mt-2 flex flex-wrap gap-2">
  {#each selectedUsers as user}
    <div class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded flex items-center">
      <span>{user.username}</span>
      <button 
        on:click={() => removeUser(user._id)}
        class="ml-2 text-sm font-bold"
      >
        &times;
      </button>
    </div>
  {/each}
</div>
