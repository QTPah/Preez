<script>
  import OfferCard from '$lib/components/OfferCard.svelte';

  let searchQuery = '';

  const recommendedOffers = [
    { tags: ['math', 'midterm'], title: 'Math 101 Midterm', description: 'Comprehensive study guide for Math 101 midterm', price: 9.99 },
    { tags: ['biology', 'final'], title: 'Biology 201 Final Review', description: 'Detailed summary of key concepts for Biology 201 final', price: 14.99 },
    { tags: ['python', 'tutoring'], title: 'Python Tutoring', description: 'One-on-one Python programming tutoring sessions', price: 24.99 },
    { tags: ['history', 'quiz'], title: 'History 301 Quiz Bank', description: 'Practice quizzes for History 301 course', price: 7.99 },
    { tags: ['economics', 'summary'], title: 'Economics 202 Chapter Summaries', description: 'Concise summaries for all chapters in Economics 202', price: 19.99 },
    { tags: ['essay', 'proofreading'], title: 'Essay Proofreading', description: 'Professional proofreading for your essays', price: 12.99 },
  ];

  $: filteredOffers = searchQuery
    ? recommendedOffers.filter(offer =>
        offer.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : recommendedOffers;
</script>

<main class="px-4 py-8">
  <h1 class="text-4xl font-bold mb-8 text-center">Welcome to Preez</h1>
  <p class="text-xl mb-8 text-center">A marketplace for students to share and discover academic resources</p>
  
  <div class="mb-8">
    <input
      type="text"
      placeholder="Search for offers..."
      bind:value={searchQuery}
      class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <h2 class="text-3xl font-bold mb-6">Offers</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each filteredOffers as offer}
      <OfferCard {...offer} />
    {/each}
  </div>
</main>
