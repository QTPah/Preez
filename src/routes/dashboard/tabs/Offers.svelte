<script>
  import { onMount } from 'svelte';
  import { getAllOffers, updateOffer, deleteOffer } from '$lib/api/offers';

  let offers = [];
  let loading = false;
  let editingOffer = null;
  let showOfferModal = false;
  let newTag = '';

  onMount(loadOffers);

  async function loadOffers() {
    loading = true;
    try {
      const response = await getAllOffers();
      offers = response.offers;
    } catch (error) {
      console.error('Error loading offers:', error);
    } finally {
      loading = false;
    }
  }

  function editOffer(offer) {
    editingOffer = { ...offer };
    showOfferModal = true;
  }

  async function saveOffer() {
    try {
      await updateOffer(editingOffer._id, editingOffer);
      loadOffers();
      closeOfferModal();
    } catch (error) {
      console.error('Error saving offer:', error);
    }
  }

  function closeOfferModal() {
    showOfferModal = false;
    editingOffer = null;
    newTag = '';
  }

  async function deleteOfferConfirm(offerId) {
    if (confirm('Are you sure you want to delete this offer?')) {
      try {
        await deleteOffer(offerId);
        loadOffers();
      } catch (error) {
        console.error('Error deleting offer:', error);
      }
    }
  }
</script>

<h2 class="text-2xl font-bold mb-4">Offer Management</h2>
{#if loading}
  <p>Loading offers...</p>
{:else}
  <table class="min-w-full">
    <thead>
      <tr>
        <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Title</th>
        <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Price</th>
        <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Category</th>
        <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each offers as offer}
        <tr>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{offer.title}</td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-300">${offer.price}</td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{offer.category}</td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
            <button on:click={() => editOffer(offer)} class="text-blue-600 hover:text-blue-900">Edit</button>
            <button on:click={() => deleteOfferConfirm(offer._id)} class="ml-2 text-red-600 hover:text-red-900">Delete</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

{#if showOfferModal}
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" on:click={closeOfferModal}>
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
         on:click|stopPropagation>
      <div class="mt-3 text-center">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Edit Offer</h3>
        <div class="mt-2 px-7 py-3">
          <input type="text" placeholder="Title" bind:value={editingOffer.title}
                 class="mb-3 px-3 py-2 border rounded-lg w-full" />
          <input type="number" placeholder="Price" bind:value={editingOffer.price}
                 class="mb-3 px-3 py-2 border rounded-lg w-full" />
          <input type="text" placeholder="Category" bind:value={editingOffer.category}
                 class="mb-3 px-3 py-2 border rounded-lg w-full" />
          <textarea placeholder="Description" bind:value={editingOffer.description}
                    class="mb-3 px-3 py-2 border rounded-lg w-full" rows="3"></textarea>
          <div class="mb-3">
            <label class="block text-gray-700 text-sm font-bold mb-2">Tags</label>
            <div class="flex flex-wrap">
              {#each editingOffer.tags as tag}
                <span 
                  class="bg-blue-100 text-blue-800 text-sm font-medium mr-2 mb-2 px-2.5 py-0.5 rounded cursor-pointer hover:line-through"
                  on:click={() => editingOffer.tags = editingOffer.tags.filter(t => t !== tag)}
                >
                  {tag}
                </span>
              {/each}
            </div>
            <div class="flex mt-2">
              <input 
                type="text" 
                placeholder="Add new tag" 
                class="flex-grow mr-2 px-3 py-2 border rounded-lg"
                bind:value={newTag}
              />
              <button 
                on:click={() => {
                  if (newTag && !editingOffer.tags.includes(newTag)) {
                    editingOffer.tags = [...editingOffer.tags, newTag];
                    newTag = '';
                  }
                }}
                class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
        <div class="items-center px-4 py-3">
          <button on:click={saveOffer}
                  class="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300">
            Update Offer
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
