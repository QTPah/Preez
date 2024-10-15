<script>
  import { onMount } from 'svelte';
  import { getNotificationPresets, createNotificationPreset, updateNotificationPreset, deleteNotificationPreset, sendManualNotification } from '$lib/api/notifications';
  import NotificationPresetModal from '$lib/components/NotificationPresetModal.svelte';

  let activeSubTab = 'presets';
  let presets = [];
  let showPresetModal = false;
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

  function openPresetModal(preset = null) {
    editingPreset = preset ? { ...preset } : null;
    showPresetModal = true;
  }

  async function handlePresetSubmit(event) {
    const preset = event.detail;
    try {
      if (preset._id) {
        await updateNotificationPreset(preset._id, preset);
      } else {
        await createNotificationPreset(preset);
      }
      await loadPresets();
      showPresetModal = false;
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
  <div class="mb-4 flex w-full border-b dark:border-gray-700">
    <button
      class="flex-1 py-2 {activeSubTab === 'presets' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'} dark:hover:text-white transition-colors duration-200"
      on:click={() => activeSubTab = 'presets'}
    >
      Notification Presets
    </button>
    <button
      class="flex-1 py-2 {activeSubTab === 'manual' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'} dark:hover:text-white transition-colors duration-200"
      on:click={() => activeSubTab = 'manual'}
    >
      Send Manual Notification
    </button>
  </div>

  {#if activeSubTab === 'presets'}
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-xl font-bold dark:text-white">Notification Presets</h3>
      <button
        on:click={() => openPresetModal()}
        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
      >
        New Preset
      </button>
    </div>

    <table class="w-full">
      <thead>
        <tr>
          <th class="text-left dark:text-white">Type</th>
          <th class="text-left dark:text-white">Title</th>
          <th class="text-left dark:text-white">Message</th>
          <th class="text-left dark:text-white">Default Enabled</th>
          <th class="text-left dark:text-white">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each presets as preset}
          <tr class="border-b dark:border-gray-700">
            <td class="py-2 dark:text-white">{preset.type}</td>
            <td class="py-2 dark:text-white">{preset.title}</td>
            <td class="py-2 dark:text-white">{preset.message}</td>
            <td class="py-2 dark:text-white">{preset.defaultEnabled ? 'Yes' : 'No'}</td>
            <td class="py-2">
              <button on:click={() => openPresetModal(preset)} class="text-blue-500 hover:text-blue-600 mr-2 dark:text-blue-400 dark:hover:text-blue-300">Edit</button>
              <button on:click={() => handlePresetDelete(preset._id)} class="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300">Delete</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <h3 class="text-xl font-bold mb-4 dark:text-white">Send Manual Notification</h3>
    <form on:submit|preventDefault={handleManualNotificationSend} class="mb-6">
      <select
        bind:value={manualNotification.type}
        class="mb-2 p-2 border rounded w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
      >
        <option value="">Select a type</option>
        {#each presets as preset}
          <option value={preset.type}>{preset.type}</option>
        {/each}
      </select>
      <input
        type="text"
        placeholder="Title"
        bind:value={manualNotification.title}
        class="mb-2 p-2 border rounded w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
      />
      <textarea
        placeholder="Message"
        bind:value={manualNotification.message}
        class="mb-2 p-2 border rounded w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
      ></textarea>
      <input
        type="text"
        placeholder="Recipients (comma-separated user IDs)"
        bind:value={manualNotification.recipients}
        class="mb-2 p-2 border rounded w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
      />
      <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
        Send Notification
      </button>
    </form>
  {/if}
</div>

{#if showPresetModal}
  <NotificationPresetModal
    preset={editingPreset}
    on:close={() => showPresetModal = false}
    on:submit={handlePresetSubmit}
  />
{/if}
