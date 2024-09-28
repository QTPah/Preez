<script>
  import { auth } from '../../stores/auth';
  import { onMount } from 'svelte';

  let activeSection = 'profile';
  let username = $auth.user?.username || '';
  let email = $auth.user?.email || '';
  let notificationPreferences = {
    emailNotifications: true,
    pushNotifications: false,
    offerUpdates: true,
    marketingEmails: false
  };
  let privacySettings = {
    profileVisibility: 'public',
    showEmail: false,
    allowMessaging: true
  };
  let password = '';
  let newPassword = '';
  let confirmPassword = '';

  const sections = [
    { id: 'profile', name: 'Profile' },
    { id: 'account', name: 'Account' },
    { id: 'notifications', name: 'Notifications' },
    { id: 'privacy', name: 'Privacy' },
  ];

  onMount(() => {
    // TODO: Fetch user settings from the server
    console.log('Fetching user settings...');
  });

  async function handleSave() {
    // TODO: Implement save functionality
    console.log('Saving settings...');
    // Here you would typically send the updated settings to your server
  }

  function handlePasswordChange() {
    // TODO: Implement password change functionality
    console.log('Changing password...');
    // Here you would typically send the password change request to your server
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
          <div class="mb-4">
            <label for="current-password" class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              id="current-password"
              bind:value={password}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="mb-4">
            <label for="new-password" class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              id="new-password"
              bind:value={newPassword}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="mb-4">
            <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              id="confirm-password"
              bind:value={confirmPassword}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            on:click={handlePasswordChange}
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Change Password
          </button>
        {:else if activeSection === 'notifications'}
          <h2 class="text-2xl font-semibold mb-4">Notification Preferences</h2>
          <div class="mb-4">
            <label class="flex items-center">
              <input type="checkbox" bind:checked={notificationPreferences.emailNotifications} class="mr-2">
              Receive email notifications
            </label>
          </div>
          <div class="mb-4">
            <label class="flex items-center">
              <input type="checkbox" bind:checked={notificationPreferences.pushNotifications} class="mr-2">
              Receive push notifications
            </label>
          </div>
          <div class="mb-4">
            <label class="flex items-center">
              <input type="checkbox" bind:checked={notificationPreferences.offerUpdates} class="mr-2">
              Receive updates about your offers
            </label>
          </div>
          <div class="mb-4">
            <label class="flex items-center">
              <input type="checkbox" bind:checked={notificationPreferences.marketingEmails} class="mr-2">
              Receive marketing emails
            </label>
          </div>
        {:else if activeSection === 'privacy'}
          <h2 class="text-2xl font-semibold mb-4">Privacy Settings</h2>
          <div class="mb-4">
            <label for="profile-visibility" class="block text-sm font-medium text-gray-700 mb-1">Profile Visibility</label>
            <select
              id="profile-visibility"
              bind:value={privacySettings.profileVisibility}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="friends">Friends Only</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="flex items-center">
              <input type="checkbox" bind:checked={privacySettings.showEmail} class="mr-2">
              Show email on profile
            </label>
          </div>
          <div class="mb-4">
            <label class="flex items-center">
              <input type="checkbox" bind:checked={privacySettings.allowMessaging} class="mr-2">
              Allow other users to message you
            </label>
          </div>
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
