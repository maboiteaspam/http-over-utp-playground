

var utp = require('utp');
var net = require('net');
var express = require('express');

// this example does not work
// it is not so simple : )

var app = express();

app.get('/', function(req,res){
    console.log('got /');
    res.send('hello');
});

var server = utp.createServer(app);
server.listen(10000, function() {
    console.log('bound');
    var utpClient = utp.connect(10000, '127.0.0.1');

    var q = "GET / HTTP/1.1\r\nHost: some.com\r\n";
    console.log('send ');
    console.log(q);
    utpClient.write(q);
    utpClient.on('data', function(data) {
        console.log('client says '+data);
    });
});