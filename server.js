var express = require('express'),
    app = express();

var SERVER_PORT = process.env.PORT || 3000;

app.get('/', function functionName(req, res) {
    // return index.html and stuff
    res.writeHead(200, {'Content-Type' : 'application/json'});
    res.end(JSON.stringify({ obj : 'prop' }));
});

app.post('/', function functionName(req, res) {

});

app.listen(SERVER_PORT, function(){
    console.log('Listening on port', SERVER_PORT);
});
