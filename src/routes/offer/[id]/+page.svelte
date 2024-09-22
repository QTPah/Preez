<script>
  import { page } from '$app/stores';
  import { isLoggedIn, showAuthForm } from '../../../stores/auth';
  
  export let data;
  
  $: offer = data.offer;

  function handleBuy() {
    if ($isLoggedIn) {
      // Implement buy logic here
      alert('Purchase successful!');
    } else {
      $showAuthForm = true;
    }
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-4">{offer.title}</h1>
  
  <div class="flex flex-wrap gap-2 mb-4">
    {#each offer.tags as tag}
      <span class="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">{tag}</span>
    {/each}
  </div>
  
  <p class="text-xl font-bold mb-4">${offer.price}</p>
  
  <p class="text-gray-700 mb-6">{offer.description}</p>
  
  <button
    on:click={handleBuy}
    class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-6"
  >
    Buy Now
  </button>
  
  <h2 class="text-2xl font-bold mb-4">Additional Details</h2>
  
  <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
    {#each Object.entries(offer.customFields) as [key, value]}
      <div>
        <dt class="font-semibold text-gray-600">{key}</dt>
        <dd>{value}</dd>
      </div>
    {/each}
  </dl>
</div>
