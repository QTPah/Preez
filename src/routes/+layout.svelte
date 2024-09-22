<script>
  import "../app.css";
  import { page } from '$app/stores';
  import { fade } from 'svelte/transition';
  import { isLoggedIn } from '../stores/auth';
  import { login, register, logout } from '$lib/api/auth';

  let isLoginMode = true;
  let username = '';
  let password = '';
  let email = '';
  let showAuthForm = false;
  let errorMessage = '';

  function openAuthForm() {
    showAuthForm = true;
    isLoginMode = true;
    errorMessage = '';
  }

  function closeAuthForm() {
    showAuthForm = false;
    errorMessage = '';
  }

  function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    errorMessage = '';
  }

  async function handleAuth() {
    errorMessage = '';
    let result;
    
    if (isLoginMode) {
      result = await login(username, password);
    } else {
      result = await register(username, email, password);
    }

    if (result.success) {
      closeAuthForm();
    } else {
      errorMessage = result.message;
    }
  }

  async function handleLogout() {
    const result = await logout();
    if (result.success) {
      username = '';
      password = '';
      email = '';
    }
  }

  // Listen for the custom openAuthForm event
  import { onMount } from 'svelte';

  onMount(() => {
    window.addEventListener('openAuthForm', openAuthForm);
    return () => {
      window.removeEventListener('openAuthForm', openAuthForm);
    };
  });
</script>

<div class="flex flex-col min-h-screen">
  <nav class="bg-gray-800 text-white p-4">
    <div class="container mx-auto flex justify-between items-center">
      <a href="/" class="text-2xl font-bold">Preez</a>
      <ul class="flex space-x-4 items-center">
        <li><a href="/" class="hover:text-gray-300" class:font-bold={$page.url.pathname === '/'}>Home</a></li>
        <li><a href="/about" class="hover:text-gray-300" class:font-bold={$page.url.pathname === '/about'}>About</a></li>
        <li><a href="/contact" class="hover:text-gray-300" class:font-bold={$page.url.pathname === '/contact'}>Contact</a></li>
        {#if isLoggedIn}
          <li>
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
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" on:click={closeAuthForm}>
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
           on:click|stopPropagation>
        <div class="mt-3 text-center">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            {isLoginMode ? 'Login' : 'Register'}
          </h3>
          <div class="mt-2 px-7 py-3">
            <input
              type="text"
              placeholder="Username"
              bind:value={username}
              class="mb-3 px-3 py-2 border rounded-md w-full"
            />
            {#if !isLoginMode}
              <input
                type="email"
                placeholder="Email"
                bind:value={email}
                class="mb-3 px-3 py-2 border rounded-md w-full"
              />
            {/if}
            <input
              type="password"
              placeholder="Password"
              bind:value={password}
              class="mb-3 px-3 py-2 border rounded-md w-full"
            />
            {#if errorMessage}
              <p class="text-red-500 text-sm mb-3">{errorMessage}</p>
            {/if}
            <button
              on:click={handleAuth}
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
            >
              {isLoginMode ? 'Login' : 'Register'}
            </button>
            <p class="mt-4 text-sm">
              {isLoginMode ? "Don't have an account?" : "Already have an account?"}
              <button
                on:click={toggleAuthMode}
                class="text-blue-500 hover:text-blue-700"
              >
                {isLoginMode ? 'Register' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
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
