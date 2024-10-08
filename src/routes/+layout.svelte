<script>
  import "../app.css";
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { auth, isLoggedIn } from '../stores/auth';
  import { login, register, logout, validateTokenAndFetchUser } from '$lib/api/auth';
  import AuthForm from '$lib/components/AuthForm.svelte';
  import { clickOutside } from '$lib/actions/clickOutside';
  import defaultProfile from '$lib/assets/default-picture.jpeg';

  let showAuthForm = false;
  let showDropdown = false;
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

<div class="flex flex-col min-h-screen">
  <nav class="bg-gray-800 text-white p-2 sm:p-4" use:clickOutside on:click_outside={() => showDropdown = false}>
    <div class="container mx-auto flex flex-col sm:flex-row justify-between items-center">
      <a href="/" class="text-2xl font-bold mb-2 sm:mb-0">Preez</a>
      <ul class="flex flex-wrap justify-center sm:space-x-4 items-center text-sm sm:text-base">
        <li class="mx-2 my-1"><a href="/" class="hover:text-gray-300" class:font-bold={$page.url.pathname === '/'}>Home</a></li>
        <li class="mx-2 my-1"><a href="/about" class="hover:text-gray-300" class:font-bold={$page.url.pathname === '/about'}>About</a></li>
        <li class="mx-2 my-1"><a href="/contact" class="hover:text-gray-300" class:font-bold={$page.url.pathname === '/contact'}>Contact</a></li>
        {#if $isLoggedIn}
          <li class="mx-2 relative flex items-center">
            <button on:click={() => showDropdown = !showDropdown} class="focus:outline-none">
              <img src={profilePicture} alt="Profile" class="w-10 h-10 rounded-full object-cover">
            </button>
            <div class="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 transition-all duration-200 ease-in-out transform origin-top-right"
                 class:scale-95={!showDropdown}
                 class:scale-100={showDropdown}
                 class:opacity-0={!showDropdown}
                 class:opacity-100={showDropdown}
                 class:pointer-events-none={!showDropdown}
                 class:pointer-events-auto={showDropdown}>
              {#if showDropdown}
                {#if $auth.user?.permissions?.includes('adminAccess')}
                  <a href="/dashboard" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</a>
                {/if}
                <a href="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                <button on:click={handleLogout} class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
              {/if}
            </div>
          </li>
        {:else}
          <li class="mx-2 my-1">
            <button on:click={openAuthForm} class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded text-xs sm:text-sm">
              Login / Register
            </button>
          </li>
        {/if}
      </ul>
    </div>
  </nav>

  {#if showAuthForm}
    <AuthForm on:close={closeAuthForm} on:auth={handleAuth} />
  {/if}

  <main class="flex-grow">
    <slot />
  </main>

  <footer class="bg-gray-800 text-white p-4">
    <div class="container mx-auto text-center">
      <p>&copy; 2023 Preez. All rights reserved.</p>
    </div>
  </footer>
</div>
