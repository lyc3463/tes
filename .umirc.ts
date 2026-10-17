import { defineConfig } from "umi";

const CompressionPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;

export default defineConfig({
  favicons: ['/staticfiles/logo.png'],
  exportStatic: {},
  codeSplitting: {
    jsStrategy: 'granularChunks',
    jsStrategyOptions: {}
  },
  headScripts: ['/server_config.js'],
  jsMinifierOptions: { charset: 'utf8',drop: ['console']},
  cssMinifierOptions: { charset: 'utf8' },
  chainWebpack(memo, { env, webpack }) {
    if (env === 'production') {
      //gzip压缩
      memo.plugin('compression-webpack-plugin').use(CompressionPlugin, [
        {
          test: productionGzipExtensions, //匹配文件名
          threshold: 10240, //对超过10k的数据压缩
          deleteOriginalAssets: false, //不删除源文件
        },
      ]);
    }
  },
  npmClient: 'pnpm',
  plugins:['@umijs/plugins/dist/dva'],
  dva:{},
  mako: {},
  title: '茶馆管理系统',
});
