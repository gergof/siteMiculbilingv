const path = require('path');
const Dotenv = require('dotenv-webpack');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
	mode: process.env.NODE_ENV || 'development',
	devtool: 'source-map',
	entry: './src/index.js',
	output: {
		path: path.join(__dirname, 'build'),
		filename: 'index.js',
		publicPath: '/'
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			}
		]
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	plugins: [
		new Dotenv(),
		new HtmlPlugin({
			hash: true,
			filename:
				process.env.NODE_ENV == 'production' ? 'index.blade.php' : 'index.html',
			template: 'src/public/index.html'
		})
	],
	devServer: {
		historyApiFallback: true
	}
};
