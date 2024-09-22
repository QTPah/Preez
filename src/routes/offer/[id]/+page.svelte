<script>
  import { page } from '$app/stores';
  import { isLoggedIn, token } from '../../../stores/auth';
  import { onMount } from 'svelte';
  
  export let data;
  
  $: offer = data.offer;

  let purchaseStatus = '';

  async function handleBuy() {
    if ($isLoggedIn) {
      try {
        const response = await fetch(`http://localhost:5000/api/offers/${offer.id}/purchase`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${$token}`
          }
        });
        const result = await response.json();
        if (result.success) {
          purchaseStatus = 'Purchase successful!';
        } else {
          purchaseStatus = result.message || 'Purchase failed. Please try again.';
        }
      } catch (error) {
        console.error('Purchase error:', error);
        purchaseStatus = 'An error occurred during purchase. Please try again.';
      }
    } else {
      // Dispatch a custom event to open the auth form
      window.dispatchEvent(new CustomEvent('openAuthForm'));
    }
  }

  onMount(() => {
    // Reset purchase status when component mounts
    purchaseStatus = '';
  });
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

  {#if purchaseStatus}
    <p class="text-lg font-semibold mb-6" class:text-green-500={purchaseStatus.includes('successful')} class:text-red-500={!purchaseStatus.includes('successful')}>
      {purchaseStatus}
    </p>
  {/if}
  
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
