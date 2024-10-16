<script>
  import { onMount } from 'svelte';
  import { clickOutside } from '$lib/actions/clickOutside';
  import { fade, fly } from 'svelte/transition';

  export let isOpen = false;

  let messages = [];
  let newMessage = '';

  function sendMessage() {
    if (newMessage.trim()) {
      messages = [...messages, { text: newMessage, sender: 'user' }];
      newMessage = '';
      // Here you would typically send the message to a backend
      // and then receive a response. For now, we'll simulate a response.
      setTimeout(() => {
        messages = [...messages, { text: "Thanks for your message! This is a placeholder response.", sender: 'bot' }];
      }, 1000);
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  onMount(() => {
    if (isOpen) {
      document.getElementById('chat-input').focus();
    }
  });
</script>

<div class="absolute top-full right-0 mt-2 z-50" use:clickOutside on:click_outside={() => isOpen = false}>
  {#if isOpen}
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-80 h-96 flex flex-col dark:border dark:border-white"
         in:fly="{{ y: -20, duration: 300 }}"
         out:fade="{{ duration: 200 }}">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 class="text-lg font-semibold">Chat</h3>
        <button on:click={() => isOpen = false} class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <div class="flex-grow overflow-y-auto p-4">
        {#each messages as message}
          <div class="mb-2 {message.sender === 'user' ? 'text-right' : 'text-left'}">
            <span class="inline-block p-2 rounded-lg {message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}">
              {message.text}
            </span>
          </div>
        {/each}
      </div>
      <div class="p-4 border-t border-gray-200 dark:border-gray-700">
        <form on:submit|preventDefault={sendMessage} class="flex">
          <input
            type="text"
            id="chat-input"
            bind:value={newMessage}
            on:keydown={handleKeydown}
            placeholder="Type a message..."
            class="flex-grow mr-2 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Send</button>
        </form>
      </div>
    </div>
  {/if}
</div>
