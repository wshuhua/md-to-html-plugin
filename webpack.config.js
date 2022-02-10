const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const mode = process.env.NODE_ENV;
console.log("process.env.NODE_ENV=", mode); // 打印环境变量
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: '[name].js',
  },
  module: {
    rules: [{
        test: /\.css$/,
        //  Loader 的执行顺序是固定从后往前，即按 css-loader --> style-loader 的顺序执行
        // use: ["style-loader", "css-loader", "postcss-loader"],
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      // {
      //   test: /\.(jpe?g|png|gif)$/i,
      //   use:[
      //     {
      //       loader: 'file-loader',
      //       options: {
      //         name: '[name][hash:8].[ext]'
      //       }
      //     }
      //   ]
      // },
      // {
      //   test: /\.(jpe?g|png|gif)$/i,
      //   use:[
      //     {
      //       loader: 'url-loader',
      //       options: {
      //         name: '[name][hash:8].[ext]',
      //         // 文件小于 50k 会转换为 base64，大于则拷贝文件
      //         limit: 50 * 1024
      //       }
      //     }
      //   ]
      // },
      // webpack5 新增资源模块
      {
        test: /\.(jpe?g|png|gif)$/i,
        type: 'asset',
        generator: {
          // 输出文件位置以及文件名
          // [ext] 自带 "." 这个与 url-loader 配置不同
          filename: "[name][hash:8][ext]"
        },
        parser: {
          dataUrlCondition: {
            maxSize: 50 * 1024 //超过50kb不转 base64
          }
        }
      },
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      },
    ],
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "public"), // 静态文件目录
    },
    compress: true, //是否启动压缩 gzip
    port: 8080, // 端口号
    // open:true  // 是否自动打开浏览器
  },
  // devtool: 'source-map',
  optimization: {
    splitChunks: {
      chunks: 'all', // 有效值为 all，async 和 initial
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
          filename: '[name]/bundle.js',
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [
    // 配置插件
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
    new CleanWebpackPlugin(), // 引入插件
    new MiniCssExtractPlugin({ // 添加插件
      filename: '[name].[contenthash:8].css'
    }),
  ],
  resolve: {
    // 导入文件省略后缀名
    extensions: ['.js', '.jsx', '.css']
  }
};