'use strict';
var webpack = require('webpack'),
	path = require('path'),
	fs = require('fs'),
	CompressionPlugin = require("compression-webpack-plugin");

// clean up old files
['app.js', 'vendor.js'].forEach(function(fp) {
	[fp, fp + '.gz', fp + '.map', fp + '.map.gz'].forEach(fp => {
		// eslint-disable-next-line
		try { fs.unlinkSync('static/' + fp); } catch (e) { };
	})
});

const isProd = process.env.ENV === 'production';

function aliasify(o) {
	for (var name in o) {
		var fp = o[name];
		o[name] = path.join(__dirname, 'node_modules', name, fp + '.min.js')
	}
	return o;
}

var cfg = {
	devtool: 'eval',
	debug: true,
	entry: {
		'vendor': ['babel-polyfill', './app/vendor.ts'],
		'app': './app/main.ts'
	},

	output: {
		path: __dirname + '/static/',
		filename: '[name].js',
		chunkFilename: 'static/[name].js'
	},

	resolve: {
		extensions: ['', '.ts', '.js', '.json'],
		root: __dirname,
		alias: aliasify({
			'jquery': 'dist/jquery',
			'@angular/common': 'bundles/common.umd',
			'@angular/compiler': 'bundles/compiler.umd',
			'@angular/core': 'bundles/core.umd',
			'@angular/forms': 'bundles/forms.umd',
			'@angular/http': 'bundles/http.umd',
			'@angular/platform-browser-dynamic': 'bundles/platform-browser-dynamic.umd',
			'@angular/platform-browser': 'bundles/platform-browser.umd',
			'@angular/router': 'bundles/router.umd',
		})
	},

	module: {
		loaders: [
			{
				test: /\.ts$/,
				loaders: ['awesome-typescript', 'angular2-template']
			},
			{
				test: /\.(html|json|css)$/,
				loader: 'raw'
			},
		]
	},

	plugins: [
		new webpack.NoErrorsPlugin(),
		new webpack.LoaderOptionsPlugin({
			minimize: true,
			debug: true,
		}),

		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
		}),
		new webpack.DefinePlugin({
			'PRODUCTION': isProd
		}),
		new webpack.optimize.CommonsChunkPlugin({
			names: ['app', 'vendor'],
			minChunks: Infinity
		}),
	],
	noParse: [/@angular/]
};

if (isProd) {
	cfg.devtool = 'source-map';
	cfg.plugins.push(
		new webpack.optimize.OccurrenceOrderPlugin(true),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compressor: { screw_ie8: true, keep_fnames: true, warnings: false },
			mangle: { screw_ie8: true, keep_fnames: true },
			output: {
				comments: false
			},
			beautify: false,
			exclude: [ /\.min\.js$/g ],
			sourceMap: true,
		}),
		new webpack.optimize.AggressiveMergingPlugin(),
		new CompressionPlugin({
			asset: "[path].min.gz[query]",
			algorithm: "zopfli",
			test: /\.js$|\.map$/,
			threshold: 4096,
			minRatio: 0.8
		})
	);
}

module.exports = cfg;
