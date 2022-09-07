<script>
    export let code = ''
    export let src = ''
</script>
{src}
<div>
    <slot/>
    <hr>
    <pre><code>{code}</code></pre>
</div>
<style>
    div {
        border: 1px solid black;
        background: wheat;
        padding: 1rem
    }

    pre {
        align-items: left;
    }
</style>
