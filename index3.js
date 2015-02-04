

var utp = require('utp');



var handler = require('./web').socketHandler(function(req,res){
    console.log("*---------- handling http response")
    res(200, {}, 'hello');
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
        data = data.toString();
        data.match(/200 OK/)
        data.match(/hello/)
        console.log('client says ');
        console.log(data);
        utpClient.end();
        server.close();
    });
});
