const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const getFiles = function (dir, files_){
  files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
};

const pathSrc = path.resolve(__dirname, 'src');
const pages = getFiles(pathSrc)
  .filter((item) => path.extname(item) === '.html');


module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    index: './index/index',
    card: './card/card'
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].js',
    library: '[name]'
  },
  devServer: {
    port: 3000,
    open: true
  },
  plugins: [
    ...pages.map(page => {
      console.log(page);
      return new HtmlWebpackPlugin({
        template: page,
        filename: path.basename(page)
      })
    }),
    new CleanWebpackPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
  ]
  }
};
