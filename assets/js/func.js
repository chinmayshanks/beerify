/**
* Author: chinmayshanks
* Date: 2015-05-21
* Time: 07:55 AM
*/
function Place(id,lat,lng,name) {
    this.id=id;
    this.lat=lat;
    this.lng=lng;
    this.name=name;
}

hop = L.Marker.extend({
    options: {
    id: '',  
    name: ''
    }
});

var places = [];
var hops = [];

function beerify(lat,lng){
    var fsCID='';
    var fsCS='';
    var url='https://api.foursquare.com/v2/venues/search?&ll='+lat+','+lng+'&client_id='+fsCID+'&client_secret='+fsCS+'&categoryId=4bf58dd8d48988d116941735&v=20150522';
    var accessToken = '';
    var httpReq;
    httpReq=new XMLHttpRequest();
    //Use the OSM baselayer below if you don't have a MapBox access token
    /*var map = L.map('map').setView([lat, lng], 13);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);*/
    L.mapbox.accessToken = accessToken;
    var map = L.mapbox.map('map', 'mapbox.wheatpaste')
    .setView([lat, lng], 13);
    
    if(window.XMLHttpRequest) {
        httpReq.onreadystatechange=function()
        {
            if (httpReq.readyState==4 && httpReq.status==200)
            {
                var data = JSON.parse(httpReq.responseText);
                $.each(data.response.venues, function (i, venues) {
                    //create new place object and add it to the places array
                    var place = new Place(venues.id,venues.location.lat,venues.location.lng,venues.name)
                    places.push(place);
                    $("#content").append('<p class=\'listItem\'>'+place.name+'</p>');
                    //create custom marker on map and pass id and name to it
                    var marker = new hop([place.lat, place.lng],{ clickable: true,id: place.id, name: place.name});
                    marker.addTo(map).bindPopup(place.name);
                    hops.push(marker);
                });
                
            }
        }
        
        httpReq.open("GET",url,true);
        httpReq.send();
    }
    else {
        alert("use a better browser");
    }
}

function reticulateSplines(){
    if(geoPosition.init()){  // Geolocation Initialisation
            geoPosition.getCurrentPosition(success_callback,error_callback,{enableHighAccuracy:true});
    }else{
            alert('Boo! Use a modern browser!');
    }
    geoPositionSimulator.init(); 

    // p : geolocation object
    function success_callback(p){
        beerify(p.coords.latitude,p.coords.longitude);
        //beerify(18.5203,73.8567);
    }

    function error_callback(p){
        alert(p.message);
    }
}