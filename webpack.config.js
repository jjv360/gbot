
//
// WebPack config file

var webpack = require('webpack');

module.exports = {
    plugins: [],
    module: {
        loaders: []
    }
};
// The app's starting file
module.exports.entry = "./src/index.js";

// The final app's JS output file
module.exports.output = {
    path: __dirname + "/dist/",
    filename: "bot.min.js",
    libraryTarget:"var",
    library:"Bot"
};
// Output a sourcemap
module.exports.devtool = "source-map";

// Compile support for ES6 classes and React etc
module.exports.module.loaders.push({
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
    query: {
        presets: ["es2015"]
    }
});


// Minify javascript
module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
        warnings: false
    },
    output: {
        comments: false
    }
}));
