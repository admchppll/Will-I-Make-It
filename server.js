var express = require('express'),
    bodyParser = require('body-parser'),
    cdlApi = require('./server/cdlApi.js'),
    yelp = require("./server/yelpApi.js"),
    app = express(),
    request = require('request'),
    router = express.Router();

var SERVER_PORT = process.env.PORT || 3000;

const YELP_DEFAULTS = {
    BASE_URL: 'https://api.yelp.com/v2/search',
    limit : 20,
    sortMode: 1,
    radiusMeters: 1000,
    dealsBool: false
};
var YELP_OPTIONS = YELP_DEFAULTS;


app.use(bodyParser.json());  // is this needed???
app.use(express.static('client'));

app.use('/api', router);

router.post('/yelp', function(req, res) {
    console.log(req.body);
    var location =  req.body.location;
    var category = req.body.category;

    //console.log(BASE_URL + yelp.buildStr());  // use if the request fails
    //console.log(YELP_OPTIONS);
    request(YELP_OPTIONS.BASE_URL + yelp.buildStr(YELP_OPTIONS, category, location), function(err, yelpRes, body){
        var response = JSON.parse(body);
        res.json(JSON.stringify(yelp.toResults(response)));
    });

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

/*app.get('/', function functionName(req, res) {
    // return index.html and stuff
    res.writeHead(200, {'Content-Type' : 'application/json'});
    res.end(JSON.stringify({ obj : 'prop' }));
});*/
app.listen(SERVER_PORT, function(){
    console.log('Listening on port', SERVER_PORT);
});
