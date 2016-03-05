var oauth = require('oauth-signature'),
    HTTP_METHOD = 'GET',
    oauthMethod = 'HMAC-SHA1',
    AUTH_KEYS = {
        CONSUMER_KEY:'lPHM9OnJ9UGAdC5MNvhhDg',
        CONSUMER_SECRET:'_R14pqB0pYmZ9oIswBatGbnA5q8',
        TOKEN:'nAA2JtgVVOxhp4hf-rIk-FFIe3VTVqB-',
        TOKEN_SECRET:'5INVOnBSKAgvynudU95QSiCTubo'
    };
var queryString = require('querystring');
var urlencode = require('urlencode');
var nonce = require('nonce')();

//Sort mode: 0=Best matched (default), 1=Distance, 2=Highest Rated. If the mode is 1 or 2 a search may retrieve an additional 20 businesses past the initial limit of the first 20 results. This is done by specifying an offset and limit of 20. Sort by distance is only supported for a location or geographic search. The rating sort is not strictly sorted by the rating value, but by an adjusted rating value that takes into account the number of ratings, similar to a bayesian average. This is so a business with 1 rating of 5 stars doesn’t immediately jump to the top.

function buildRequest(options, category, addressString, offset ){

    var requestParams = {}
    if (category !== undefined){
        requestParams.term = category
    }

    if (addressString !== undefined){
        requestParams.location = addressString
    } else {
        requestParams.location = 'Oldham'; // TODO: Test code remove
    }
    //console.log(options, category, addressString, offset);
    requestParams.limit = options.limit;
    requestParams.sortMode = options.sortMode;
    requestParams.radiusMeters = options.radiusMeters;

    requestParams.oauth_consumer_key = AUTH_KEYS.CONSUMER_KEY;
    requestParams.oauth_token = AUTH_KEYS.TOKEN;
    requestParams.oauth_signature_method = oauthMethod;
    requestParams.oauth_timestamp = new Date().getTime()/1000 | 0;
    requestParams.oauth_nonce = nonce();
    requestParams.oauth_version = '1.0';
    var auth = oauth.generate(HTTP_METHOD, 'https://api.yelp.com/v2/search', requestParams, AUTH_KEYS.CONSUMER_SECRET, AUTH_KEYS.TOKEN_SECRET, {encodeSignature: false});
    requestParams.oauth_signature = auth;


    //var auth = oauth.generate(HTTP_METHOD, BASE_URL, parameters, AUTH_KEYS.CONSUMER_SECRET, AUTH_KEYS.TOKEN_SECRET);

    return requestParams;
};

function toHeaderString(options, category, addressString, offset){
    var obj = buildRequest(options, category, addressString, offset);
    var str = '?'
    Object.getOwnPropertyNames(obj).forEach(function(val){
        str += val + '=' + obj[val]+'&';
    });
    return str.slice(0,-1);
}

function toResultsLayout(jsonResults) {
    var businesses = jsonResults.businesses;
    var returnResultset = []
    console.log(businesses.length + ' Businesses Found');
    businesses.forEach(function(business, index){
        if (!!business.id){
            returnResultset[index] = {
                id: business.id,
                name: business.name,
                url: business.url,
                imgUrl : business.image_url,
                phone: business.display_phone,
                starsUrl : business.rating_img_url_large,
                comment : business.snippet_text,
                isClosed : business.is_closed,
                address: business.location.display_address,
                lat:business.location.coordinate.latitude,
                lon:business.location.coordinate.longitude
            }
        }
    });
    return returnResultset;
}

module.exports = {
    buildURL: buildRequest,
    buildStr: toHeaderString,
    toResults: toResultsLayout

}
