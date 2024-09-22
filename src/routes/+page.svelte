<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<script>
  import { goto } from '$app/navigation';

  function navigateTo(path) {
    goto(path);
  }
</script>

<main class="container mx-auto px-4 py-8">
  <h1 class="text-4xl font-bold mb-8 text-center">Welcome to Preez</h1>
  <p class="text-xl mb-8 text-center">A marketplace for students to share Tests, Summaries, and Services</p>
  
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    <button
      on:click={() => navigateTo('/tests')}
      class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg text-xl"
    >
      Tests
    </button>
    <button
      on:click={() => navigateTo('/summaries')}
      class="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg text-xl"
    >
      Summaries
    </button>
    <button
      on:click={() => navigateTo('/services')}
      class="bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-6 rounded-lg text-xl"
    >
      Services
    </button>
  </div>
</main>
