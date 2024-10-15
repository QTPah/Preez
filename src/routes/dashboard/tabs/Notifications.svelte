<script>
  import { onMount } from 'svelte';
  import { getNotificationPresets, createNotificationPreset, updateNotificationPreset, deleteNotificationPreset, sendManualNotification } from '$lib/api/notifications';

  let activeSubTab = 'presets';
  let presets = [];
  let newPreset = { type: '', title: '', message: '', defaultEnabled: true };
  let editingPreset = null;
  let manualNotification = { type: '', title: '', message: '', recipients: [] };

  onMount(loadPresets);

  async function loadPresets() {
    try {
      const response = await getNotificationPresets();
      presets = response.presets;
    } catch (error) {
      console.error('Error loading notification presets:', error);
    }
  }

  async function handlePresetSubmit() {
    try {
      if (editingPreset) {
        await updateNotificationPreset(editingPreset._id, editingPreset);
      } else {
        await createNotificationPreset(newPreset);
      }
      await loadPresets();
      resetForm();
    } catch (error) {
      console.error('Error saving notification preset:', error);
    }
  }

  async function handlePresetDelete(presetId) {
    if (confirm('Are you sure you want to delete this preset?')) {
      try {
        await deleteNotificationPreset(presetId);
        await loadPresets();
      } catch (error) {
        console.error('Error deleting notification preset:', error);
      }
    }
  }

  function editPreset(preset) {
    editingPreset = { ...preset };
  }

  function resetForm() {
    newPreset = { type: '', title: '', message: '', defaultEnabled: true };
    editingPreset = null;
  }

  async function handleManualNotificationSend() {
    try {
      await sendManualNotification(manualNotification);
      alert('Notification sent successfully!');
      manualNotification = { type: '', title: '', message: '', recipients: [] };
    } catch (error) {
      console.error('Error sending manual notification:', error);
      alert('Failed to send notification. Please try again.');
    }
  }
</script>

<div>
  <div class="mb-4">
    <button
      class="mr-2 px-4 py-2 {activeSubTab === 'presets' ? 'bg-blue-500 text-white' : 'bg-gray-200'}"
      on:click={() => activeSubTab = 'presets'}
    >
      Notification Presets
    </button>
    <button
      class="px-4 py-2 {activeSubTab === 'manual' ? 'bg-blue-500 text-white' : 'bg-gray-200'}"
      on:click={() => activeSubTab = 'manual'}
    >
      Send Manual Notification
    </button>
  </div>

  {#if activeSubTab === 'presets'}
    <h3 class="text-xl font-bold mb-4">Notification Presets</h3>
    <form on:submit|preventDefault={handlePresetSubmit} class="mb-6">
      <input
        type="text"
        placeholder="Type"
        bind:value={editingPreset ? editingPreset.type : newPreset.type}
        class="mb-2 p-2 border rounded w-full"
      />
      <input
        type="text"
        placeholder="Title"
        bind:value={editingPreset ? editingPreset.title : newPreset.title}
        class="mb-2 p-2 border rounded w-full"
      />
      <textarea
        placeholder="Message"
        bind:value={editingPreset ? editingPreset.message : newPreset.message}
        class="mb-2 p-2 border rounded w-full"
      ></textarea>
      <label class="flex items-center mb-2">
        <input
          type="checkbox"
          bind:checked={editingPreset ? editingPreset.defaultEnabled : newPreset.defaultEnabled}
          class="mr-2"
        />
        Default Enabled
      </label>
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
        {editingPreset ? 'Update Preset' : 'Create Preset'}
      </button>
      {#if editingPreset}
        <button type="button" on:click={resetForm} class="ml-2 bg-gray-300 px-4 py-2 rounded">
          Cancel
        </button>
      {/if}
    </form>

    <table class="w-full">
      <thead>
        <tr>
          <th class="text-left">Type</th>
          <th class="text-left">Title</th>
          <th class="text-left">Message</th>
          <th class="text-left">Default Enabled</th>
          <th class="text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each presets as preset}
          <tr>
            <td>{preset.type}</td>
            <td>{preset.title}</td>
            <td>{preset.message}</td>
            <td>{preset.defaultEnabled ? 'Yes' : 'No'}</td>
            <td>
              <button on:click={() => editPreset(preset)} class="text-blue-500 mr-2">Edit</button>
              <button on:click={() => handlePresetDelete(preset._id)} class="text-red-500">Delete</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <h3 class="text-xl font-bold mb-4">Send Manual Notification</h3>
    <form on:submit|preventDefault={handleManualNotificationSend} class="mb-6">
      <input
        type="text"
        placeholder="Type"
        bind:value={manualNotification.type}
        class="mb-2 p-2 border rounded w-full"
      />
      <input
        type="text"
        placeholder="Title"
        bind:value={manualNotification.title}
        class="mb-2 p-2 border rounded w-full"
      />
      <textarea
        placeholder="Message"
        bind:value={manualNotification.message}
        class="mb-2 p-2 border rounded w-full"
      ></textarea>
      <input
        type="text"
        placeholder="Recipients (comma-separated user IDs)"
        bind:value={manualNotification.recipients}
        class="mb-2 p-2 border rounded w-full"
      />
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
        Send Notification
      </button>
    </form>
  {/if}
</div>
