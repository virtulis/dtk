const { resolve } = require('path');

module.exports = {
	entry: resolve(__dirname, './demo.js'),
	output: {
		filename: 'demo.bundle.js',
		path: __dirname,
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
