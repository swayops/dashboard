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

const ENV = process.env.ENV || 'dev';

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
		root: [path.join(__dirname, 'app'), path.join(__dirname, 'node_modules')],
		moduleDirectories: [path.join(__dirname, 'node_modules')],
		extensions: ['', '.js', '.ts']
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
			'process.env': {
				'ENV': JSON.stringify(ENV)
			}
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: Infinity,
		}),
	]
};

if (ENV === 'production') {
	cfg.devtool = 'cheap-source-map';
	cfg.plugins.push(
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
			algorithm: "gzip",
			test: /\.js$|\.map$/,
			threshold: 4096,
			minRatio: 0.8
		})
	);
}

module.exports = cfg;

console.log('Build ENV:', ENV);
