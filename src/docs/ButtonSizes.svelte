<script>
import Button from "../lib/Button.svelte";

    let sizes = ['sm', 'md', 'lg']
</script>

{#each sizes as size}
    <Button color="primary" {size}>
        {size}
        </Button>
{/each}