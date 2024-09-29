<script>
  import { createEventDispatcher } from 'svelte';
  import { reportOffer } from '$lib/api/offers';

  export let offerId;

  const dispatch = createEventDispatcher();

  let reason = '';
  let description = '';
  let submitStatus = '';

  async function handleSubmit() {
    if (!reason) {
      submitStatus = 'Please select a reason for reporting.';
      return;
    }

    try {
      await reportOffer(offerId, { reason, description });
      submitStatus = 'Report submitted successfully.';
      setTimeout(() => {
        dispatch('close');
      }, 2000);
    } catch (error) {
      submitStatus = 'Failed to submit report. Please try again.';
    }
  }
</script>

<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" on:click={() => dispatch('close')}>
  <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" on:click|stopPropagation>
    <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">Report Offer</h3>
    <form on:submit|preventDefault={handleSubmit}>
      <div class="mb-4">
        <label for="reason" class="block text-sm font-medium text-gray-700">Reason</label>
        <select
          id="reason"
          bind:value={reason}
          class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select a reason</option>
          <option value="inappropriate">Inappropriate content</option>
          <option value="spam">Spam</option>
          <option value="fake">Fake offer</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div class="mb-4">
        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          bind:value={description}
          rows="3"
          class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Please provide more details about your report"
        ></textarea>
      </div>
      <div class="flex justify-end">
        <button
          type="button"
          class="mr-2 bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded"
          on:click={() => dispatch('close')}
        >
          Cancel
        </button>
        <button
          type="submit"
          class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Submit Report
        </button>
      </div>
    </form>
    {#if submitStatus}
      <p class="mt-4 text-sm text-center" class:text-green-600={submitStatus.includes('successfully')} class:text-red-600={!submitStatus.includes('successfully')}>
        {submitStatus}
      </p>
    {/if}
  </div>
</div>
