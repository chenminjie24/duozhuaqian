const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        background: './src/background.js',
        content_script: './src/content_script.js',
        popup: './src/popup.js'
    },
    output: {
        filename: 'static/[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            // 它会应用到普通的 `.js` 文件
            // 以及 `.vue` 文件中的 `<script>` 块
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            // 它会应用到普通的 `.css` 文件
            // 以及 `.vue` 文件中的 `<style>` 块
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader'
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: "manifest.json",
                    to: "./manifest.json"
                },
                {
                    from: 'static/image/',
                    to: 'static/image'
                },
                {
                    from: 'src/html/',
                    to: 'static'
                },
                {
                    from: 'node_modules/jquery/dist/jquery.min.js',
                    to: 'static'
                }
            ]
        }),
        new VueLoaderPlugin()
    ]
}
