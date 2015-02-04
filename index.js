

var utp = require('utp');
var net = require('net');

// this example open a tcp socket that you can reach via your browser
// it then send the HTTP query via UTP
// It s not defined here how the server may look like,
// i stopped on declaring the UTP remote endpoint.

/* LOCAL */
var localTCPServer = net.createServer(function(c) { //'connection' listener
    console.log('client connected');
    c.on('end', function() {
        console.log('client disconnected');
    });

    c.on('data', function(request) {
        console.log('got data')
        // this is where the data are now transported via UTP
        var utpClient = utp.connect(10001, '127.0.0.1');
        utpClient.write(request);
    });
});
localTCPServer.listen(8124, '127.0.0.1'); // this is where your browser should proxy his connection


/* REMOTE */
// this is the UTP remote end point
var remoteUTPServer = utp.createServer(function(socket) {
    console.log('new connection!');
    socket.on('data', function(data) {
        console.log('client says '+data);
        // system should now forward the request to an http server
        // via TCP again ?
    });
});
remoteUTPServer.listen(10001);
