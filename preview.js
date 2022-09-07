import { parse, walk } from "svelte/compiler";
import fs from "fs";
import path from "path";

import magicString from "magic-string";

const styleRegex = /(<!--[^]*?-->|<style(\s[^]*?)?>([^]*?)<\/style>)/gi;
const scriptRegex = /(<!--[^]*?-->|<script(\s[^]*?)?>([^]*?)<\/script>)/gi;

function spliteSections(content) {
  const script = content.match(scriptRegex)?.join("");
  const style = content.match(styleRegex)?.join("");
  console.log({style})
  const markup = content.replace(styleRegex, "").replace(scriptRegex, "");

  return {
    script,
    style,
    markup,
  };
}

/** @return {import('svelte-preprocess/dist/types').PreprocessorGroup} */
export default function ifProcessor() {
  return {
    markup({ content, filename }) {
      const { markup, style, script } = spliteSections(content);
      // TODO: check if there is <Preview in content
      // const hasIfAttributeRegex = /<[^>]+\sif={[^>]*>/g
      // const hasIfAttribute = markup.match(hasIfAttributeRegex)
      // if (!hasIfAttribute) return

      const s = new magicString(markup);
      const ast = parse(markup);

      console.log(markup);
      walk(ast.html, {
        enter(node, parent) {
          if (node.type === "InlineComponent" && node.name === "Preview") {
            console.log(node);

            const srcAttribute = node.attributes.find(
              (node) => node.name === "src"
            );
            const relativeSrc = srcAttribute.value?.[0].data;
            const absoluteSrc = path.resolve(
              path.dirname(filename),
              relativeSrc
            );
            const sourceCode = fs.readFileSync(absoluteSrc, "utf-8");

            const {
              markup: previewMarkup,
              script: previewScript,
              style: previewStyle,
            } = spliteSections(sourceCode);

            s.remove(srcAttribute.start - 1, srcAttribute.end);

            const index = node.start + node.name.length + 1;
            s.appendRight(index, " markup={`" + previewMarkup.trim() + "`}");
           
            // TODO: Escape `` ${ } characters
            if (previewScript)
              s.appendRight(index, " script={`" + previewScript.trim() + "`}");

            if (previewStyle)
              s.appendRight(index, " style={`" + previewStyle.trim() + "`}");
          }
        },
      });

      // attach script and style tags
      if (script) s.prependLeft(0, script);
      if (style) s.appendRight(s.length(), style);

      return {
        code: s.toString(),
        map: s.generateMap({ hires: true, file: filename }),
      };
    },
  };
}
