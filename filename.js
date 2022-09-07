import path from "path"

    const filename = '/home/a/github/svelte-if-prop/preview-component/src/App.svelte'
    const src = './src/lib/Counter.svelte'

    const newFile = path.resolve(filename, src)

    console.log(newFile)
