<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let isLoginMode = true;
  let username = '';
  let password = '';
  let email = '';
  let errorMessage = '';

  function closeAuthForm() {
    dispatch('close');
  }

  function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    errorMessage = '';
  }

  function handleAuth() {
    errorMessage = '';
    dispatch('auth', {
      mode: isLoginMode ? 'login' : 'register',
      username,
      email,
      password
    });
  }
</script>

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
