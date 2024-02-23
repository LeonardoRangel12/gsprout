const path = require('path');

module.exports = {
    entry: './app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.bundle.js'
    },
    mode: 'development',
    devtool: 'source-map',
    target: 'node',
    node: {
        __dirname: false
    },
    plugins: [
        new webpack.EnvironmentPlugin([
            "NODE_ENV",
            "SECRET",
            "PORT",
        ]),
    ],
};