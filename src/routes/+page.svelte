<script>
  import { onMount } from 'svelte';
  import OfferCard from '$lib/components/OfferCard.svelte';
  import { getAllOffers } from '$lib/api/offers';

  let offers = [];
  let searchQuery = '';
  let isLoading = true;
  let error = null;

  onMount(async () => {
    try {
      offers = await getAllOffers();
      isLoading = false;
    } catch (err) {
      console.error('Error fetching offers:', err);
      error = 'Failed to load offers. Please try again later.';
      isLoading = false;
    }
  });

  $: filteredOffers = searchQuery
    ? offers.filter(offer =>
        offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : offers;
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
  
  {#if isLoading}
    <p class="text-center">Loading offers...</p>
  {:else if error}
    <p class="text-center text-red-500">{error}</p>
  {:else if filteredOffers.length === 0}
    <p class="text-center">No offers found.</p>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredOffers as offer (offer._id)}
        <OfferCard {...offer} />
      {/each}
    </div>
  {/if}
</main>
