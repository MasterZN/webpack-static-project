'use strict';

const path = require('path');
const glob = require('glob');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const pages = require('./src/helpers/pages.json').pages;
let entries = {};
let renderedPages = [];

for (let i = 0; i < pages.length; i++) {
    let page = Object.assign({}, pages[i]);
    renderedPages.push(
        new HtmlWebpackPlugin({
            title: page.name + ' page',
            template: './src/views/' + page.name + '/' + page.name +'.hbs',
            filename: page.name + '/index.html',
            description: page.description,
            templateParameters: require('./src/helpers/pages.json'),
            chunks: [page.name]
        })
    );

    entries[page.name] = './src/views/' + page.name + '/' + page.name + '.js';
}

module.exports= () => {
    let webpackConfig = {
        mode: 'development',
        context: path.resolve(__dirname),
        entry: {
            index: './src/theme/views/index.js',
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
                            path.join(__dirname, 'src', 'theme'),
                            path.join(__dirname, 'src', 'views')
                        ].concat(glob.sync('**/',
                            {
                                cwd: path.resolve(__dirname, 'src'),
                                realpath: true
                            }
                        ))
                    }
                },
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                url: false
                            },
                        },
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
                template: './src/theme/views/index.hbs',
                filename: 'index.html',
                description: 'index',
                templateParameters: require('./src/helpers/pages.json'),
                chunks: ['index']
            }),
        ],
        devServer: {
            contentBase: './dist',
            host: 'localhost', // by default, to public 0.0.0.0
            port: 3000,
        }
    };

    webpackConfig.plugins = webpackConfig.plugins.concat(renderedPages);
    webpackConfig.entry = Object.assign({}, webpackConfig.entry, entries);

    return webpackConfig;
};
