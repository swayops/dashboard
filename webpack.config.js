'use strict';
var webpack = require('webpack'),
	path = require('path'),
	fs = require('fs'),
	CompressionPlugin = require("compression-webpack-plugin");

// clean up old files
['app.js', 'app.js.map', 'app.js.gz', 'app.js.map.gz', 'vendor.js', 'vendor.js.map', 'vendor.js.gz', 'vendor.js.map.gz'].forEach(function(fp) {
	// eslint-disable-next-line
	try { fs.unlinkSync('static/' + fp); } catch (e) { };
});

const isProd = process.env.ENV === 'production';

var cfg = {
	devtool: 'eval',

	entry: {
		'vendor': './app/vendor.ts',
		'app': './app/main.ts'

	},

	output: {
		filename: 'static/[name].js',
		chunkFilename: 'static/[name].js'
	},

	resolve: {
		extensions: ['', '.webpack.js', '.web.js', '.ts', '.js'],
		moduleDirectories: [path.join(__dirname, 'node_modules')],
		root: [path.join(__dirname, 'app')],
	},
	resolveLoader: {
		root: path.join(__dirname, 'node_modules')
	},

	module: {
		loaders: [
			// {
			// 	test: /\.js$/,
			// 	loader: 'awesome-typescript-loader?doTypeCheck=false&useWebpackText=true',
			// 	exclude: 'node_modules'
			// },
			{
				test: /\.ts$/,
				loaders: ['ts-loader', 'angular2-template-loader'],
				exclude: [/node_modules/, /\.(spec|e2e|d)\.ts$/]
			},
			{
				test: /\.html$/,
				loader: 'raw-loader'
			},
		]
	},

	plugins: [
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			"window.jQuery": "jquery"
		}),
		new webpack.NoErrorsPlugin(),
		new webpack.DefinePlugin({
			'PRODUCTION': isProd
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: Infinity,
		}),
	]
};

if (isProd) {
	cfg.devtool = 'cheap-source-map';
	cfg.plugins.push(
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				dead_code: true,
				evaluate: true,
				loops: true,
				unused: true,
				warnings: false,
				sequences: true,
				conditionals: true,
				booleans: true,
				if_return: true,
				join_vars: true,
				passes: 2
			},
			'screw-ie8': true,
		}),

		new CompressionPlugin({
			asset: "[path].gz[query]",
			algorithm: "zopfli",
			test: /\.js$|\.map$/,
			threshold: 4096,
			minRatio: 0.8
		})
	);
}

module.exports = cfg;
