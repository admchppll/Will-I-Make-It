var yelpResults;
var cdlResults;

var object1 = null, object2 = null; //Storing the 2 businesses selected
$(document).ready(function() {
    updateInstructions('stage', 1)
})
function loadCategories() {
    var temp = "";
    $.getJSON("categories.json", function(data) {
         for(var i = 0; i < data.length;i++){
             if(data[i].parents.length === 0){
                 temp = "<li><a class='catLi' href='javascript:void(0)' id='" + data[i].alias + "' onclick='switchCat(" + '"' +data[i].alias+'")'+"'>" + data[i].title + "</a></li>";
                 $('#catDrop').append($.parseHTML(temp));
             }
         }
     });
}

function generateResult(id, businessName, imgURL, description) {
    if (imgURL === undefined) {
        imgURL = 'https://placeholdit.imgix.net/~text?txtsize=20&txt=215%C3%97215&w=215&h=215';
    }
    //generates the html content for the results
    var output = '<div class="col-xs-12 col-sm-6 col-md-6 col-lg-3" id="bus-' + id + '"><div class="panel panel-danger"><div class="panel-title">';
    output += businessName + '</div><div class="panel-body"><img src="';
    output += imgURL + '"><p>';
    output += description + '</p><button class="btn btn-danger result" id="res-' + id + '"  onclick="addSelected('+id+')">Select</button></div></div></div>';

    return output;
}

function generateContent(iteration){
    var html = "";
    var resPer = 12;
    var lowerBound = iteration * resPer;
    var upperBound = lowerBound + resPer;

    if (upperBound >= yelpResults.length){
        upperBound = yelpResults.length;
    }
    for(var i = lowerBound; i < upperBound; i++){
        html += generateResult(i, yelpResults[i].name, yelpResults[i].imgUrl, yelpResults[i].comment);
    }
    
    if(iteration == 0){
        $('#resultContent').html($.parseHTML(html));
    } else {
        $('#resultContent').append($.parseHTML(html));
    }
}

/*var long, lat;
function validatePostCode(postcode) {
    var url = "http://api.postcodes.io/postcodes?q=" + postcode;
    var result = false;
    var data = $.ajax(url)
        .done(function (json) {
            if(json.status == 200){
                long = json.result[0].longitude;
                lat = json.result[0].latitude;
                $('#location').parent().removeClass("has-error")
            }
            else {
                $('#location').tooltip({'trigger':'focus', 'title': "Could not retrieve postcode information. PLease check the postcode and try again."});
                $('#location').parent().addClass("has-error")
            };

        });

}*/

function addSelected (id) {
    //var id = ((this.id).split("-"))[1]; //id of item in full array
    if(object1 === null) {
        object1 = yelpResults[id];
        object1.id = id;
        $('#selected1').text(yelpResults[id].name);
        $('#remove1').removeClass("hide");
        $('#bus-'+(id)).addClass("hide");
    } else if (object2 === null) {
        object2 = yelpResults[id];
        object2.id = id;
        $('#selected2').text(yelpResults[id].name);
        $('#remove2').removeClass("hide");
        $('#bus-'+(id)).addClass("hide");
        
        $("html, body").animate({ scrollTop: 0 }, "slow");
        updateInstructions('stage', 2);
    }
};

function updateInstructions(str, stage) {
    var header = '';
    var detail = '';
    switch(stage){
        case 1: header = 'Choose Businesses';
                detail = 'Select two of the local businesses below and hit proceed to see if you will make it! You can change your selection anytime before the comparison, just use the remove button.';
            break;
        case 2: header = 'All done?';
                detail = 'What are you waiting for, click proceed!';
            break;
    }
    
    $('#instructionPanelHeader').text(header);
    $('#instructionPanelDetail').text(detail);
}

function removeSelected(object) {
    updateInstructions('stage', 1);
    if (object === 1) {
        $('#bus-'+object1.id).removeClass("hide");
        object1 = null;
        $('#selected1').text("No business is currently selected");
        $('#remove1').addClass("hide");
    } else if (object === 2) {
        $('#bus-'+ object2.id).removeClass("hide");
        object2 = null;
        $('#selected2').text("No business is currently selected");
        $('#remove2').addClass("hide");
    }
}

