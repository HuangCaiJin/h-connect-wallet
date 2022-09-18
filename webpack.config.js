// webpack.config.js
const path = require('path')
module.exports = {
  mode:"development",
  entry: path.join(__dirname, '/src/index.js'), // 入口文件
  output: {
    path: path.join(__dirname, '/dist'), //打包后的文件存放的地方
    filename: 'bundle.js' //打包后输出文件的文件名
  },
  devServer: {
    // host:"0.0.0.0",
    contentBase: './dist', // 本地服务器所加载文件的目录
    port: '8088', // 设置端口号为8088
    inline: true, // 文件修改后实时刷新
    historyApiFallback: true, //不跳转
    proxy: { // 配置代理（只在本地开发有效，上线无效）
      '/api': {
        target: 'https://nftup.vip', // 这是本地用node写的一个服务，用webpack-dev-server起的服务默认端口是8080
        pathRewrite: {"/api" : "/api"}, // 后台在转接的时候url中是没有 /api 的
        changeOrigin: true, // 加了这个属性，那后端收到的请求头中的host是目标地址 target
      },
      '/_next': {
        target: 'https://chainlist.org', // 这是本地用node写的一个服务，用webpack-dev-server起的服务默认端口是8080
        pathRewrite: {"/_next" : "/_next"}, // 后台在转接的时候url中是没有 /api 的
        changeOrigin: true, // 加了这个属性，那后端收到的请求头中的host是目标地址 target
      }
    }
  }
}