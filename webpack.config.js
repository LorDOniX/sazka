const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const PACKAGE = require('./package.json');

module.exports = envVars => {
	const { env } = envVars;
	const production = env && env === "prod";
	const nameWithHase = `[name]${PACKAGE.version.toString().replace(/[.]/g, "")}`;

	return {
		mode: production ? 'production' : 'development',
		devtool: production ? 'source-map' : 'cheap-module-source-map',
		entry: path.resolve(__dirname, "./src/index.tsx"),
		output: {
			path: path.resolve(__dirname, "./dist"),
			publicPath: '/',
			filename: production ? `${nameWithHase}.js` : '[name].js',
			chunkFilename: function chunkName() {
				return `${nameWithHase}.js`;
			},
			globalObject: 'self',
		},
		resolve: {
			extensions: [".tsx", ".ts", ".js", ".jsx", ".mjs"],
			alias: {
				'~': path.resolve(__dirname, './src'),
			},
		},
		module: {
			rules: [{
				test: /\.(ts|js)x?$/u,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							'@babel/preset-typescript',
							[
								'@babel/preset-react',
								{
									runtime: 'automatic',
								},
							],
							[
								'@babel/preset-env',
								{
									modules: false,
									useBuiltIns: 'usage',
									corejs: '3',
								},
							],
						],
						plugins: [
							'@babel/plugin-proposal-class-properties',
							'@babel/plugin-proposal-object-rest-spread',
							'@babel/plugin-syntax-dynamic-import',
						],
					},
				},
			}, {
				test: /\.(css|less)$/u,
				use: [
					production ? MiniCssExtractPlugin.loader : 'style-loader',
					{
						loader: 'css-loader',
						options: {
							importLoaders: 2,
							esModule: false,
						},
					},
					'postcss-loader',
					{
						loader: 'less-loader',
						options: {
							lessOptions: {
								paths: [
									path.resolve(__dirname, './src'),
								],
							},
						},
					},
				],
			}, {
				test: /\.(png|svg|jpg|gif)$/u,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 2048,
						},
					},
				],
			}, {
				test: /\.(woff|woff2|eot|ttf|otf)$/u,
				use: 'file-loader',
			}]
		},
		devServer: {
			client: {
				overlay: false,
			},
			port: 4444,
			hot: true,
			open: false,
			historyApiFallback: true,
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: path.resolve(__dirname, "./public/index.ejs"),
			}),
			new CleanWebpackPlugin(),
			new StyleLintPlugin({
				customSyntax: "postcss-less",
				files: '**/*.(le|c)ss',
			}),
			new ESLintPlugin({
				extensions: ['js', 'jsx', 'ts', 'tsx'],
			}),
			new CopyPlugin({
				patterns: [
					{ from: 'browserconfig.xml', context: path.resolve(__dirname, 'public') },
					{ from: 'manifest.json', context: path.resolve(__dirname, 'public') },
					{ from: 'robots.txt', context: path.resolve(__dirname, 'public') },
					{ from: 'favicon/*', context: path.resolve(__dirname, 'src/assets') },
					{ from: 'img/*', context: path.resolve(__dirname, 'src/assets') },
				],
			}),
			...production ? [
				new MiniCssExtractPlugin({
					chunkFilename: `${nameWithHase}.css`,
					filename: `${nameWithHase}.css`,
				}),
				new CompressionPlugin({
					filename: '[path][base].gz[query]',
					algorithm: 'gzip',
					test: /\.js$|\.css$|\.html$/u,
					minRatio: 1,
				}),
				new CompressionPlugin({
					filename: '[path][base].br[query]',
					algorithm: 'brotliCompress',
					test: /\.(js|css|html|svg)$/u,
					compressionOptions: { level: 11 },
					minRatio: 1,
				}),
			] : [
				new ReactRefreshWebpackPlugin({
					overlay: false,
				}),
			],
		],
		optimization: {
			minimizer: [
				new TerserPlugin({
					parallel: true,
				}),
				new CssMinimizerPlugin(),
			],
			splitChunks: {
				cacheGroups: {
					vendor: {
						test: /node_modules/u,
						chunks: 'initial',
						name: 'vendor',
						enforce: true,
					},
				},
			},
		},
	};
};
