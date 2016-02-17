'use strict';
var map;
//Initiate map
function initMap() {
    //Initialize the map on the view and ser default  lat , lng and zoom.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 12.890,
            lng: 78.270
        },
        zoom: 8
    });



};

//  clear link  erases news from  NYT
var item = document.getElementById('nytimes-articles');
var link = document.getElementById('clear');
 link.addEventListener('click', function(){


 item.innerHTML ="";

 });