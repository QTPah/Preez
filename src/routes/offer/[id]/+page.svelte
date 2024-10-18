<script>
  import { page } from '$app/stores';
  import { isLoggedIn, auth } from '../../../stores/auth';
  import { onMount } from 'svelte';
  import ReportModal from '$lib/components/ReportModal.svelte';
  import { language } from '../../../stores/language';
  import { translations } from '$lib/translations';
  
  export let data;
  
  $: offer = data.offer;
  $: t = translations[$language];

  let purchaseStatus = '';
  let showReportModal = false;

  const tagColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-indigo-500',
    'bg-pink-500',
  ];

  function getTagColor(index) {
    return tagColors[index % tagColors.length];
  }

  async function handleBuy() {
    if ($isLoggedIn) {
      try {
        const response = await fetch(`http://localhost:5000/api/offers/${offer.id}/purchase`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${$auth.accesstoken}`
          }
        });
        const result = await response.json();
        if (result.success) {
          purchaseStatus = t.purchaseSuccessful;
        } else {
          purchaseStatus = result.message || t.purchaseFailed;
        }
      } catch (error) {
        console.error('Purchase error:', error);
        purchaseStatus = t.purchaseError;
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
    {#each offer.tags as tag, index}
      <span class="{getTagColor(index)} text-white text-xs font-semibold px-2 py-1 rounded">
        {tag}
      </span>
    {/each}
  </div>
  
  <p class="text-xl font-bold mb-4">${offer.price}</p>
  
  <p class="text-gray-700 mb-6">{offer.description}</p>
  
  <button
    on:click={handleBuy}
    class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-6"
  >
    {t.buyNow}
  </button>

  {#if purchaseStatus}
    <p class="text-lg font-semibold mb-6" class:text-green-500={purchaseStatus.includes('successful')} class:text-red-500={!purchaseStatus.includes('successful')}>
      {purchaseStatus}
    </p>
  {/if}
  
  <h2 class="text-2xl font-bold mb-4">{t.additionalDetails}</h2>
  
  <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
    {#each Object.entries(offer.customFields || {}) as [key, value]}
      <div>
        <dt class="font-semibold text-gray-600">{key}</dt>
        <dd>{value}</dd>
      </div>
    {/each}
  </dl>

  <button
    on:click={() => showReportModal = true}
    class="mt-6 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
  >
    {t.reportOffer}
  </button>

  {#if showReportModal}
    <ReportModal 
      offerId={offer._id} 
      on:close={() => showReportModal = false} 
    />
  {/if}
</div>
