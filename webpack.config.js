'use strict';
var webpack = require('webpack'),
	path = require('path'),
	fs = require('fs'),
	CompressionPlugin = require("compression-webpack-plugin");


function CleanPlugin(base, files) {
	this.base = base;
	this.files = files || [];
	this.exts = Array.prototype.slice.call(arguments, 2) || [];
}

CleanPlugin.prototype = {
	allFiles: function() { return this.files.concat(this.files.map(fp => this.exts.map(ext => fp + ext))); },

	apply: function(compiler) {
		compiler.plugin('done', () => this.clean());
	},

	clean: function() {
		this.allFiles().forEach(fp => {
			try {
				const fn = path.join(this.base, fp);
				fs.unlinkSync(fn);
				console.log('removed ', fp);
			} catch (e) { /***/ };
		});
	}
}

const isProd = process.env.NODE_ENV === 'production',
	nodePath = path.join(__dirname, 'node_modules'),
	staticPath = path.join(__dirname, 'static'),
	appPath = path.join(__dirname, 'app');


function aliasify(o) {
	for (let name in o) {
		const fp = o[name];
		o[name] = path.join(nodePath, name, fp + '.min.js')
	}
	return o;
}

const cfg = {
	devtool: 'cheap-module-source-map',
	entry: {
		'app': './app/main.ts',
		'vendor': './app/vendor.ts'
	},

	output: {
		path: staticPath,
		filename: '[name].js',
		chunkFilename: 'static/[name].js'
	},

	resolve: {
		extensions: ['.js', '.ts', '.json', '.html', '.css'],
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
	},

	module: {
		loaders: [
			{
				test: /\.ts$/,
				loaders: ['awesome-typescript', 'angular2-template'],
				//include: appPath,
			},
			{
				test: /\.(html|json|css|js)$/,
				loader: 'raw',
				include: appPath,
			},
		]
	},

	plugins: [
		new webpack.NoErrorsPlugin(),
		new webpack.LoaderOptionsPlugin({
			noParse: [/@angular/, /\.min.js$/],
			minimize: true,
			debug: !isProd,
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
	]
};

const cleanPlugin = new CleanPlugin(staticPath, Object.keys(cfg.entry).map(fp => fp + '.js'), '.map', '.gz', '.map.gz');

cleanPlugin.clean(); // force remove all the old files.

if (isProd) {
	cleanPlugin.exts = ['.map']; // remove the non-gzip'ed files.
	cfg.devtool = 'source-map';
	cfg.plugins.push(
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				evaluate: true,
				dead_code: true,
				properties: true,
				booleans: true,
				loops: true,
				unused: true,
				join_vars: true,
				collapse_vars: true,
				warnings: false,
				angular: true,
				unsafe: true,
				passes: 2,
			},
			mangle: false,
			exclude: [/\.min\.js$/g],
			sourceMap: true,
		}),
		new CompressionPlugin({
			asset: "[path].gz[query]",
			algorithm: "zopfli",
			test: /\.js$|\.map$/,
			threshold: 4096,
			minRatio: 0.8
		}),
		cleanPlugin
	);
}

module.exports = cfg;
