var myLat = 0;
var myLng = 0;
var me = new google.maps.LatLng(myLat, myLng);
var myOptions = {
        zoom: 13, 
        center: me,
        mapTypeId: google.maps.MapTypeId.ROADMAP
};
var map;
var marker;
var infowindow = new google.maps.InfoWindow();

function init() {
        map = new google.maps.Map(document.getElementById("map_canvas"),
        myOptions);
        getMyLocation();
}

function getMyLocation() {
        if (navigator.geolocation) { 
                navigator.geolocation.getCurrentPosition(function(position) {
                        myLat = position.coords.latitude;
                        myLng = position.coords.longitude;
                        renderMap();
                        getData();
                });
        }
        else {
                alert("Geolocation is not supported by your web browser.");
        }
}

function renderMap() {
        me = new google.maps.LatLng(myLat, myLng);
        map.panTo(me);
        marker = new google.maps.Marker({
                position: me
        });
        marker.setMap(map);
                
        google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent(marker.title);
                infowindow.open(map, marker);
        });
}

function getData() {
        var request = new XMLHttpRequest();
        request.open("POST", "https://jordan-marsh.herokuapp.com/rides", true);
        postInfo(request);
        request.onreadystatechange = function() {
                if(request.readyState == 4 && request.status == 200) {
                        data = request.responseText;
                        loc = JSON.parse(data);
                        callPosition(loc, myLat, myLng);
                }
        } 
}

function callPosition(loc, myLat, myLng) {
        if(loc.drivers) {
                createDrivers(loc, myLat, myLng);
        }
        else if(loc.passengers) {
                createPassengers(loc, myLat, myLng);
        }    
}

function createDrivers(loc) {

}

function createPassengers(loc, myLat, myLng) {
        var image = 'passenger.png';
        var me = new google.maps.LatLng(myLat, myLng);
        for(count = 0; count < loc.passengers.length; count++) {
                var pasLoc = new google.maps.LatLng(loc.passengers[count].lat,
                loc.passengers[count].lng);
                var passenger = new google.maps.Marker({
                        position: pasLoc,
                        icon: image,
                        title: "Username: " + loc.passengers[count].username + 
                               "\n" + "Distance: "
                               + computeDistance(me, pasLoc) + " miles"
                });
                passenger.setMap(map);

               google.maps.event.addListener(passenger, 'click', function() {
                        infowindow.setContent(passenger.title);
                        infowindow.open(map, passenger);
                });
        }
}

function computeDistance(me, pasLoc) {
        var distance = 
        google.maps.geometry.spherical.computeDistanceBetween(pasLoc, me);
        distance = distance * 0.000621371;
        return distance;

}

function postInfo(request) {
        request.setRequestHeader("Content-type",
        "application/x-www-form-urlencoded");
        request.send("username=" + "bomkcQM8oI" + "&lat=" + myLat
        + "&lng=" + myLng);
} 
