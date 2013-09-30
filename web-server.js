(function () {
    "use strict";

    var express = require('express');
    var httpProxy = require("http-proxy");
    var path = require("path");

    var args = process.argv.splice(2);
    var basePort = Number(args[0]);
    var packageDir = args[1];


    function createServer(domain, port) {
        var options = {
            changeOrigin: true
        };
        httpProxy.createServer(80, domain, options, proxyRequest).listen(port);
        console.log("Port " + port + " is proxying to " + domain);
    }

    var app = express();
    app.use(express.static(packageDir));
    app.listen(basePort);
    console.log('Package (' + path.resolve(packageDir) + ') is served on http://localhost:' + basePort);
})();
