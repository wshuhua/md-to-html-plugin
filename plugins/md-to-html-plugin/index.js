const { readFileSync } = require("fs");
const { compileHTML } = require("./compiler");
const path = require("path");

const INNER_MARK = "<!-- inner -->";

class MdToHtmlPlugin {
  constructor(props) {
    const { template, filename } = props;
    if (!template) {
      throw Error('The Config for "template" must be configured');
    }

    this.template = template;
    this.filename = filename || "md.html";
  }
  apply(compiler) {
    compiler.hooks.emit.tap("md-tohtml-plugin", (complation) => {
      const _assets = complation.assets;
      const _mdContent = readFileSync(this.template, "utf8");
      const _templateHTML = readFileSync(
        path.resolve(__dirname, "template.html"),
        "utf8"
      );
      const _mdContentArr = _mdContent.split("\n");
      const _htmlStr = compileHTML(_mdContentArr);
      const _finalHTML = _templateHTML.replace(INNER_MARK, _htmlStr);
      _assets[this.filename] = {
        source() {
          return _finalHTML;
        },
        size() {
          return _finalHTML.length;
        },
      };
    });
  }
}

module.exports = MdToHtmlPlugin;
