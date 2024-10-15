<script>
  import { auth } from '../../stores/auth';
  import Overview from './tabs/Overview.svelte';
  import Users from './tabs/Users.svelte';
  import Offers from './tabs/Offers.svelte';
  import Categories from './tabs/Categories.svelte';
  import Reports from './tabs/Reports.svelte';
  import Settings from './tabs/Settings.svelte';
  import Notifications from './tabs/Notifications.svelte';
  import { page } from '$app/stores';

  let activeTab = 'overview';

  const tabs = [
    { id: 'overview', name: 'Overview', permission: null, component: Overview },
    { id: 'users', name: 'Users', permission: 'manageUsers', component: Users },
    { id: 'offers', name: 'Offers', permission: 'manageOffers', component: Offers },
    { id: 'categories', name: 'Categories', permission: 'manageCategories', component: Categories },
    { id: 'reports', name: 'Reports', permission: 'viewReports', component: Reports },
    { id: 'notifications', name: 'Notifications', permission: 'manageNotifications', component: Notifications },
    { id: 'settings', name: 'Settings', permission: 'manageSettings', component: Settings }
  ];

  function hasPermission(permission) {
    if (!permission) return true;
    return $auth.user?.permissions?.includes(permission);
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
              class="bg-white inline-block py-2 px-4 font-semibold {activeTab === tab.id ? 'border-l border-t border-r rounded-t text-blue-700' : 'text-blue-500 hover:text-blue-800'} dark:bg-gray-900"
              on:click|preventDefault={() => activeTab = tab.id}
            >
              {tab.name}
            </a>
          </li>
        {/if}
      {/each}
    </ul>
  </div>

  <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 dark:bg-gray-800">
    {#each tabs as tab}
      {#if activeTab === tab.id && hasPermission(tab.permission)}
        <svelte:component 
          this={tab.component} 
          userId={tab.id === 'users' ? $page.url.searchParams.get('userId') : null}
        />
      {/if}
    {/each}
  </div>
</div>
