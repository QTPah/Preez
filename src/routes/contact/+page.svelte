<script>
  let name = '';
  let email = '';
  let message = '';
  let submitStatus = '';

  async function handleSubmit() {
    // Here you would typically send this data to your backend
    // For now, we'll just simulate a successful submission
    submitStatus = 'Message sent successfully!';
    
    // Reset form fields
    name = '';
    email = '';
    message = '';

    // Clear status message after 3 seconds
    setTimeout(() => {
      submitStatus = '';
    }, 3000);
  }
</script>

<main class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">Contact Us</h1>
  
  <form on:submit|preventDefault={handleSubmit} class="max-w-lg">
    <div class="mb-4">
      <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Name</label>
      <input type="text" id="name" bind:value={name} required
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
    </div>
    
    <div class="mb-4">
      <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
      <input type="email" id="email" bind:value={email} required
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
    </div>
    
    <div class="mb-6">
      <label for="message" class="block text-gray-700 text-sm font-bold mb-2">Message</label>
      <textarea id="message" bind:value={message} required rows="5"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
    </div>
    
    <div class="flex items-center justify-between">
      <button type="submit" 
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Send Message
      </button>
    </div>
  </form>

  {#if submitStatus}
    <p class="mt-4 text-green-600 font-semibold">{submitStatus}</p>
  {/if}
</main>
