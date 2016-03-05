var express = require('express'),
    bodyParser = require('body-parser'),
    cdlApi = require('./server/cdlApi.js'),
    yelp = require("./server/yelpApi.js"),
    app = express(),
    //https = require('https'),
    request = require('request'),
    router = express.Router();

var SERVER_PORT = process.env.PORT || 3000;

/*app.get('/', function functionName(req, res) {
    // return index.html and stuff
    res.writeHead(200, {'Content-Type' : 'application/json'});
    res.end(JSON.stringify({ obj : 'prop' }));
});*/
app.use(bodyParser.json());
app.use(express.static('client'));

app.use('/api', router);

router.get('/yelp', function(req, res) {

    router.get()

    //res.writeHead(200, {'Content-Type': 'text/plain'});
    //res.end('Hello');
});

router.post('/cdl', function (req, res) {
    var locations = req.body;

    if(locations instanceof Array){
        res.writeHead(200, {'Content-Type': 'application/json'});
        cdlApi(locations).then(function(data){
            console.log(data);
            console.log(locations);
            var results = locations.map(function(location){
                for(var idx in data){
                    if(location.ID == data[idx].ID){
                        location.risk = data[idx].risk;
                        return location;
                    }
                }
            });
            res.end(JSON.stringify(results, null, 4));
        });
    }
    else {
        res.writeHead(300, {'Content-Type': 'text/plain'});
        res.end('Invalid arguments. Data provided should be an array');
    }
})

app.listen(SERVER_PORT, function(){
    console.log('Listening on port', SERVER_PORT);
});
