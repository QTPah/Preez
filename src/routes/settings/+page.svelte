<script>
  import { auth } from '../../stores/auth';

  let activeSection = 'profile';
  let username = $auth.user?.username || '';
  let email = $auth.user?.email || '';

  const sections = [
    { id: 'profile', name: 'Profile' },
    { id: 'account', name: 'Account' },
    { id: 'notifications', name: 'Notifications' },
    { id: 'privacy', name: 'Privacy' },
  ];

  function handleSave() {
    // TODO: Implement save functionality
    console.log('Saving settings...');
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">Settings</h1>

  <div class="flex flex-col md:flex-row gap-6">
    <div class="w-full md:w-1/4">
      <div class="bg-white shadow rounded-lg p-4">
        <ul>
          {#each sections as section}
            <li class="mb-2">
              <button
                class="w-full text-left py-2 px-4 rounded {activeSection === section.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}"
                on:click={() => activeSection = section.id}
              >
                {section.name}
              </button>
            </li>
          {/each}
        </ul>
      </div>
    </div>

    <div class="w-full md:w-3/4">
      <div class="bg-white shadow rounded-lg p-6">
        {#if activeSection === 'profile'}
          <h2 class="text-2xl font-semibold mb-4">Profile Settings</h2>
          <div class="mb-4">
            <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              id="username"
              bind:value={username}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              bind:value={email}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        {:else if activeSection === 'account'}
          <h2 class="text-2xl font-semibold mb-4">Account Settings</h2>
          <!-- Add account settings fields here -->
        {:else if activeSection === 'notifications'}
          <h2 class="text-2xl font-semibold mb-4">Notification Preferences</h2>
          <!-- Add notification settings fields here -->
        {:else if activeSection === 'privacy'}
          <h2 class="text-2xl font-semibold mb-4">Privacy Settings</h2>
          <!-- Add privacy settings fields here -->
        {/if}

        <button
          on:click={handleSave}
          class="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
</div>
