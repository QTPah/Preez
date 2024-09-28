<script>
  let name = '';
  let email = '';
  let message = '';
  let submitStatus = '';

  async function handleSubmit() {
    // In a real application, you'd want to send this data to your backend
    // For now, we'll just simulate a successful submission
    submitStatus = 'Sending...';
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    submitStatus = 'Message sent successfully!';
    name = '';
    email = '';
    message = '';
  }
</script>

<main class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">Contact Us</h1>
  
  <form on:submit|preventDefault={handleSubmit} class="max-w-lg">
    <div class="mb-4">
      <label for="name" class="block text-gray-700 font-bold mb-2">Name</label>
      <input
        type="text"
        id="name"
        bind:value={name}
        required
        class="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
        placeholder="Your name"
      />
    </div>
    
    <div class="mb-4">
      <label for="email" class="block text-gray-700 font-bold mb-2">Email</label>
      <input
        type="email"
        id="email"
        bind:value={email}
        required
        class="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
        placeholder="Your email"
      />
    </div>
    
    <div class="mb-4">
      <label for="message" class="block text-gray-700 font-bold mb-2">Message</label>
      <textarea
        id="message"
        bind:value={message}
        required
        class="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
        rows="5"
        placeholder="Your message"
      ></textarea>
    </div>
    
    <button
      type="submit"
      class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Send Message
    </button>
  </form>
  
  {#if submitStatus}
    <p class="mt-4 text-green-600 font-semibold">{submitStatus}</p>
  {/if}
</main>
