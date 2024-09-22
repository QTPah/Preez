<script>
  import { goto } from '$app/navigation';
  import OfferCard from '$lib/components/OfferCard.svelte';

  function navigateTo(path) {
    goto(path);
  }

  const recommendedOffers = [
    { type: 'test', title: 'Math 101 Midterm', description: 'Comprehensive study guide for Math 101 midterm', price: 9.99 },
    { type: 'summary', title: 'Biology 201 Final Review', description: 'Detailed summary of key concepts for Biology 201 final', price: 14.99 },
    { type: 'service', title: 'Python Tutoring', description: 'One-on-one Python programming tutoring sessions', price: 24.99 },
    { type: 'test', title: 'History 301 Quiz Bank', description: 'Practice quizzes for History 301 course', price: 7.99 },
    { type: 'summary', title: 'Economics 202 Chapter Summaries', description: 'Concise summaries for all chapters in Economics 202', price: 19.99 },
    { type: 'service', title: 'Essay Proofreading', description: 'Professional proofreading for your essays', price: 12.99 },
  ];
</script>

<main class="container mx-auto px-4 py-8">
  <h1 class="text-4xl font-bold mb-8 text-center">Welcome to Preez</h1>
  <p class="text-xl mb-8 text-center">A marketplace for students to share Tests, Summaries, and Services</p>
  
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
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

  <h2 class="text-3xl font-bold mb-6">Recommended Offers</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each recommendedOffers as offer}
      <OfferCard {...offer} />
    {/each}
  </div>
</main>
