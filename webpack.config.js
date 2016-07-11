'use strict';
var webpack = require('webpack'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	CompressionPlugin = require("compression-webpack-plugin");

const ENV = process.env.ENV || 'dev';

var entries = {
	//	'vendor': './app/vendor.ts',
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
	plugins = plugins.concat([
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name: Object.keys(entries)
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				dead_code: true,
				properties: true,
				drop_debugger: true,
				evaluate: true,
				loops: true,
				unused: true,
				join_vars: true,
				warnings: false,
				passes: 2
			},
			'screw-ie8': true,
		}),

		new CompressionPlugin({
			asset: "[path].gz[query]",
			algorithm: "gzip",
			test: /\.js$|\.css$|\.html$/,
			threshold: 10240,
			minRatio: 0.8
		})
	]);
}

module.exports = {
	devtool: ENV === 'production' ? 'source-map' : 'eval',
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
