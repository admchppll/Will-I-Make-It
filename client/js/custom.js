var yelpResults = JSON.parse('[{"ID":1,"Name":"Adam 1", "Img":"outside.jpg"},{"ID":2,"Name":"Adam 2", "Img":"outside.jpg"},{"ID":3,"Name":"Adam 3", "Img":"outside.jpg"},{"ID":4,"Name":"Adam 4", "Img":"outside.jpg"},{"ID":5,"Name":"Adam 5", "Img":"outside.jpg"},{"ID":6,"Name":"Adam 6", "Img":"outside.jpg"},{"ID":7,"Name":"Adam 7", "Img":"outside.jpg"},{"ID":8,"Name":"Adam 8", "Img":"outside.jpg"}]'); //Object for storing results of query

var cdlResults;

var object1 = null, object2 = null; //Storing the 2 businesses selected

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
    //generates the html content for the results
    var output = '<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3" id="bus-' + id + '"><div class="panel panel-danger"><div class="panel-title">';
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
    console.log(lowerBound);
    console.log(upperBound);

    if (upperBound >= yelpResults.length){
        upperBound = yelpResults.length;
    }
    for(var i = lowerBound; i < upperBound; i++){
        html += generateResult(yelpResults[i].ID, yelpResults[i].Name, yelpResults[i].Img, "Short description goes here adam!!");
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
        object1 = yelpResults[id-1];
        $('#selected1').text(yelpResults[id-1].Name);
        $('#remove1').removeClass("hide");
        $('#bus-'+(id)).addClass("hide");
    } else if (object2 === null) {
        object2 = yelpResults[id-1];
        $('#selected2').text(yelpResults[id-1].Name);
        $('#remove2').removeClass("hide");
        $('#bus-'+(id)).addClass("hide");
    }

};

function removeSelected(object) {
    if (object === 1) {
        $('#bus-'+object1.ID).removeClass("hide");
        object1 = null;
        $('#selected1').text("No business is currently selected");
        $('#remove1').addClass("hide");
    } else if (object === 2) {
        $('#bus-'+ object2.ID).removeClass("hide");
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
    $.ajax({
        url: '/api/yelp',
        method:'post',
        dataType: 'json',
        data: json,
        success: function(result){
            yelpResults = JSON.parse(result);
            $('#home').removeClass("vertical-center");
            $('#formBtn').addClass("normal-view");
            generateContent(0);
            $('#results').removeClass("hide");
        }
    });
    //call for api results to set yelpResults

});

//moving screen 2 to 3
$('#procBtn').bind("click", function(){
    var json = "";

    if(object1 != null && object2 != null){
        $('#results').addClass("hide");
        $('#final').removeClass('hide');

        json = '[{"ID":' + object1.ID + ', "lat":"' + object1.Latitude + '", "lon":"' + object1.Longitude + '"},'
        json += '{"ID":' + object2.ID + ', "lat":"' + object2.Latitude + '", "lon":"' + object2.Longitude + '"}]';

        //call to lims page
    }else{
        //Validation message disable button ?
    }
});
