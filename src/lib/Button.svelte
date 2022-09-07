<script>
  export let color = undefined;
  export let size = undefined;
</script>

<button class="btn btn-{color} btn-{size}" on:click>
  <slot/>
</button>
