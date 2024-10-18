<script>
  import { auth } from '../../stores/auth';
  import { onMount } from 'svelte';
  import { updateUserSettings, changePassword, updateUserProfile } from '$lib/api/auth';
  import defaultProfile from '$lib/assets/default-picture.jpeg';
  import { language } from '../../stores/language';
  import { translations } from '$lib/translations';

  $: t = translations[$language];

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
    { id: 'profile', name: t.profileSettings },
    { id: 'account', name: t.accountSettings },
    { id: 'notifications', name: t.notificationPreferences },
    { id: 'privacy', name: t.privacySettings },
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

  function handleEditProfilePicture() {
    document.getElementById('profilePicture').click();
  }
</script>

<div class="container mx-auto px-4 py-8 dark:bg-gray-900">
  <h1 class="text-3xl font-bold mb-6 dark:text-white">{t.settings}</h1>
  
  {#if message}
    <div class={`mb-4 p-2 rounded ${messageType === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200' : 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200'}`}>
      {message}
    </div>
  {/if}

  <div class="flex flex-col md:flex-row gap-6">
    <div class="w-full md:w-1/4">
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <ul>
          {#each sections as section}
            <li class="mb-2">
              <button
                class="w-full text-left py-2 px-4 rounded {activeSection === section.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-600'} dark:text-white"
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
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        {#if activeSection === 'profile'}
          <div class="mb-6 flex items-center">
            <img
              src={profilePicture ? URL.createObjectURL(profilePicture) : $auth.user?.profilePicture || defaultProfile }
              alt="Profile Picture"
              class="w-32 h-32 object-cover rounded-full mr-4"
            />
            <div>
              <button
                type="button"
                on:click={handleEditProfilePicture}
                class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2"
              >
                {t.editProfilePicture}
              </button>
              <button
                type="button"
                on:click={handleDeleteProfilePicture}
                class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                {t.deleteProfilePicture}
              </button>
            </div>
          </div>
          <input
            type="file"
            id="profilePicture"
            accept="image/*"
            on:change={(e) => profilePicture = e.target.files[0]}
            class="hidden"
          />
          <h2 class="text-2xl font-semibold mb-4 dark:text-white">{t.profileSettings}</h2>
          <div class="mb-4">
            <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.username}</label>
            <input
              type="text"
              id="username"
              bind:value={username}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-500 dark:text-white"
            />
          </div>
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.email}</label>
            <input
              type="email"
              id="email"
              bind:value={email}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-500 dark:text-white"
            />
          </div>
          <div class="mb-4">
            <label for="bio" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.bio}</label>
            <textarea
              id="bio"
              bind:value={bio}
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-500 dark:text-white"
            ></textarea>
          </div>
        {:else if activeSection === 'account'}
          <h2 class="text-2xl font-semibold mb-4 dark:text-white">{t.accountSettings}</h2>
          <div class="mb-4">
            <label for="current-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.currentPassword}</label>
            <input
              type="password"
              id="current-password"
              bind:value={password}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-500 dark:text-white"
            />
          </div>
          <div class="mb-4">
            <label for="new-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.newPassword}</label>
            <input
              type="password"
              id="new-password"
              bind:value={newPassword}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-500 dark:text-white"
            />
          </div>
          <div class="mb-4">
            <label for="confirm-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.confirmNewPassword}</label>
            <input
              type="password"
              id="confirm-password"
              bind:value={confirmPassword}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-500 dark:text-white"
            />
          </div>
        {:else if activeSection === 'notifications'}
          <h2 class="text-2xl font-semibold mb-4 dark:text-white">{t.notificationPreferences}</h2>
          <div class="mb-4">
            <label class="flex items-center text-gray-700 dark:text-gray-300">
              <input type="checkbox" bind:checked={settings.emailNotifications} class="mr-2">
              {t.receiveEmailNotifications}
            </label>
          </div>
          <div class="mb-4">
            <label class="flex items-center text-gray-700 dark:text-gray-300">
              <input type="checkbox" bind:checked={settings.pushNotifications} class="mr-2">
              {t.receivePushNotifications}
            </label>
          </div>
          <div class="mb-4">
            <label class="flex items-center text-gray-700 dark:text-gray-300">
              <input type="checkbox" bind:checked={settings.offerUpdates} class="mr-2">
              {t.receiveOfferUpdates}
            </label>
          </div>
          <div class="mb-4">
            <label class="flex items-center text-gray-700 dark:text-gray-300">
              <input type="checkbox" bind:checked={settings.marketingEmails} class="mr-2">
              {t.receiveMarketingEmails}
            </label>
          </div>
        {:else if activeSection === 'privacy'}
          <h2 class="text-2xl font-semibold mb-4 dark:text-white">{t.privacySettings}</h2>
          <div class="mb-4">
            <label for="profile-visibility" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.profileVisibility}</label>
            <select
              id="profile-visibility"
              bind:value={settings.profileVisibility}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-500 dark:text-white"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="friends">Friends Only</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="flex items-center text-gray-700 dark:text-gray-300">
              <input type="checkbox" bind:checked={settings.showEmail} class="mr-2">
              {t.showEmailOnProfile}
            </label>
          </div>
          <div class="mb-4">
            <label class="flex items-center text-gray-700 dark:text-gray-300">
              <input type="checkbox" bind:checked={settings.allowMessaging} class="mr-2">
              {t.allowMessaging}
            </label>
          </div>
        {/if}

        <button
          on:click={handleSave}
          class="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {t.saveChanges}
        </button>
      </div>
    </div>
  </div>
</div>
