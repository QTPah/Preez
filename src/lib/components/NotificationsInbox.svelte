<script>
  import { onMount } from 'svelte';
  import { auth } from '../../stores/auth';
  import { getNotifications, markNotificationAsRead } from '$lib/api/notifications';

  let notifications = [];
  let unreadCount = 0;
  let showInbox = false;

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

  function toggleInbox() {
    showInbox = !showInbox;
  }
</script>

<div class="relative">
  <button on:click={toggleInbox} class="flex items-center">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
    {#if unreadCount > 0}
      <span class="bg-red-500 text-white rounded-full px-2 py-1 text-xs ml-1">{unreadCount}</span>
    {/if}
  </button>

  {#if showInbox}
    <div class="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20">
      {#if notifications.length === 0}
        <p class="px-4 py-2 text-gray-700 dark:text-gray-300">No notifications</p>
      {:else}
        {#each notifications as notification}
          <div class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 {notification.read ? 'opacity-50' : ''}">
            <h3 class="text-sm font-semibold">{notification.title}</h3>
            <p class="text-xs text-gray-600 dark:text-gray-400">{notification.message}</p>
            {#if !notification.read}
              <button on:click={() => handleMarkAsRead(notification._id)} class="text-xs text-blue-500 mt-1">Mark as read</button>
            {/if}
          </div>
        {/each}
      {/if}
    </div>
  {/if}
</div>
