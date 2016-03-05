var request = require('request'),
    _ = require('lodash'),
    math = require('mathjs'),
    apiURL = 'http://elastic.hackathon.cdlaws.co.uk/hackathondata/_search';

module.exports = function run(lat, lon) {
    return new Promise(function(resolve){
        getLocationData(lat, lon).then(function(data) {
            calculateRisk(data, resolve);
        });
    });
}

function getLocationData (lat, lon) {
    return new Promise(function(resolve, reject){
        request({
            url: apiURL,
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(createRequestData(lat, lon))
        }, function(err, res, data){
            resolve(data); //JSON data
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
    var data = JSON.parse(data).hits.hits;
    Object.defineProperty(data, 'getArray', { value : getArray });

    var count = data.length,
        years = data.getArray('year'),
        latestYear = Math.max.apply(null, years),
        yearRisk = calcYearRisk(years, latestYear); // final


    var casualties = data.getArray('numberofCasualties'),
        avgCasualties = math.mean(removeSpike(casualties)),
        casualtiesRisk = calcCasualitiesRisk(avgCasualties); // final

    var severities = data.getArray('accidentSeverity');
    var severityRisk = calcSeverityRisk(severities); // final

    var vehicles = data.getArray('numberofVehicles'),
        avgVehicles = math.mean(removeSpike(vehicles)),
        vehiclesRisk = calcVehiclesRisk(avgVehicles); // final

    var finalRisk = (yearRisk + casualtiesRisk + severityRisk + vehiclesRisk) * 10;

    console.log(years, yearRisk);
    console.log(casualties, casualtiesRisk);
    console.log(severities, severityRisk);
    console.log(vehicles, vehiclesRisk);

    resolve(finalRisk);
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

    var diffYearMult = -(diffLatestYear * 0.8),
        freqYearMult = freqOfLatestYear * 1.5;

    return diffYearMult + freqYearMult;
}

function calcCasualitiesRisk (avgCasualties) {
    return avgCasualties * 1.5;
}

function calcSeverityRisk (severities) {
    var nSlight = 0,
        nSerious = 0,
        slightPerc,
        seriousPerc;

    severities.forEach(function(record){
        switch (record.toLowerCase()) {
            case 'slight': nSlight++;
                break;
            case 'serious': nSerious++;
                break;
        }
    });

    slightPerc = nSlight / severities.length;
    seriousPerc = nSerious / severities.length;

    if (seriousPerc !== 0) {
        return seriousPerc*2 + 1;
    } else {
        return slightPerc + 1
    }
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
