<script>
import Button from "../lib/Button.svelte";

    let colors = ['primary', 'secondary', 'success', 'warning', 'danger', 'info']
</script>

{#each colors as color}
    <Button {color}>
        {color}
        </Button>
{/each}