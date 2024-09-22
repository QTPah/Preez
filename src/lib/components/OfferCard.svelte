<script>
  export let tags;
  export let title;
  export let description;
  export let price;

  const tagColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-indigo-500',
    'bg-pink-500',
  ];

  function getTagColor(index) {
    return tagColors[index % tagColors.length];
  }
</script>

<div class="border rounded-lg p-4 shadow-md">
  <div class="flex flex-wrap gap-2 mb-2">
    {#each tags as tag, index}
      <span class="{getTagColor(index)} text-white text-xs font-semibold px-2 py-1 rounded">
        {tag}
      </span>
    {/each}
  </div>
  <div class="flex justify-between items-center mb-2">
    <h2 class="text-xl font-semibold">{title}</h2>
    <span class="text-lg font-bold">${price}</span>
  </div>
  <p class="text-gray-600 mb-4">{description}</p>
  <button class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded w-full">
    View Details
  </button>
</div>
