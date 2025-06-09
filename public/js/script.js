/*
1) Check if browser supports geolocation 
First check whether the browser allows this navigator.geolocation

2) Set options for high accuracy,a 5-second timeout,and no caching 
5-Second timeout means the browser will wait up to 5 seconds to get the user's current location , if no location is received in 5 seconds -> calls errorCallback
No caching:Always fetch the latest location , not an old one stored in memory

3) Use watchPosition to track the user's location continuously
This function constantly watches your location and gives update whenever you move

4) Emit the latitude and longitude via a socket with 'send-location'

5) Initialize a map centered at (0,0) with zoom level 15 using leaflet
Create a map on the webpage using leaflet
Initially show the map at coordinates (0,0)
Add openStreetMap tiles so the map displays streets and buildings 

6) Create an empty object markers 
Keep track of all users on the map
This markers object stores their current location markers using their unique id

7) When Receiving the location data via the socket :
Server or another user sends you the new location data
Extract:
id
latitude and longitude 
center the map to this location

8) If the user is already shown on the map,just move their marker to the new location
If it's a new user,add marker to that spot

9) When user disconnects 
Remove their marker from the map
Also remove their entry from the markers object
*/





const socket = io();

if(navigator.geolocation){

    navigator.geolocation.watchPosition((position)=>{
        const{latitude,longitude} = position.coords;

        socket.emit('send-location',{latitude,longitude});

    },
    (error)=>{
        console.log(error);
    },

    // options object
    { 
        enableHighAccuracy:true,
        // using GPS
        timeout:5000,
        // in miliseconds
        maximumAge:0
        // no caching 
    });
}


const map = L.map('map').setView([0,0],16);


L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{

    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'

}).addTo(map);


const markers = {};


socket.on('receive-location',(data)=>{
    console.log("Received location: ", data);

    const {id,latitude,longitude} = data;

    map.setView([latitude,longitude]);


    if(markers[id])
        markers[id].setLatLng([latitude,longitude]);
    else
        markers[id] = L.marker([latitude,longitude]).addTo(map);
    
});


socket.on('user-disconnected',(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});



