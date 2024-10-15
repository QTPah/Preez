<script>
  import { createEventDispatcher } from 'svelte';

  export let script = null;

  const dispatch = createEventDispatcher();

  let name = script?.name || '';
  let description = script?.description || '';
  let code = script?.code || '';

  function handleSubmit() {
    dispatch('submit', {
      _id: script?._id,
      name,
      description,
      code
    });
  }

  function handleClose() {
    dispatch('close');
  }
</script>

<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" on:click={handleClose}>
  <div class="relative top-20 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-white dark:bg-gray-800" on:click|stopPropagation>
    <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
      {script ? 'Edit Notification Script' : 'Create Notification Script'}
    </h3>
    <form on:submit|preventDefault={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        bind:value={name}
        class="mb-2 p-2 border rounded w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
      />
      <input
        type="text"
        placeholder="Description"
        bind:value={description}
        class="mb-2 p-2 border rounded w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
      />
      <textarea
        placeholder="Code"
        bind:value={code}
        class="mb-2 p-2 border rounded w-full h-64 font-mono dark:bg-gray-700 dark:text-white dark:border-gray-600"
      ></textarea>
      <div class="flex justify-end mt-4">
        <button type="button" on:click={handleClose} class="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
          Cancel
        </button>
        <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          {script ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  </div>
</div>
