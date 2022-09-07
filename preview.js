import { parse, walk } from 'svelte/compiler'
import fs from 'fs'
import path from 'path'

import magicString from 'magic-string'

const styleRegex = /<!--[^]*?-->|<style(\s[^]*?)?>([^]*?)<\/style>/gi
const scriptRegex = /<!--[^]*?-->|<script(\s[^]*?)?>([^]*?)<\/script>/gi

function findUrl(src) {
    // relative to component
}

/** @return {import('svelte-preprocess/dist/types').PreprocessorGroup} */
export default function ifProcessor() {
	return {
		markup({ content, filename }) {
			// split markup, scripts and styles
			const script = content.match(scriptRegex)?.join('')
			const style = content.match(styleRegex)?.join('')
			const markup = content.replace(styleRegex, '').replace(scriptRegex, '')

			// const hasIfAttributeRegex = /<[^>]+\sif={[^>]*>/g
			// const hasIfAttribute = markup.match(hasIfAttributeRegex)
			// if (!hasIfAttribute) return

			const s = new magicString(markup)
			const ast = parse(markup)

            console.log(markup)
			walk(ast.html, {
				enter(node, parent) {
					if (node.type === 'InlineComponent' && node.name === 'Preview') {

                        console.log(node)

                        const srcAttribute = node.attributes.find(node => node.name === 'src')
                        const relativeSrc = srcAttribute.value?.[0].data
                        const src = path.resolve(path.dirname(filename), relativeSrc)


                        const componentName = node.children.find(child => {
                            if(child.type === 'InlineComponent') return true
                        }).name

                        const src2 = script.match(new RegExp(`/^import ${componentName} from /g`))?.[0]

                        console.log({src2})


                        console.log({componentName})

                        const sourceCode = fs.readFileSync(src, 'utf-8')
                        
                        const index = node.start + node.name.length + 1
                        s.appendRight(index, ' code={`' + sourceCode + '`}')

						// const openTag = `{#if ${markup.substring(node.start + 4, node.end - 1)}}`
						// const closeTag = `{/if}`

						// s.prependLeft(parent.start, openTag)

						// s.remove(node.start - 1, node.end)

						// s.appendRight(parent.end, closeTag)
					}
				},
			})

			// attach script and style tags
			if (script) s.prependLeft(0, script)
			if (style) s.appendRight(s.length(), style)

			return {
				code: s.toString(),
				map: s.generateMap({ hires: true, file: filename }),
			}
		},
	}
}
