const path = require('path');

module.exports = (_env, argv) => {
  const mode = argv.mode;

  return {
    entry: './client/src/index.js',
    mode,
    module: {
      rules: [
        {
          test: /\.js|jsx$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
              'postcss-loader'
          ]
        },
      ]
    },
    // devtool: 'inline-source-map',
    devtool: mode === 'production' ? false : 'inline-source-map',
    devServer: {
      historyApiFallback: true,
    },
    output: {
      path: path.join(__dirname, 'client/dist'),
      filename: 'bundle.js'
    },
  }
}