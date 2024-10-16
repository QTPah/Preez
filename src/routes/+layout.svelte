<script>
  import "../app.css";
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { auth, isLoggedIn } from '../stores/auth';
  import { theme } from '../stores/theme';
  import { login, register, logout, validateTokenAndFetchUser } from '$lib/api/auth';
  import AuthForm from '$lib/components/AuthForm.svelte';
  import NotificationsInbox from '$lib/components/NotificationsInbox.svelte';
  import ChatComponent from '$lib/components/ChatComponent.svelte';
  import { clickOutside } from '$lib/actions/clickOutside';
  import defaultProfile from '$lib/assets/default-picture.jpeg';

  let showAuthForm = false;
  let showDropdown = false;
  let showChat = false;
  let profilePicture = defaultProfile;

  async function validateToken() {
    if ($auth.accessToken) {
      try {
        const result = await validateTokenAndFetchUser($auth.accessToken);
        if (result.success) {
          auth.setSession({ accessToken: result.accessToken, refreshToken: $auth.refreshToken, user: result.user });
          profilePicture = result.user.profilePicture || defaultProfile;
        } else {
          auth.clearSession();
          profilePicture = defaultProfile;
        }
      } catch (error) {
        console.error('Failed to validate token and fetch user data:', error);
        auth.clearSession();
        profilePicture = defaultProfile;
      }
    } else {
      auth.clearSession();
      profilePicture = defaultProfile;
    }
  }

  // Validate token on initial load
  onMount(() => {
    validateToken();
  });

  // Validate token on every navigation
  $: {
    validateToken();
  }

  // Update profile picture when auth state changes
  $: {
    if ($auth.user && $auth.user.profilePicture) {
      profilePicture = $auth.user.profilePicture;
    } else {
      profilePicture = defaultProfile;
    }
  }

  function openAuthForm() {
    showAuthForm = true;
  }

  function closeAuthForm() {
    showAuthForm = false;
  }

  async function handleAuth(event) {
    const { mode, username, email, password } = event.detail;
    try {
      const result = mode === 'login' 
        ? await login(username, password)
        : await register(username, email, password);
      
      if (result.success) {
        auth.setSession(result);
        closeAuthForm();
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  }

  async function handleLogout() {
    try {
      await logout();
      auth.clearSession();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
</script>

<div class="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  <nav class="bg-gray-800 text-white p-2 sm:p-4" use:clickOutside on:click_outside={() => showDropdown = false}>
    <div class="container mx-auto flex flex-col sm:flex-row justify-between items-center">
      <a href="/" class="text-2xl font-bold mb-2 sm:mb-0">Preez</a>
      <ul class="flex flex-wrap justify-center sm:space-x-4 items-center text-sm sm:text-base">
        <li class="mx-2 my-1"><a href="/" class="hover:text-gray-300" class:font-bold={$page.url.pathname === '/'}>Home</a></li>
        <li class="mx-2 my-1"><a href="/about" class="hover:text-gray-300" class:font-bold={$page.url.pathname === '/about'}>About</a></li>
        <li class="mx-2 my-1"><a href="/contact" class="hover:text-gray-300" class:font-bold={$page.url.pathname === '/contact'}>Contact</a></li>
        {#if $isLoggedIn}
          <li class="mx-2 my-1">
            <NotificationsInbox />
          </li>
          <li class="mx-2 relative flex items-center">
            <button on:click={() => showDropdown = !showDropdown} class="focus:outline-none">
              <img src={profilePicture} alt="Profile" class="w-10 h-10 rounded-full object-cover">
            </button>
            <div class="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 transition-all duration-200 ease-in-out transform origin-top-right border border-gray-200 dark:border-white"
                 class:scale-95={!showDropdown}
                 class:scale-100={showDropdown}
                 class:opacity-0={!showDropdown}
                 class:opacity-100={showDropdown}
                 class:pointer-events-none={!showDropdown}
                 class:pointer-events-auto={showDropdown}>
              <div class="transition-all duration-200 ease-in-out" class:opacity-0={!showDropdown} class:scale-95={!showDropdown}>
                {#if $auth.user?.permissions?.includes('viewDashboard')}
                  <a href="/dashboard" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Dashboard</a>
                {/if}
                <a href="/settings" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Settings</a>
                <button on:click={handleLogout} class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</button>
              </div>
            </div>
          </li>
        {:else}
          <li class="mx-2 my-1">
            <button on:click={openAuthForm} class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded text-xs sm:text-sm">
              Login / Register
            </button>
          </li>
        {/if}
        <li class="mx-2 my-1">
          <button on:click={() => theme.toggleTheme()} class="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100">
            {$theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </li>
        <li class="mx-2 my-1">
          <button on:click={() => showChat = !showChat} class="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </button>
        </li>
      </ul>
    </div>
  </nav>

  {#if showAuthForm}
    <AuthForm on:close={closeAuthForm} on:auth={handleAuth} />
  {/if}

  <ChatComponent bind:isOpen={showChat} />

  <main class="flex-grow">
    <slot />
  </main>

  <footer class="bg-gray-800 text-white p-4">
    <div class="container mx-auto text-center">
      <p>&copy; 2023 Preez. All rights reserved.</p>
    </div>
  </footer>
</div>
