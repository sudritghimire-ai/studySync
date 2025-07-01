const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development", // or "production" for build
  entry: "./src/index.js", // your React app entry point
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/", // important for React Router
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/, // if you use css
        use: ["style-loader", "css-loader"],
      },
      // add loaders for images/fonts if needed
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  devServer: {
    historyApiFallback: true, // this fixes the 404 refresh problem
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 3000,
    open: true, // opens browser automatically
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html", // your html template
    }),
  ],
};
