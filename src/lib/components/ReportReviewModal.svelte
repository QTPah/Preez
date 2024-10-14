<script>
  import { createEventDispatcher } from 'svelte';
  import { goto } from '$app/navigation';

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

  function redirectToUser(userId) {
    goto(`/dashboard?tab=users&userId=${userId}`);
    close();
  }

  function redirectToOffer(offerId) {
    goto(`/offer/${offerId}`);
    close();
  }
</script>

<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" on:click={close}>
  <div class="relative top-20 mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white" on:click|stopPropagation>
    <h2 class="text-2xl font-bold mb-6 text-center">Review {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</h2>
    
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <strong class="text-gray-700">ID:</strong> 
        <div class="flex items-center">
          <span class="mr-2">{report._id}</span>
          <button 
            on:click={() => copyToClipboard(report._id)}
            class="text-blue-500 hover:text-blue-700"
          >
            Copy
          </button>
        </div>
      </div>

      <div class="flex justify-between items-center">
        <strong class="text-gray-700">Reported {reportType === 'user' ? 'User' : 'Offer'}:</strong> 
        <button 
          class="text-blue-600 hover:text-blue-800"
          on:click={() => reportType === 'user' ? redirectToUser(report.reportedUser._id) : redirectToOffer(report.reportedOffer._id)}
        >
          {reportType === 'user' ? report.reportedUser.username : report.reportedOffer.title}
        </button>
      </div>

      <div class="flex justify-between items-center">
        <strong class="text-gray-700">Reporter:</strong> 
        <button 
          class="text-blue-600 hover:text-blue-800"
          on:click={() => redirectToUser(report.reportedBy._id)}
        >
          {report.reportedBy.username}
        </button>
      </div>

      <div>
        <strong class="text-gray-700">Reason:</strong> 
        <p class="mt-1">{report.reason}</p>
      </div>

      <div>
        <strong class="text-gray-700">Description:</strong> 
        <p class="mt-1">{report.description}</p>
      </div>

      <div class="flex justify-between items-center">
        <strong class="text-gray-700">Date:</strong> 
        <span>{new Date(report.createdAt).toLocaleString()}</span>
      </div>

      <div class="flex justify-between items-center">
        <strong class="text-gray-700">Status:</strong> 
        <span class={`px-2 py-1 text-xs font-semibold rounded-full 
          ${report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
            report.status === 'resolved' ? 'bg-green-100 text-green-800' : 
            'bg-red-100 text-red-800'}`}>
          {report.status}
        </span>
      </div>
    </div>

    <div class="flex justify-end mt-6">
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
