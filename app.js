var apiKey = "AIzaSyDp3OGpnbKI_M415T5spH1rheuCzHFvJ0E";
var herokuApp = "https://cors-anywhere.herokuapp.com/";

var textSearchValue, urlGoogleNearbySearchWithPrefix, urlRequestNearbySearch,
urlGooglePlaceDetailsWithPrefix, index, urlRequestDetailSearch, weekdaysWorkingHours;




document.getElementById("SearchButton").addEventListener('click', function() {
  // get the value typed by user in the search bar
  textSearchValue = document.getElementById('searchBar').value;

  // static part of urls for the google API requests with heroku prefix
  // I use Montreal coordinates and a 50000m radius
  urlGoogleNearbySearchWithPrefix = herokuApp +
  "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=" + apiKey +
  "&location=45.5576996,-74.0104801&radius=50000&name=";

  urlRequestNearbySearch = urlGoogleNearbySearchWithPrefix + textSearchValue;
  urlGooglePlaceDetailsWithPrefix = herokuApp + "https://maps.googleapis.com/maps/api/place/details/json?key=" + apiKey + "&placeid=";
  // initialize index for the number of tabs in the accordion correspondong to number of answers
  index = 0;
  // make the first API request to find places
  fetch(urlRequestNearbySearch).then(function(response){
    return response.json();
    }).then(function(jsonData) {
      jsonData.results.slice(-5).forEach(place => { //read only the first 5 results as requested
      urlRequestDetailSearch = urlGooglePlaceDetailsWithPrefix + place.place_id;
    // make the second API request to find working hours
    fetch(urlRequestDetailSearch).then(function(response){
      return response.json();
      }).then(function(jsondataDetail){
        // format the data to be displayed
        weekdaysWorkingHours = jsondataDetail.result.opening_hours.weekday_text.join('<br />');
        // display data in the accordion
        $('.latestinfo').append(
          '<div class="panel panel-default">'+
          '<div class="panel-heading" role="tab" id="heading_'+index+'">'+
          '<h4 class="panel-title">'+
          '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse_'+index+'" aria-expanded="true" aria-controls="collapse_'+index+'">'+
          place.name+
          '</a>'+
          '</h4>'+
          '</div>'+
          '<div id="collapse_'+index+'" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="heading_'+index+'">'+
          '<div class="panel-body">'+
          weekdaysWorkingHours+
          '</div>'+
          '</div>'+
          '</div>'
          );
        index++;
        // open the accordion if there is only one result
        if (jsonData.results.length === 1){
          $(document).ready(function() {
            $('#collapse_0').collapse('show');
          });
        }
      });
  });
})
})

document.getElementById('SearchButton').addEventListener('click', function() {
  document.getElementById('accordion').innerHTML = '';
})
