var http = require('http');
var BASE_URL = 'https://api.yelp.com/v2/search/',
    AUTH = {
        CONSUMER_KEY:'lPHM9OnJ9UGAdC5MNvhhDg',
        CONSUMER_SECRET:'_R14pqB0pYmZ9oIswBatGbnA5q8',
        TOKEN:'nAA2JtgVVOxhp4hf-rIk-FFIe3VTVqB-',
        TOKEN_SECRET:'5INVOnBSKAgvynudU95QSiCTubo'
    }
var request = {
    Authentication : AUTH
}

function buildURL(category, addressString){
    var url = '';
    
    if (addressString !== ''){
        url + 'location=' + addressString + '&';
    }
    if (category !== ''){
        url + 'category_filter=' + category;
    }
    
    return url = '?' + url;
};



module.exports = {
    buildURL: buildURL
    
}