<script>
import Button from "../lib/Button.svelte";

    let colors = ['primary', `secondary ${5 + 7}`, 'success', 'warning', 'danger', 'info']
</script>

<!-- This is comment -->
{#each colors as color}
    <Button {color}>
        {color}
        </Button>
{/each}