function removeAll() {
    if (object1 != null)
        removeSelected(1);
    if (object2 != null)
        removeSelected(2);
}

function switchCat(id){
    var temp = $('#'+id).text() + ' <span class="caret"></span>';
    $('.activeCat').removeClass('activeCat');
    $('#'+id).addClass("activeCat");
    $('#catBtn').html($.parseHTML(temp));
}

//show screen 2 now
$("#searchBtn").bind("click", function(){
    var location = $('#location').val();
    var category = $('.activeCat').attr("id");
    var json = '{"location":"' + location + '", "category":"' + category + '"}';
    updateInstructions('stage', 1);
    console.log(json); //TODO: Remove when finished
    $.ajax({
        url: '/api/yelp',
        type:'POST',
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        data: json,
        success: function(result){
            yelpResults = JSON.parse(result);
            if(yelpResults){
                $('#home').removeClass("vertical-center");
                $('#formBtn').addClass("normal-view");
                $('#logo').addClass("sm-logo");
                generateContent(0);
                $('#results').removeClass("hide");
            } else {
                console.log('No businesses found');
            }
        }, fail: function(result) {
            //TODO: signal to user to repeat input, preferably without the alert
            alert('omgno :( request failed)');
        }
    });
});

//moving screen 2 to 3
$('#procBtn').bind("click", function(){
    var json = "";

    if(object1 != null && object2 != null){
        $('#results').addClass("hide");
        $('#final').removeClass('hide');

        json = '[{"ID":' + object1.id + ', "lat":"' + object1.lat + '", "lon":"' + object1.lon + '"},';
        json += '{"ID":' + object2.id + ', "lat":"' + object2.lat + '", "lon":"' + object2.lon + '"}]';

        console.log(json);
        $.ajax({
            url: '/api/cdl',
            type:'POST',
            dataType: 'json',
            contentType: 'application/json; charset=UTF-8',
            data: json,
            success: function(results){
                if(results.forEach){
                    if(results[0].ID == object1.id){
                        results[0] = Object.assign(results[0], object1);
                        results[1] = Object.assign(results[1], object2);
                    } else {
                        results[0] = Object.assign(results[0], object2);
                        results[1] = Object.assign(results[1], object1);
                    }
                    results.forEach(function(business, index){
                        var card = $('#final-business-'+index);
                            $('.business-name', card).text(business.name);
                            $('.business-img', card).attr('src', business.imgUrl.replace(/ms\.jpg$/i, 'ls.jpg'));
                            $('.business-risk-rate', card).text(parseFloat(business.risk).toFixed(2) + '%');
                            $('.business-description', card).text(business.comment);
                            $('.business-star-rating', card).attr('src', business.starsUrl);
                            $('.business-address', card).html(business.address.join('<br/>'));
                            $('.business-phone', card).text(business.phone);
                            $('.business-yelp-link', card).attr('href', business.url);
                    });

                    generateRecommendation(results[0], results[1]);
                }
            }
        });
    }else{
        //Validation message disable button ?
    }
});

$('#back').bind("click", function(){
    $('#final').addClass("hide");
    $("#results").removeClass("hide")
});

function generateRecommendation(bus1, bus2){
    var bus1Riskier, line;

    if(Math.abs(bus1.risk - bus2.risk) < 5 && bus1.risk > 70) {
        line = 'Oh golly! Looks like the odds aren\'t too good. Why not try <a href="http://www.just-eat.co.uk/area/'+ bus1.address[bus1.address.length-2].split(' ').splice(1,2).join('') +'" target="_blank">take away</a> instead?';
    } else {
        bus1Riskier = (bus1.risk > bus2.risk);
        line = generateLine(
            (bus1Riskier)? bus2.name : bus1.name,
            (!bus1Riskier)? bus2.name : bus1.name
        );
    }

    $('#recommendation').html(line);

    function generateLine(name1, name2){
        return 'For your safety, we would recommend going for ' + name1 + '. But hey! ' + name2 + ' might be worth the risk ;)';
    }
};
