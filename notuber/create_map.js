var myLat = 0;
var myLng = 0;
var me = new google.maps.LatLng(myLat, myLng);
var myOptions = {
        zoom: 16, 
        center: me,
        mapTypeId: google.maps.MapTypeId.ROADMAP
};
var map;
var marker;
var infowindow = new google.maps.InfoWindow();
var short = Infinity;

/* Function that gets called in the html, creates a new map and calls 
   helper functions. */

function init() {
        map = new google.maps.Map(document.getElementById("map_canvas"),
        myOptions);
        getMyLocation();
}

/* Gets the lat and long. */

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

/* Creates the map and has it pan to my location. */

function renderMap() {
        me = new google.maps.LatLng(myLat, myLng);
        map.panTo(me);
}

/* Calls the XMLHttpRequest and checks the ready state and passes the parsed 
   JSON */

function getData() {
        var request = new XMLHttpRequest();
        request.open("POST", "https://jordan-marsh.herokuapp.com/rides", true);
        postInfo(request);
        request.onreadystatechange = function() {
                if(request.readyState == 4 && request.status == 200) {
                        data = request.responseText;
                        loc = JSON.parse(data);
                        callPosition(loc);
                }
        } 
}

/* Checks to see if im a passenger or a driver */

function callPosition(loc) {
        if(loc.vehicles) {
                createDrivers(loc);
        }
        else if(loc.passengers) {
                createPassengers(loc);
        }    
}

/* If im a passenger iterates through the list of drivers and puts a marker
   at their locations and adds an info window for each of them and me */

function createDrivers(loc) {
        var me = new google.maps.LatLng(myLat, myLng);
        for(count = 0; count < loc.vehicles.length; count++) {
                var driLoc = new google.maps.LatLng(loc.vehicles[count].lat,
                loc.vehicles[count].lng);
                var drivers = new google.maps.Marker({
                        position: driLoc,
                        icon: 'car.png',
                        title: "Username: " + loc.vehicles[count].username + 
                            " Distance: "
                               + computeDistance(me, driLoc).toFixed(3)
                               + " miles"
                });
                drivers.setMap(map);
                createInfo(drivers);
        }
        marker = new google.maps.Marker({
                position: me,
                icon: {
                    url: 'passenger.png', 
                    scaledSize: new google.maps.Size(50,50)
                },
                title: "Username: bomkcQM8oI Closest Car: " +
                short.toFixed(3) + " miles"            
        });
        marker.setMap(map);
                
        createInfo(marker);
}

/* If im a driver iterates through the list of passengers and puts a marker
   at their locations and adds an info window for each of them and me */

function createPassengers(loc) {
        var me = new google.maps.LatLng(myLat, myLng);
        for(count = 0; count < loc.passengers.length; count++) {
                var pasLoc = new google.maps.LatLng(loc.passengers[count].lat,
                loc.passengers[count].lng);

                var passenger = new google.maps.Marker({
                        position: pasLoc,
                        icon: {
                                url: 'passenger.png',
                                scaledSize: new google.maps.Size(50, 50)

                        },
                        title: "Username: " + loc.passengers[count].username + 
                               " Distance: "
                               + computeDistance(me, pasLoc).toFixed(3)
                               + " miles"
                });
                passenger.setMap(map);
                createInfo(passenger);
        }
        marker = new google.maps.Marker({
                position: me,
                icon: 'car.png',
                title: "Username: bomkcQM8oI Closest Passenger: " +
                short.toFixed(3) + " miles"
        });
        marker.setMap(map);
                
        createInfo(marker);
}

/* Creates info window for the passed in object */

function createInfo(info) {
    google.maps.event.addListener(info, 'click', function() {
            infowindow.setContent(info.title);
            infowindow.open(map, info);
    });
}

/* Computes the distance between two latlngs objects */

function computeDistance(me, pasLoc) {
        var distance = 
        google.maps.geometry.spherical.computeDistanceBetween(pasLoc, me);
        distance = distance * 0.000621371;
        if(distance < short) {
            short = distance;
        }
        return distance;

}

/* Posts my username and position to the server */

function postInfo(request) {
        request.setRequestHeader("Content-type",
        "application/x-www-form-urlencoded");
        request.send("username=" + "bomkcQM8oI" + "&lat=" + myLat
        + "&lng=" + myLng);
} 

