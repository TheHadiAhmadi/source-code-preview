import { parse, walk } from "svelte/compiler";
import fs from "fs";
import path from "path";

import magicString from "magic-string";

const styleRegex = /(<style(\s[^]*?)?>([^]*?)<\/style>)/gi;
const scriptRegex = /(<script(\s[^]*?)?>([^]*?)<\/script>)/gi;

function spliteSections(content) {
  const script = content.match(scriptRegex)?.join("").trim() ?? "";
  const style = content.match(styleRegex)?.join("").trim() ?? "";
  const markup = content
    .replace(styleRegex, "")
    .replace(scriptRegex, "")
    .trim();

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

      const hasPreviewRegex = /<Preview[^>]+({src}|src=[{"'`])[^>]*>/g;
      const hasPreview = markup.match(hasPreviewRegex);
      if (!hasPreview) return;

      const result = new magicString(markup);
      const ast = parse(markup);

      walk(ast.html, {
        enter(node) {
          if (node.type !== "InlineComponent" || node.name !== "Preview")
            return;

          const srcAttribute = node.attributes.find(
            (node) => node.name === "src"
          );
          if(!srcAttribute) throw Error('Preview doesn\'t have src prop')

          const relativeSrc = srcAttribute.value?.[0]?.data;
          if(!relativeSrc) throw Error('Preview\'s src should be path to example source code')
          
          const absoluteSrc = path.resolve(path.dirname(filename), relativeSrc);
          if(!absoluteSrc) throw Error('Cannot locate file: ', relativeSrc)

          const sourceCode = fs.readFileSync(absoluteSrc, "utf-8");
          if(!sourceCode) throw Error('Cannot load ' + relativeSrc)

          const {
            markup: previewMarkup,
            script: previewScript,
            style: previewStyle,
          } = spliteSections(sourceCode);

          result.remove(srcAttribute.start - 1, srcAttribute.end);

          const index = node.start + node.name.length + 1;
          result.appendRight(index, " markup={`" + previewMarkup + "`}");

          if (previewScript) {
            const escaped = previewScript
              .replace(/\$/g, "\\$")
              .replace(/\`/g, "\\`");

            result.appendRight(index, " script={`" + escaped + "`}");
          }

          if (previewStyle)
            result.appendRight(index, " style={`" + previewStyle + "`}");
        },
      });

      // attach script and style tags
      if (script) result.prependLeft(0, script);
      if (style) result.appendRight(result.length(), style);

      return {
        code: result.toString(),
        map: result.generateMap({ hires: true, file: filename }),
      };
    },
  };
}
