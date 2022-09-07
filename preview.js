import { parse, walk } from 'svelte/compiler'
import fs from 'fs'
import path from 'path'

import magicString from 'magic-string'

const styleRegex = /<!--[^]*?-->|<style(\s[^]*?)?>([^]*?)<\/style>/gi
const scriptRegex = /<!--[^]*?-->|<script(\s[^]*?)?>([^]*?)<\/script>/gi

/** @return {import('svelte-preprocess/dist/types').PreprocessorGroup} */
export default function ifProcessor() {
	return {
		markup({ content, filename }) {
			// split markup, scripts and styles
			const script = content.match(scriptRegex)?.join('')
			const style = content.match(styleRegex)?.join('')
			const markup = content.replace(styleRegex, '').replace(scriptRegex, '')

            // TODO: check if there is <Preview in content
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
                        const sourceCode = fs.readFileSync(src, 'utf-8')
                        
                        const index = node.start + node.name.length + 1
                        s.appendRight(index, ' code={`' + sourceCode + '`}')

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
