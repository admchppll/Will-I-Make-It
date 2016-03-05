var allResults; //Object for storing results of query
var object1 = null, object2 = null; //Storing the 2 businesses selected

/*
$("#action-1").click(function(e){
//do something
e.preventDefault();

});*/

function loadCategories ()
{
    var temp = "";
    $.getJSON("categories.json", function(data) {
         for(var i = 0; i < data.length;i++){
             if(data[i].parents.length === 0){
                 temp = "<li><a href='javascript:void(0)' id='" + data[i].alias + "'>" + data[i].title + "</a></li>";
                 $('#catDrop').append($.parseHTML(temp));
             }
         }
     });
}

function generateResult(id, businessName, imgURL, description) {
    //generates the html content for the results
    var output = '<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3"><div class="panel panel-danger"><div class="panel-title">';
    output += businessName + '</div><div class="panel-body"><img src="';
    output += imgURL + '"><p>';
    output += description + '</p><button class="btn btn-danger result" id="res-' + id + '">Select</button></div></div></div>';
    
    return output;
}

var long, lat;
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
      
}

$('.result').bind("click", function () {
    var id = ((this.id).split("-"))[2]; //id of item in full array
    
    if(object1 === null) {
        object1 = allResults[id];        
    } else if (object2 === null) {
        object2 = allResults[id];
    }
});

