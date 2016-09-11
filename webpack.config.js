var path = require('path');

var port = process.env.PORT || 8020;
var host = process.env.IP || '127.0.0.1';

module.exports = {
    devtool: '#inline-source-map',
    entry: [
        'normalize.css',
        './src/styles/app.css',
        'eventsource-polyfill', // necessary for hot reloading with IE
        './src/index'
    ],
    output: {
        path: __dirname,
        filename: 'bundle.js',
        publicPath: '/static/'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel',
            include: path.join(__dirname, 'src'),
            query: {
                presets: ['es2015','react', 'react-hmre']
            }
        }, {
            test: /\.css$/,
            loaders: ['style', 'css'],
        }]
    },
    resolve: {
        root: path.resolve('./src'),
    },
    devServer: {
        port: port,
        host: host
    }
};
