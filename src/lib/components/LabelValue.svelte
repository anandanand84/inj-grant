<style>
    .header-label {
      color: #aeaeb2;
    }
  </style>
  <script>
    export let label;
    export let value;
    export let title;
  </script>
  <div class="flex flex-row justify-between items-center" style="width:285px;">
    <div class="w-full">
      <span class="text-sm mb-1 header-label">{label}</span>
      <div class="text-sm mb-5 overflow-hidden" style="text-overflow: ellipsis;">
        <span title="{title}">{value}</span>
      </div>
    </div>
  </div>
  