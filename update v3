const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const BuildPaths = require('./lib/build-paths');
const BuildExtension = require('./lib/build-extension-webpack-plugin');

const manifest = fs.readJSONSync(path.join(BuildPaths.SRC_ROOT, 'manifest.json'));
const version = manifest.version;

const entries = {
  viewer: ['./extension/src/viewer.js'],
  'viewer-alert': ['./extension/styles/viewer-alert.scss'],
  options: ['./extension/src/options.js'],
  background: ['./extension/src/background.js'],
  'omnibox-page': ['./extension/src/omnibox-page.js']
};

function findThemes(darkness) {
  return fs.readdirSync(path.join('extension', 'themes', darkness))
    .filter(filename => /\.js$/.test(filename))
    .map(theme => theme.replace(/\.js$/, ''));
}

function includeThemes(darkness, list) {
  list.forEach(filename => {
    entries[filename] = [`./extension/themes/${darkness}/${filename}.js`];
  });
}

const lightThemes = findThemes('light');
const darkThemes = findThemes('dark');
const themes = {light: lightThemes, dark: darkThemes};

includeThemes('light', lightThemes);
includeThemes('dark', darkThemes);

console.log('Entries list:');
console.log(entries);
console.log('\n');

module.exports = {
  context: __dirname,
  entry: entries,
  output: {
    path: path.join(__dirname, 'build/json_viewer/assets'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.css', '.scss'],
    alias: {
      '@': path.resolve(__dirname, 'extension')
    }
  },
  externals: {
    'chrome-framework': 'chrome'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        VERSION: JSON.stringify(version),
        THEMES: JSON.stringify(themes)
      }
    }),
    new BuildExtension({themes})
  ],
  optimization: {
    minimize: process.env.NODE_ENV === 'production',
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true
          }
        },
        extractComments: false
      })
    ]
  }
};

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins.push(new webpack.NoEmitOnErrorsPlugin());
}
