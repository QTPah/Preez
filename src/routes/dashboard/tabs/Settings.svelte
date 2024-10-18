<script>
  import { onMount } from 'svelte';
  import { getAboutPageContent, updateAboutPageContent } from '$lib/api/settings';
  import { marked } from 'marked';

  let aboutPageContent = '';
  let editedContent = '';
  let isEditing = false;
  let saveStatus = '';

  onMount(async () => {
    const content = await getAboutPageContent();
    aboutPageContent = content;
    editedContent = content;
  });

  function startEditing() {
    isEditing = true;
  }

  async function saveChanges() {
    try {
      await updateAboutPageContent(editedContent);
      aboutPageContent = editedContent;
      isEditing = false;
      saveStatus = 'Changes saved successfully!';
      setTimeout(() => saveStatus = '', 3000);
    } catch (error) {
      console.error('Error saving changes:', error);
      saveStatus = 'Error saving changes. Please try again.';
    }
  }

  function cancelEditing() {
    editedContent = aboutPageContent;
    isEditing = false;
  }
</script>

<h2 class="text-2xl font-bold mb-4">Platform Settings</h2>

<div class="mb-6">
  <h3 class="text-xl font-semibold mb-2">About Page Content</h3>
  {#if isEditing}
    <textarea
      bind:value={editedContent}
      class="w-full h-64 p-2 border rounded dark:bg-gray-700"
    ></textarea>
    <div class="mt-2">
      <button on:click={saveChanges} class="bg-blue-500 text-white px-4 py-2 rounded mr-2">Save</button>
      <button on:click={cancelEditing} class="bg-gray-300 px-4 py-2 rounded dark:text-black">Cancel</button>
    </div>
  {:else}
    <div class="bg-gray-100 p-4 rounded dark:bg-gray-700">
      {@html marked(aboutPageContent)}
    </div>
    <button on:click={startEditing} class="mt-2 bg-green-500 text-white px-4 py-2 rounded">Edit</button>
  {/if}
  {#if saveStatus}
    <p class="mt-2 text-sm {saveStatus.includes('Error') ? 'text-red-500' : 'text-green-500'}">{saveStatus}</p>
  {/if}
</div>
