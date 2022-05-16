const path = require("path");
const MdToHtmlPlugin = require("./plugins/md-to-html-plugin/index.js");

const mode = process.env.NODE_ENV;
console.log("process.env.NODE_ENV=", mode); // 打印环境变量
module.exports = {
  entry: './src/app.js',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, "dist"),
  filename: '[name].js',
  },
  plugins: [
    // 配置插件
    new MdToHtmlPlugin({
      template: path.resolve(__dirname, './example/test.md'),
      filename: 'test.html'
    })
  ]
};