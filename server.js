var express = require('express'),
    bodyParser = require('body-parser'),
    cdlApi = require('./server/cdlApi.js'),
    app = express()
    router = express.Router();

var SERVER_PORT = process.env.PORT || 3000;

/*app.get('/', function functionName(req, res) {
    // return index.html and stuff
    res.writeHead(200, {'Content-Type' : 'application/json'});
    res.end(JSON.stringify({ obj : 'prop' }));
});*/
app.use(bodyParser.json());
app.use('/api', router);

router.get('/yelp', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello');
});

router.post('/cdl', function (req, res) {
    var lat = req.body[0].lat,
        lon = req.body[0].lon;
    // expect 2nd loc set

    res.writeHead(200, {'Content-Type': 'text/plain'});

    cdlApi(lat,lon).then(function(data){
        console.log(data);
        res.end(data.toString());
    });
})

app.listen(SERVER_PORT, function(){
    console.log('Listening on port', SERVER_PORT);
});
