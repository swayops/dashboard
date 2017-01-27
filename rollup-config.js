import rollup from 'rollup';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import typescript from 'rollup-plugin-typescript';

const isProd = process.env.NODE_ENV === 'production',
	plugins = [
		typescript({
			typescript: require('typescript'),
		}),
		nodeResolve({
			main: true,
			jsnext: true,
		}),
		commonjs({
			include: ['node_modules/rxjs/**'],
		}),
	];

if (isProd) plugins.push(uglify());
//paths are relative to the execution path
export default {
	entry: isProd ? 'app/main.ts' : 'app/main.jit.ts',
	dest: 'static/app.js', // output a single application bundle
	sourceMap: true,
	//sourceMapFile: 'static/app.js.map',
	format: 'iife',
	intro: 'var PRODUCTION = ' + isProd + ';',
	plugins: plugins,
	context: 'window',
};
