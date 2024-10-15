<script>
  import { onMount } from 'svelte';
  import { auth } from '../../stores/auth';
  import { getNotifications, markNotificationAsRead } from '$lib/api/notifications';
  import { clickOutside } from '$lib/actions/clickOutside';

  let notifications = [];
  let unreadCount = 0;
  let showInbox = false;
  let searchTerm = '';

  onMount(async () => {
    if ($auth.accessToken) {
      await fetchNotifications();
    }
  });

  $: {
    if ($auth.accessToken) {
      fetchNotifications();
    }
  }

  $: filteredNotifications = notifications.filter(notification =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function fetchNotifications() {
    try {
      const response = await getNotifications();
      notifications = response.notifications;
      unreadCount = notifications.filter(n => !n.read).length;
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }

  async function handleMarkAsRead(notificationId) {
    try {
      await markNotificationAsRead(notificationId);
      await fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  async function handleMarkAllAsRead() {
    try {
      await Promise.all(notifications.filter(n => !n.read).map(n => markNotificationAsRead(n._id)));
      await fetchNotifications();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }

  function toggleInbox() {
    showInbox = !showInbox;
    if (showInbox) {
      setTimeout(() => document.getElementById('notification-search').focus(), 0);
    }
  }

  function handleClickOutside() {
    showInbox = false;
    searchTerm = '';
  }
</script>

<div class="relative" use:clickOutside on:click_outside={handleClickOutside}>
  <button on:click={toggleInbox} class="flex items-center relative">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
    {#if unreadCount > 0}
      <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
    {/if}
  </button>

  <div class="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20 border border-gray-200 dark:border-white transition-all duration-200 ease-in-out transform origin-top-right"
       class:scale-95={!showInbox}
       class:scale-100={showInbox}
       class:opacity-0={!showInbox}
       class:opacity-100={showInbox}
       class:pointer-events-none={!showInbox}
       class:pointer-events-auto={showInbox}>
    {#if showInbox}
      <div class="px-4 py-2">
        <input
          id="notification-search"
          type="text"
          placeholder="Search notifications..."
          bind:value={searchTerm}
          class="w-full px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
      </div>
      <button 
        on:click={handleMarkAllAsRead}
        class="w-full text-left px-4 py-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
      >
        Mark all as read
      </button>
      <div class="max-h-60 overflow-y-auto">
        {#if filteredNotifications.length === 0}
          <p class="px-4 py-2 text-gray-700 dark:text-gray-300">No notifications</p>
        {:else}
          {#each filteredNotifications as notification}
            <div class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 {notification.read ? 'opacity-50' : ''} flex justify-between items-start">
              <div>
                <h3 class="text-sm font-semibold">{notification.title}</h3>
                <p class="text-xs text-gray-600 dark:text-gray-400">{notification.message}</p>
              </div>
              {#if !notification.read}
                <button on:click={() => handleMarkAsRead(notification._id)} class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  ✕
                </button>
              {/if}
            </div>
          {/each}
        {/if}
      </div>
    {/if}
  </div>
</div>
