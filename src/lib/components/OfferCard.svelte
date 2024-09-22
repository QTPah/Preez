<script>
  export let type;
  export let title;
  export let description;
  export let price;

  const typeColors = {
    service: 'bg-purple-500',
    test: 'bg-blue-500',
    summary: 'bg-green-500',
    default: 'bg-gray-500'
  };

  $: tagColor = typeColors[type] || typeColors.default;
</script>

<div class="border rounded-lg p-4 shadow-md">
  <div class="flex justify-between items-center mb-2">
    <span class="{tagColor} text-white text-sm font-semibold px-2 py-1 rounded">
      {type}
    </span>
    <span class="text-lg font-bold">${price}</span>
  </div>
  <h2 class="text-xl font-semibold mb-2">{title}</h2>
  <p class="text-gray-600 mb-4">{description}</p>
  <button class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded w-full">
    View Details
  </button>
</div>
