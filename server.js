var express = require('express'),
    app = express()
    router = express.Router();

var SERVER_PORT = process.env.PORT || 3000;

/*app.get('/', function functionName(req, res) {
    // return index.html and stuff
    res.writeHead(200, {'Content-Type' : 'application/json'});
    res.end(JSON.stringify({ obj : 'prop' }));
});*/

app.use('/api', router);

router.get('/yelp', function yelpApi(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello');
});

router.get('/cdl', function cdlApi(req, res) {
    console.log('CDL Api hit');
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end('{}');
})

app.listen(SERVER_PORT, function(){
    console.log('Listening on port', SERVER_PORT);
});
