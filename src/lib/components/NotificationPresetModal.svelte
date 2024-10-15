<script>
  import { createEventDispatcher } from 'svelte';

  export let preset = null;

  const dispatch = createEventDispatcher();

  let type = preset?.type || '';
  let title = preset?.title || '';
  let message = preset?.message || '';
  let defaultEnabled = preset?.defaultEnabled || true;
  let redirectLink = preset?.redirectLink || '';

  function handleSubmit() {
    dispatch('submit', {
      _id: preset?._id,
      type,
      title,
      message,
      defaultEnabled,
      redirectLink
    });
  }

  function handleClose() {
    dispatch('close');
  }
</script>

<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" on:click={handleClose}>
  <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800" on:click|stopPropagation>
    <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
      {preset ? 'Edit Notification Preset' : 'Create Notification Preset'}
    </h3>
    <form on:submit|preventDefault={handleSubmit}>
      <input
        type="text"
        placeholder="Type"
        bind:value={type}
        class="mb-2 p-2 border rounded w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
      />
      <input
        type="text"
        placeholder="Title"
        bind:value={title}
        class="mb-2 p-2 border rounded w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
      />
      <textarea
        placeholder="Message"
        bind:value={message}
        class="mb-2 p-2 border rounded w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
      ></textarea>
      <input
        type="text"
        placeholder="Redirect Link (optional)"
        bind:value={redirectLink}
        class="mb-2 p-2 border rounded w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
      />
      <label class="flex items-center mb-2 dark:text-white">
        <input
          type="checkbox"
          bind:checked={defaultEnabled}
          class="mr-2"
        />
        Default Enabled
      </label>
      <div class="flex justify-end mt-4">
        <button type="button" on:click={handleClose} class="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
          Cancel
        </button>
        <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          {preset ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  </div>
</div>
