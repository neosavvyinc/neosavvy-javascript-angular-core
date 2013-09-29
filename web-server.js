
(function() {
    "use strict";

    var express = require('express');
    var path = require('path');

    var args = process.argv.splice(2);
    var basePort = Number(args[0]);

    var server = express();

    server.use('/', express.static(__dirname));
    server.use(express.directory(__dirname));

    server.listen(basePort);
    console.log('starting server on port ' + basePort + ' at ' + __dirname);
        
})();
