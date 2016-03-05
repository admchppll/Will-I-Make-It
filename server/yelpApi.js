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

function buildRequest(category, addressString, BASE_URL){
    var requestParams = {}
    if (category !== undefined){
        requestParams.term = category
    }
    
    if (addressString !== undefined){
        requestParams.location = location
    } else {
        requestParams.location = 'Oldham';
    }
    
    requestParams.oauth_timestamp = new Date().getTime()/1000 | 0;
    requestParams.oauth_consumer_key = AUTH_KEYS.CONSUMER_KEY;
    requestParams.oauth_token = AUTH_KEYS.TOKEN;
    requestParams.oauth_signature_method = oauthMethod;
    requestParams.oauth_nonce = 'ROmhuz';
    requestParams.oauth_version = '1.0';
    var auth = oauth.generate(HTTP_METHOD, BASE_URL, requestParams, AUTH_KEYS.CONSUMER_SECRET, AUTH_KEYS.TOKEN_SECRET);
    requestParams.oauth_signature = auth;
    
    
    //var auth = oauth.generate(HTTP_METHOD, BASE_URL, parameters, AUTH_KEYS.CONSUMER_SECRET, AUTH_KEYS.TOKEN_SECRET);
    
    return requestParams;
};



module.exports = {
    buildURL: buildRequest


}
