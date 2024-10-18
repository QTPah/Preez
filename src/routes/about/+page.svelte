<script>
  import { onMount } from 'svelte';
  import { getAboutPageContent } from '$lib/api/settings';
  import { marked } from 'marked';
  import { language } from '../../stores/language';
  import { translations } from '$lib/translations';

  let aboutContent = '';

  $: t = translations[$language];

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
      aboutContent = t.errorLoadingContent;
    }
  });
</script>

<main class="container mx-auto px-4 py-8 prose dark:prose-invert max-w-none">
  <h1>{t.aboutTitle}</h1>
  {@html marked(aboutContent)}
</main>
