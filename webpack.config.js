var path = require("path");

var port = process.env.PORT || 8020;
var host = process.env.IP || "127.0.0.1";

module.exports = {
  devtool: "#inline-source-map",
//   entry: [
//     "normalize.css",
//     "./src/styles/app.css",
//     "eventsource-polyfill", // necessary for hot reloading with IE
//     "./src/index",
//   ],
  output: {
    path: __dirname,
    filename: "bundle.js",
    publicPath: "/static/",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        include: path.join(__dirname, "src"),
        use: {
          loader: "babel-loader",
          options: {
            babelrc: false,
            presets: [
              [
                '@babel/env',
                {
                    "loose": true,
                    "targets": {
                      "browsers": [
                        "> 0.1%",
                        "last 3 versions",
                        "ie 10",
                        "ie 11"
                      ]
                    }
                 }
            ],
              "@babel/preset-react",
              [
                "@babel/preset-typescript",
                {
                  isTSX: true,
                  allExtensions: true,
                },
              ],
            ],
            plugins: [
              ["@babel/plugin-proposal-optional-chaining"],
              "react-hot-loader/babel",
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  devServer: {
    port: port,
    host: host,
  },
};
