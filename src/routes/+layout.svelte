<script>
  import "../app.css";
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { auth, isLoggedIn } from '../stores/auth';
  import { login, register, logout, validateTokenAndFetchUser } from '$lib/api/auth';
  import AuthForm from '$lib/components/AuthForm.svelte';

  let showAuthForm = false;

  async function validateToken() {
    if ($auth.accessToken) {
      try {
        const result = await validateTokenAndFetchUser($auth.accessToken);
        if (result.success) {
          //$isLoggedIn = true;
          auth.setSession({ accessToken: result.accessToken, refreshToken: $auth.refreshToken, user: result.user });
        } else {
          //$isLoggedIn = false;
          auth.clearSession();
        }
      } catch (error) {
        //$isLoggedIn = false;
        console.error('Failed to validate token and fetch user data:', error);
        auth.clearSession();
      }
    } else {
      //$isLoggedIn = false;
      auth.clearSession();
    }
  }

  // Validate token on initial load
  validateToken();

  // Validate token on every navigation
  $: {
    $page;
    validateToken();
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
  <nav class="bg-gray-800 text-white p-4">
    <div class="container mx-auto flex justify-between items-center">
      <a href="/" class="text-2xl font-bold">Preez</a>
      <ul class="flex space-x-4 items-center">
        <li><a href="/" class="hover:text-gray-300" class:font-bold={$page.url.pathname === '/'}>Home</a></li>
        <li><a href="/about" class="hover:text-gray-300" class:font-bold={$page.url.pathname === '/about'}>About</a></li>
        <li><a href="/contact" class="hover:text-gray-300" class:font-bold={$page.url.pathname === '/contact'}>Contact</a></li>
        {#if $isLoggedIn}
          <li>
            <span class="mr-4">Welcome, {$auth.user?.username}!</span>
            <button on:click={handleLogout} class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
              Logout
            </button>
          </li>
        {:else}
          <li>
            <button on:click={openAuthForm} class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
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
