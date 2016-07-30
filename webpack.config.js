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

const isProd = process.env.ENV === 'production',
	nodePath = path.join(__dirname, 'node_modules'),
	staticPath = path.join(__dirname, 'static'),
	appPath = path.join(__dirname, 'app');

function aliasify(o) {
	for (var name in o) {
		var fp = o[name];
		o[name] = path.join(nodePath, name, fp + '.min.js')
	}
	return o;
}

var cfg = {
	devtool: 'eval-source-map',
	debug: true,
	entry: {
		'vendor': './app/vendor.ts',
		'app': './app/main.ts'
	},

	output: {
		path: staticPath,
		filename: '[name].js',
		chunkFilename: 'static/[name].js'
	},

	resolve: {
		extensions: ['', '.ts', '.js', '.json', '.html'],
		root: __dirname,
		alias: aliasify({
			'jquery': 'dist/jquery',
			'bootstrap': 'dist/js/bootstrap',
			'jqueryui': 'jquery-ui',
			'@angular/common': 'bundles/common.umd',
			'@angular/compiler': 'bundles/compiler.umd',
			'@angular/core': 'bundles/core.umd',
			'@angular/forms': 'bundles/forms.umd',
			'@angular/http': 'bundles/http.umd',
			'@angular/platform-browser-dynamic': 'bundles/platform-browser-dynamic.umd',
			'@angular/platform-browser': 'bundles/platform-browser.umd',
			'@angular/router': 'bundles/router.umd',
		}),
		unsafeCache: true,
	},

	module: {
		loaders: [
			{
				test: /\.ts$/,
				loaders: ['awesome-typescript', 'angular2-template'],
				include: appPath,
			},
			{
				test: /\.(html|json|css)$/,
				loader: 'raw',
				include: appPath
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
		new webpack.optimize.OccurrenceOrderPlugin(true),
		new webpack.optimize.AggressiveMergingPlugin(),
	],
	noParse: [/@angular/, /\.min.js$/]
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
			exclude: [/\.min\.js$/g],
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
