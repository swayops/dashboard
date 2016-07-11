'use strict';
var webpack = require('webpack'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	path = require('path');

const ENV = process.env.ENV || 'dev';

var entries = {
	'vendor': './app/vendor.ts',
	'app': './app/main.ts'
},
	plugins = [
		new webpack.NoErrorsPlugin(),

		new webpack.DefinePlugin({
			'process.env': {
				'ENV': JSON.stringify(ENV)
			}
		})
	];

if (ENV === 'production') {
	plugins.concat([
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name: Object.keys(entries)
		})
	]);
}

module.exports = {
	devtool: 'source-map',
	entry: entries,
	output: {
		filename: 'static/[name].js'
	},
	resolve: {
		extensions: ['', '.js', '.ts']
	},
	htmlLoader: {
		minimize: false // workaround for ng2
	},
	module: {
		loaders: [
			{
				test: /\.ts$/,
				loaders: ['ts', 'angular2-template-loader']
			},
			{
				test: /\.html$/,
				loader: 'raw-loader',
				//exclude: root('.'),
			},
			{
				test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
				loader: 'file?name=assets/[name].[hash].[ext]'
			},
			{
				test: /\.css$/,
				//exclude: helpers.root('src', 'app'),
				loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
			},
			{
				test: /\.css$/,
				//include: helpers.root('src', 'app'),
				loader: 'raw'
			}
		]
	},

	plugins: plugins
};

console.log('Build ENV:', ENV);
