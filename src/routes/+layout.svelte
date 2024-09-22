<script>
  import "../app.css";
  import { page } from '$app/stores';
</script>

<div class="flex flex-col min-h-screen">
  <nav class="bg-gray-800 text-white p-4">
    <div class="container mx-auto flex justify-between items-center">
      <a href="/" class="text-2xl font-bold">Preez</a>
      <ul class="flex space-x-4">
        <li><a href="/" class="hover:text-gray-300" class:font-bold={$page.url.pathname === '/'}>Home</a></li>
        <li><a href="/about" class="hover:text-gray-300" class:font-bold={$page.url.pathname === '/about'}>About</a></li>
        <li><a href="/contact" class="hover:text-gray-300" class:font-bold={$page.url.pathname === '/contact'}>Contact</a></li>
      </ul>
    </div>
  </nav>

  <main class="flex-grow">
    <slot />
  </main>

  <footer class="bg-gray-800 text-white p-4">
    <div class="container mx-auto text-center">
      <p>&copy; 2023 Preez. All rights reserved.</p>
    </div>
  </footer>
</div>
