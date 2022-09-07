<script>
    export let code = ''
    export let markup = ''
    export let script = ''
    export let style = ''

    export let src = ''
</script>
{src}
<div>
    <slot/>
    <hr>
    <pre><code>{script}</code></pre>
    <hr>
    <pre><code>{markup}</code></pre>
    <hr>
    <pre><code>{style}</code></pre>
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
