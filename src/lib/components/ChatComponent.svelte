<script>
  import { onMount, afterUpdate } from 'svelte';
  import { clickOutside } from '$lib/actions/clickOutside';
  import { fade, fly } from 'svelte/transition';
  import defaultProfile from '$lib/assets/default-picture.jpeg';
  import { getUsers, sendMessage, getMessages } from '$lib/api/chat';

  export let isOpen = false;
  export let userProfilePicture = defaultProfile;

  let messages = [];
  let newMessage = '';
  let searchTerm = '';
  let selectedUser = null;
  let showUserDropdown = false;
  let users = [];
  let messagesContainer;

  $: filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function fetchUsers() {
    users = await getUsers();
  }

  async function fetchMessages() {
    if (selectedUser) {
      messages = await getMessages(selectedUser._id);
      scrollToBottom();
    }
  }

  async function handleSendMessage() {
    if (newMessage.trim() && selectedUser) {
      const sentMessage = await sendMessage(selectedUser._id, newMessage);
      messages = [...messages, sentMessage];
      newMessage = '';
      scrollToBottom();
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  }

  async function selectUser(user) {
    selectedUser = user;
    showUserDropdown = false;
    searchTerm = '';
    await fetchMessages();
  }

  function handleClickOutside() {
    showUserDropdown = false;
  }

  function scrollToBottom() {
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  onMount(async () => {
    await fetchUsers();
    if (isOpen) {
      document.getElementById('user-search').focus();
    }
  });

  afterUpdate(() => {
    if (isOpen) {
      scrollToBottom();
    }
  });

  // ... existing script content ...

  let chatWindowRef;
  let chatIconRef;

  function positionChatWindow() {
    if (chatWindowRef && chatIconRef && isOpen) {
      const iconRect = chatIconRef.getBoundingClientRect();
      chatWindowRef.style.top = `${iconRect.bottom}px`;
      chatWindowRef.style.right = `${window.innerWidth - iconRect.right}px`;
    }
  }

  $: if (isOpen) {
    setTimeout(positionChatWindow, 0);
  }

  onMount(() => {
    window.addEventListener('resize', positionChatWindow);
    return () => {
      window.removeEventListener('resize', positionChatWindow);
    };
  });
</script>

<div class="relative" use:clickOutside on:click_outside={handleClickOutside}>
  <button bind:this={chatIconRef} on:click={() => isOpen = !isOpen} class="text-gray-100 hover:text-white">
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
    </svg>
  </button>
  {#if isOpen}
    <div bind:this={chatWindowRef} 
         class="fixed bg-white dark:bg-gray-800 rounded-lg shadow-lg w-80 h-96 flex flex-col dark:border dark:border-white z-50"
         in:fly="{{ y: 20, duration: 300 }}"
         out:fade="{{ duration: 200 }}">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 class="text-lg font-semibold">Chat</h3>
        <button on:click={() => isOpen = false} class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="relative">
          <input
            type="text"
            id="user-search"
            bind:value={searchTerm}
            on:focus={() => showUserDropdown = true}
            placeholder="Search for a user..."
            class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {#if showUserDropdown}
            <div class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-40 overflow-y-auto">
              {#each filteredUsers as user}
                <button
                  on:click={() => selectUser(user)}
                  class="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white flex items-center"
                >
                  <img src={user.profilePicture || defaultProfile} alt={user.username} class="w-8 h-8 rounded-full mr-2">
                  {user.username}
                </button>
              {/each}
            </div>
          {/if}
        </div>
        {#if selectedUser}
          <div class="mt-2 flex items-center">
            <img src={selectedUser.profilePicture || defaultProfile} alt={selectedUser.username} class="w-8 h-8 rounded-full mr-2">
            <p class="text-sm text-gray-600 dark:text-gray-300">Chatting with: {selectedUser.username}</p>
          </div>
        {/if}
      </div>
      <div bind:this={messagesContainer} class="flex-grow overflow-y-auto p-4">
        {#each messages as message}
          <div class="mb-2 {message.sender === 'user' ? 'text-right' : 'text-left'}">
            <span class="inline-block p-2 rounded-lg {message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}">
              {message.text}
            </span>
          </div>
        {/each}
      </div>
      <div class="p-4 border-t border-gray-200 dark:border-gray-700">
        <form on:submit|preventDefault={handleSendMessage} class="flex">
          <input
            type="text"
            id="chat-input"
            bind:value={newMessage}
            on:keydown={handleKeydown}
            placeholder="Type a message..."
            class="flex-grow mr-2 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            disabled={!selectedUser}
          />
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" disabled={!selectedUser}>Send</button>
        </form>
      </div>
    </div>
  {/if}
</div>
