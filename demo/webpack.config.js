module.exports = {
	entry: './demo.js',
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
