var allResults = JSON.parse('[{"ID":1,"Name":"Adam 1"},{"ID":2,"Name":"Adam 2"},{"ID":3,"Name":"Adam 3"},{"ID":4,"Name":"Adam 4"},{"ID":5,"Name":"Adam 5"},{"ID":6,"Name":"Adam 6"},{"ID":7,"Name":"Adam 7"},{"ID":8,"Name":"Adam 8"}]'); //Object for storing results of query
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
    var id = ((this.id).split("-"))[1]; //id of item in full array
    if(object1 === null) {
        object1 = allResults[id-1];
        $('#selected1').text(allResults[id-1].Name);
        $('#remove1').removeClass("hide");
        $('#bus-'+(id)).addClass("hide");
    } else if (object2 === null) {
        object2 = allResults[id-1];
        $('#selected2').text(allResults[id-1].Name);
        $('#remove2').removeClass("hide");
        $('#bus-'+(id)).addClass("hide");
    }
    
});

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
    console.log(object1);
    console.log(object2);
}

function removeAll() {
    removeSelected(1);
    removeSelected(2);
}

function switchCat(id){
    var temp = $('#'+id).text() + ' <span class="caret"></span>';
    $('.activeCat').removeClass('activeCat');
    $('#'+id).addClass("activeCat");
    $('#catBtn').html($.parseHTML(temp));
}

