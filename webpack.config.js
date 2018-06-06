module.exports = {
	entry: './dist/global.mjs',
	output: {
		filename: 'dtk.bundle.js',
		path: __dirname + '/dist',
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				use: ['source-map-loader'],
				enforce: 'pre'
			}
		]
	},
	devtool: 'source-map',
	mode: 'production'
};
