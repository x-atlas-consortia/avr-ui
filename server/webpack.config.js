module.exports = {
    entry: {
        search: "./antibodyapi/webui/static/js/SearchPage.js",
        unauthorized: "./antibodyapi/webui/static/js/Unauthorized.js",
        upload: "./antibodyapi/webui/static/js/Upload.js",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: "babel-loader",
            },
            {
                test: /\.(svg|png|jpg|jpeg|gif)$/,
                loader: "file-loader",

                options: {
                    name: "[name].[ext]",
                    outputPath: "./static/dist",
                },
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    output: {
        path: __dirname + "/antibodyapi/static/dist",
        filename: "[name].bundle.js",
    },
};