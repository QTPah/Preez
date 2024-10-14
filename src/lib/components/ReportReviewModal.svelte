<script>
  import { createEventDispatcher } from 'svelte';

  export let report;
  export let reportType;

  const dispatch = createEventDispatcher();

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  }

  function close() {
    dispatch('close');
  }

  function resolve() {
    dispatch('resolve', { reportId: report._id });
    close();
  }

  function reject() {
    dispatch('reject', { reportId: report._id });
    close();
  }
</script>

<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" on:click={close}>
  <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" on:click|stopPropagation>
    <h2 class="text-xl font-bold mb-4">Review {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</h2>
    
    <div class="mb-4">
      <strong>ID:</strong> 
      <span>{report._id}</span>
      <button 
        on:click={() => copyToClipboard(report._id)}
        class="ml-2 text-blue-500 hover:text-blue-700"
      >
        Copy
      </button>
    </div>

    <div class="mb-4">
      <strong>Reported {reportType === 'user' ? 'User' : 'Offer'}:</strong> 
      <span>{reportType === 'user' ? report.reportedUser.username : report.reportedOffer.title}</span>
    </div>

    <div class="mb-4">
      <strong>Reporter:</strong> 
      <span>{report.reportedBy.username}</span>
    </div>

    <div class="mb-4">
      <strong>Reason:</strong> 
      <span>{report.reason}</span>
    </div>

    <div class="mb-4">
      <strong>Description:</strong> 
      <p>{report.description}</p>
    </div>

    <div class="mb-4">
      <strong>Date:</strong> 
      <span>{new Date(report.createdAt).toLocaleString()}</span>
    </div>

    <div class="mb-4">
      <strong>Status:</strong> 
      <span>{report.status}</span>
    </div>

    <div class="flex justify-end">
      <button
        on:click={close}
        class="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2"
      >
        Close
      </button>
      {#if report.status === 'pending'}
        <button
          on:click={resolve}
          class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Resolve
        </button>
        <button
          on:click={reject}
          class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Reject
        </button>
      {/if}
    </div>
  </div>
</div>
