<script>
  import OfferCard from '$lib/components/OfferCard.svelte';
  import { recommendedOffers } from '../data/offers';

  let searchQuery = '';

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
    {#each filteredOffers as offer (offer.id)}
      <OfferCard {...offer} />
    {/each}
  </div>
</main>
