// webpack.config.js
const path = require('path');

module.exports = {
  entry: './js/git_ops.js',
  mode: 'development',
  externals: {
    'isomorphic-git': 'https://unpkg.com/isomorphic-git@beta/http/web/index.js'
  },
  target: 'web',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
