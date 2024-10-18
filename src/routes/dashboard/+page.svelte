<script>
  import { auth } from '../../stores/auth';
  import Overview from './tabs/Overview.svelte';
  import Users from './tabs/Users.svelte';
  import Offers from './tabs/Offers.svelte';
  import Categories from './tabs/Categories.svelte';
  import Reports from './tabs/Reports.svelte';
  import Settings from './tabs/Settings.svelte';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let activeTab;

  const tabs = [
    { id: 'overview', name: 'Overview', permission: null, component: Overview },
    { id: 'users', name: 'Users', permission: 'manageUsers', component: Users },
    { id: 'offers', name: 'Offers', permission: 'manageOffers', component: Offers },
    { id: 'categories', name: 'Categories', permission: 'manageCategories', component: Categories },
    { id: 'reports', name: 'Reports', permission: 'viewReports', component: Reports },
    { id: 'settings', name: 'Settings', permission: 'manageSettings', component: Settings }
  ];

  function hasPermission(permission) {
    if (!permission) return true;
    if (Array.isArray(permission)) {
      return permission.some(perm => $auth.user?.permissions?.includes(perm));
    }
    return $auth.user?.permissions?.includes(permission);
  }

  function setActiveTab(tabId) {
    if (hasPermission(tabs.find(tab => tab.id === tabId)?.permission)) {
      activeTab = tabId;
      goto(`/dashboard?tab=${tabId}`, { replaceState: true });
    }
  }

  onMount(() => {
    const tabFromUrl = $page.url.searchParams.get('tab');
    if (tabFromUrl && tabs.some(tab => tab.id === tabFromUrl && hasPermission(tab.permission))) {
      activeTab = tabFromUrl;
    } else {
      activeTab = 'overview';
    }
  });
</script>

<div class="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
  <h1 class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Dashboard</h1>

  <div class="mb-4 sm:mb-6 overflow-x-auto">
    <ul class="flex flex-nowrap border-b">
      {#each tabs as tab}
        {#if hasPermission(tab.permission)}
          <li class="-mb-px mr-1">
            <a
              href="/dashboard?tab={tab.id}"
              class="bg-white inline-block py-2 px-3 sm:px-4 text-sm sm:text-base font-semibold whitespace-nowrap {activeTab === tab.id ? 'border-l border-t border-r rounded-t text-blue-700' : 'text-blue-500 hover:text-blue-800'} dark:bg-gray-900"
              on:click|preventDefault={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </a>
          </li>
        {/if}
      {/each}
    </ul>
  </div>

  <div class="bg-white shadow-md rounded px-4 sm:px-8 pt-4 sm:pt-6 pb-6 sm:pb-8 mb-4 dark:bg-gray-800">
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
