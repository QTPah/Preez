<script>
  import { onMount } from 'svelte';
  import { getAboutPageContent } from '$lib/api/settings';
  import { marked } from 'marked';

  let aboutContent = '';

  marked.setOptions({
    breaks: true,
    gfm: true
  });

  onMount(async () => {
    try {
      aboutContent = await getAboutPageContent();
      // Replace \n with actual line breaks
      aboutContent = aboutContent.replace(/\\n/g, '\n');
    } catch (error) {
      console.error('Error fetching About page content:', error);
      aboutContent = 'Error loading content. Please try again later.';
    }
  });
</script>

<main class="container mx-auto px-4 py-8 prose dark:prose-invert max-w-none">
  {@html marked(aboutContent)}
</main>
