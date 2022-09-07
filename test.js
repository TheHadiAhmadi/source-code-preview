import {preprocess} from 'svelte/compiler'
import preview from './preview.js'
import fs from 'fs'

const file = fs.readFileSync('./src/App.svelte', 'utf-8')
const result = await preprocess(file, preview(), {filename: './src/App.svelte'})

console.log(result.code)