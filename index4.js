

var http = require('http');
var ServerResponse = http.ServerResponse;
var utp = require('utp');
var express = require('express');

// this example tries to provide more complete and workable
// real life example.
// Still data transport is one via UTP
// but this time we take advantage of creationix/node-web module
// to parse the http query to then handle it via a classical express app

// as you ll see, it s most dirty example
// (i did not really wanted to write http query/response parser)
// as a consequence it s kind of realllyy dirty and broken, HTTP responses are wrong.

var app = express();
app.get('/', function(req,res,then){
    res.end("hello");
    then();
});

var handler = require('./web').socketHandler(function(req,finRes){
    console.log("*---------- handling http request")

    req.url = '/';
//    console.log(req)
    var res = new ServerResponse(req);
    app.handle(req, res, function(){
        console.log("*---------- sending http response")
        console.log(res._renderHeaders())
        finRes(res.statusCode, {}, res);
    });
});

var server = utp.createServer(handler);

server.listen(10000, function() {
    console.log('bound');
    var utpClient = utp.connect(10000, '127.0.0.1');
    var q = "GET / HTTP/1.1\r\nHost: some.com\r\n\r\n";
    console.log('send ');
    console.log(q);
    utpClient.write(q);
    utpClient.on('data', function(data) {
        console.log("*---------- receiving http response")
        data = data.toString();
        data.match(/200 OK/)
        data.match(/hello/)
        console.log('client says ');
        console.log(data);
        utpClient.end();
        server.close();
    });
});
