'use strict';

const path = require('path');
const glob = require('glob');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    context: path.resolve(__dirname),
    entry: {
        index: './src/views/index.js',
        public: './src/views/public/public.js'
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.(hbs|handlebars)$/,
                loader: 'handlebars-loader',
                options: {
                    helperDirs: [
                        path.join(__dirname, 'src', 'helpers')
                    ],
                    partialDirs: [
                        path.join(__dirname, 'src', 'components'),
                        path.join(__dirname, 'src', 'layouts'),
                        path.join(__dirname, 'src', 'views')
                    ].concat(glob.sync('**/',
                        {
                            cwd: path.resolve(__dirname, 'src', 'components'),
                            realpath: true
                        }
                    )),
                    inlineRequires: '\/assets/img\/'
                }
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|svg|jpe?g|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]',
                        context: 'src',
                    }
                }]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]',
                        context: 'src',
                    }
                }]
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist'], {
            verbose: true,
            dry: false
        }),
        new CopyWebpackPlugin([
            { from: './src/assets', to: 'assets'}
        ]),
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
            chunkFilename: "[id].css"
        }),
        new HtmlWebpackPlugin({
            title: 'index',
            template: './src/views/index.hbs',
            filename: 'index.html',
            description: 'index of pages',
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            title: 'public page',
            template: './src/views/public/public.hbs',
            filename: 'public/index.html',
            description: 'This is my public page',
            chunks: ['public']
        }),
    ],
    devServer: {
        contentBase: './dist',
        host: 'localhost', // by default, to public 0.0.0.0
        port: 3000,
    }
}