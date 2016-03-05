var request = require('request'),
    _ = require('lodash'),
    math = require('mathjs'),
    apiURL = 'http://elastic.hackathon.cdlaws.co.uk/hackathondata/_search';

module.exports = function run(locations) {
    var requests = locations.map(function(location){
        return (
            function(location){
                return new Promise(function(resolve){
                    getLocationData(location).then(function(data) {
                        calculateRisk(data, resolve);
                    });
                });
            }
        )(location);
    });
    return Promise.all(requests);
}

function getLocationData (location) {
    //console.log(location);
    return new Promise(function(resolve, reject){
        request({
            url: apiURL,
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(createRequestData(location.lat, location.lon))
        }, function(err, res, data){
            resolve({ cdlData : data, ID : location.ID }); //JSON data
        });
    });
}

function createRequestData (lat, lon) {
    return {
        fields : ['accidentSeverity', 'numberofVehicles', 'numberofCasualties', 'year'],
        query : {
            bool : {
                must : {
                    match_all : {}
                },
                filter : {
                    geo_distance : {
                        distance: '1km',
                        location : lat + ',' + lon
                    }
                }
            }
        }
    };
}

function calculateRisk (data, resolve) {
    var cdlData = JSON.parse(data.cdlData).hits.hits;
    if(cdlData.length > 0) {
        Object.defineProperty(cdlData, 'getArray', { value : getArray });

        var count = cdlData.length,
        years = cdlData.getArray('year'),
        latestYear = Math.max.apply(null, years),
        yearRisk = calcYearRisk(years, latestYear); // final


        var casualties = cdlData.getArray('numberofCasualties'),
        avgCasualties = math.mean(removeSpike(casualties)),
        casualtiesRisk = calcCasualitiesRisk(avgCasualties); // final

        var severities = cdlData.getArray('accidentSeverity');
        var severityRisk = calcSeverityRisk(severities); // final

        var vehicles = cdlData.getArray('numberofVehicles'),
        avgVehicles = math.mean(removeSpike(vehicles)),
        vehiclesRisk = calcVehiclesRisk(avgVehicles); // final

        var finalRisk = (yearRisk + casualtiesRisk + severityRisk + vehiclesRisk) * 10;

        // console.log(years, yearRisk);
        // console.log(casualties, casualtiesRisk);
        // console.log(severities, severityRisk);
        // console.log(vehicles, vehiclesRisk);
        resolve({ risk : finalRisk, ID : data.ID });
    } else {
        resolve(null);
    }
}

function removeSpike (data) {
    if(math.std(data) > 5) {
        removeSpike(data.sort().splice(0, data.length-1));
    } else {
        return data;
    }
}

function getArray (key) {
    return this.map(function(record){
        return record.fields[key] instanceof Array ? record.fields[key][0] : record.fields[key];
    })
}

function calcYearRisk (years, latestYear) {
    var thisYear = new Date().getFullYear(),
        diffLatestYear = thisYear - latestYear,
        freqOfLatestYear = years.join(' ').match(new RegExp(latestYear.toString(), 'gi')).length;

    var diffYearMult = -(diffLatestYear * 0.7),
        freqYearMult = freqOfLatestYear;

    return diffYearMult + freqYearMult;
}

function calcCasualitiesRisk (avgCasualties) {
    return avgCasualties * 1.5;
}

function calcSeverityRisk (severities) {
    //console.log(severities);
    var slight = 0,
        serious = 0,
        fatal = 0
        count = severities.length || 1;

    severities.forEach(function(record){
        switch (record.toLowerCase()) {
            case 'slight': slight++;
                break;
            case 'serious': serious++;
                break;
            case 'fatal': fatal++;
                break;
        }
    });

    slight = slight / severities.length;
    serious = serious / severities.length;
    fatal = fatal / severities.length;

    return fatal + serious*0.8 + slight*0.5;
}

function calcVehiclesRisk (avgVehicles) {
    return avgVehicles * 1.5;
}

/*
{
  "hits": {
    "total": 253,
    "max_score": 1,
    "hits": [
      {
        "_index": "hackathondata",
        "_type": "accident",
        "_id": "AVNB0yY4TNrM-79sYhPC",
        "_score": 1,
        "fields": {
          "accidentSeverity": [
            "Serious"
          ],
          "year": [
            2005
          ],
          "numberofCasualties": [
            1
          ],
          "weatherConditions": [
            "Fine no high winds"
          ],
          "numberofVehicles": [
            1
          ]
        }
      },
*/
