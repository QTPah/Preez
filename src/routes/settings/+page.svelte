<script>
  import { auth } from '../../stores/auth';
  import { onMount } from 'svelte';
  import { updateUserSettings, changePassword, updateUserProfile } from '$lib/api/auth';

  let activeSection = 'profile';
  let username = $auth.user?.username || '';
  let email = $auth.user?.email || '';
  let bio = $auth.user?.bio || '';
  let profilePicture = null;
  let deleteProfilePicture = false;
  let settings = {
    profileVisibility: 'public',
    showEmail: false,
    allowMessaging: true,
    emailNotifications: true,
    pushNotifications: false,
    offerUpdates: true,
    marketingEmails: false
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

  onMount(async () => {
    try {
      const userSettings = await auth.getUserSettings();
      console.log('User settings:', userSettings);
      if (userSettings) {
        settings = userSettings.settings;
      }
    } catch (error) {
      console.error('Error fetching user settings:', error);
      message = 'Failed to load user settings. Please try again.';
    }
  });

  let message = '';
  let messageType = '';

  async function handleSave() {
    if(activeSection == 'profile') {
      handleProfileSave();
      return;
    } else if(activeSection == 'account') {
      handlePasswordChange();
      return;
    }
    try {
      const result = await updateUserSettings(settings);
      if (result.success) {
        message = 'Settings saved successfully!';
        messageType = 'success';
        auth.updateUser({ ...auth.user, settings });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      message = 'Failed to save settings. Please try again.';
      messageType = 'error';
    }
    
    // Clear the message after 3 seconds
    setTimeout(() => {
      message = '';
      messageType = '';
    }, 3000);
  }

  async function handlePasswordChange() {
    if (newPassword !== confirmPassword) {
      message = 'New passwords do not match.';
      return;
    }
    try {
      const result = await changePassword(password, newPassword);
      if (result.success) {
        message = 'Password changed successfully!';
        password = '';
        newPassword = '';
        confirmPassword = '';
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      message = 'Failed to change password. Please try again.';
    }
  }

  async function handleProfileSave() {
    try {
      const result = await updateUserProfile({ username, email, bio, profilePicture, deleteProfilePicture });
      if (result.success) {
        message = 'Profile updated successfully!';
        messageType = 'success';
        auth.updateUser({ ...auth.user, username, email, bio, profilePicture: result.user.profilePicture });
        deleteProfilePicture = false;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      message = 'Failed to update profile. Please try again.';
      messageType = 'error';
    }
    
    // Clear the message after 3 seconds
    setTimeout(() => {
      message = '';
      messageType = '';
    }, 3000);
  }

  async function handleDeleteProfilePicture() {
    try {
      deleteProfilePicture = true;
      const result = await updateUserProfile({ username, email, bio, profilePicture, deleteProfilePicture });
 

      if (result.success) {
        message = 'Profile picture deleted successfully!';
        messageType = 'success';
        auth.updateUser({ ...auth.user, profilePicture: '' });
        profilePicture = null;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      message = 'Failed to delete profile picture. Please try again.';
      messageType = 'error';
    }
    
    // Clear the message after 3 seconds
    setTimeout(() => {
      message = '';
      messageType = '';
    }, 3000);
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">Settings</h1>
  
  {#if message}
    <div class={`mb-4 p-2 rounded ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
      {message}
    </div>
  {/if}

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
          <div class="mb-4">
            <label for="bio" class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              id="bio"
              bind:value={bio}
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <div class="mb-4">
            <label for="profilePicture" class="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              on:change={(e) => profilePicture = e.target.files[0]}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {#if profilePicture || $auth.user?.profilePicture}
            <div class="mb-4">
              <img
                src={profilePicture ? URL.createObjectURL(profilePicture) : $auth.user.profilePicture}
                alt="Profile Picture Preview"
                class="w-32 h-32 object-cover rounded-full"
              />
              <button
                type="button"
                on:click={handleDeleteProfilePicture}
                class="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Delete Profile Picture
              </button>
            </div>
          {/if}
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
        {:else if activeSection === 'notifications'}
          <h2 class="text-2xl font-semibold mb-4">Notification Preferences</h2>
          <div class="mb-4">
            <label class="flex items-center">
              <input type="checkbox" bind:checked={settings.emailNotifications} class="mr-2">
              Receive email notifications
            </label>
          </div>
          <div class="mb-4">
            <label class="flex items-center">
              <input type="checkbox" bind:checked={settings.pushNotifications} class="mr-2">
              Receive push notifications
            </label>
          </div>
          <div class="mb-4">
            <label class="flex items-center">
              <input type="checkbox" bind:checked={settings.offerUpdates} class="mr-2">
              Receive updates about your offers
            </label>
          </div>
          <div class="mb-4">
            <label class="flex items-center">
              <input type="checkbox" bind:checked={settings.marketingEmails} class="mr-2">
              Receive marketing emails
            </label>
          </div>
        {:else if activeSection === 'privacy'}
          <h2 class="text-2xl font-semibold mb-4">Privacy Settings</h2>
          <div class="mb-4">
            <label for="profile-visibility" class="block text-sm font-medium text-gray-700 mb-1">Profile Visibility</label>
            <select
              id="profile-visibility"
              bind:value={settings.profileVisibility}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="friends">Friends Only</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="flex items-center">
              <input type="checkbox" bind:checked={settings.showEmail} class="mr-2">
              Show email on profile
            </label>
          </div>
          <div class="mb-4">
            <label class="flex items-center">
              <input type="checkbox" bind:checked={settings.allowMessaging} class="mr-2">
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
