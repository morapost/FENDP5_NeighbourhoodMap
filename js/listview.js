'use strict';


/*

///CODE REFERENCE
Variables:
self.-----This Variable refers to the ViewModel function.
length-----This variable contains the length of the  number of places we are working with in the application.
nytHeaderElem----- This Variable refers to an observable header element in the HTML for each news item pulled from the NYT news.
nytElem-----This Variable refers to an observable ul element in the HTML for each news item pulled from the NYT news, which contains the link for all the news.
articles-----This variable containes an observable array that holds all the information of each of the news articles pulled from the NYT; these are url, headline and paragraph.
images-----This is an array which contains all the images from each of the places that appears when a marker is clicked and the infowindow opens.


Functions:
self.filter()-----This observable watches the value coming in from the input text in the html.
self.Markers([])-----This observable array is initialy empty, but it is used to store the markers later as they are being created and placed on the map.
self.places()-----This observable array contains all the data about each of the places to be placed in the map.
self.filterSearch()----- This computed observable is used later on as the varibale containing the info about each marker entry in the map.
self.timesAPI()-----This function makes an  API request to the NYTimes when a maker from the map is clicked. This function is called within thr createMarkers function.
self.filterSearch()-----//This function filters the name of places available based on  the user's input and dysplays the result on the list view.
self.generateStreetViewImages()-----This function generates images to be displayed in the  info window based on the marker's location.
self.generateInfoWindowData()-----This function genates the info that appears on the infoWindow for each marker when it is clicked.
 self.createMarkers()-----This function creates the markers  and  places them on the map.
startViewModel()-----This function starts the whole application and Iniates the View and the map.

*/



function ViewModel() {
    var self = this;
    self.filter = ko.observable();
    self.places = ko.observableArray([{
        name: "Chennai, Tamil Nadu",
        address: "Chennai, Tamil Nadu",
        lat: 13.082,
        lng: 80.270,
        show: true

    }, {
        name: "Bengaluru, karnataka",
        address: "Bengaluru, karnataka",
        lat: 12.966,
        lng: 77.566,
        show: true

    }, {
        name: "Pondicherry",
        address: "Pondicherry, India",
        lat: 11.931,
        lng: 79.785,
        show: true

    }, {
        name: "Mahabalipuram, Tamil Nadu",
        address: "Mahabalipuram, Tamil Nadu",
        lat: 12.616,
        lng: 80.199,
        show: true

    }, {
        name: "VIT University",
        address: "VIT University, vellore, Tamil Nadu",
        lat: 12.969,
        lng: 79.155,
        show: true

    }]);

    var length = self.places().length;


    self.nytHeaderElem = ko.observable(document.getElementById('nytimes-header'));
    self.nytElem = ko.observable(document.getElementById('nytimes-articles'));
    self.header = 'New York Times Article About';
    self.articles = ko.observableArray([



        {
            url: "",
            headline: "",
            p: ""
        }, {
            url: "",
            headline: "",
            p: ""
        }, {
            url: "",
            headline: "",
            p: ""
        }, {
            url: "",
            headline: "",
            p: ""
        }, {
            url: "",
            headline: "",
            p: ""
        }, {
            url: "",
            headline: "",
            p: ""
        }, {
            url: "",
            headline: "",
            p: ""
        }, {
            url: "",
            headline: "",
            p: ""
        }




    ]);
    //This functions makes an  API request to the NYTimes when a maker on from the map is clicked. This function is called within thr createMarkers function.
    var item = document.getElementById('nytimes-articles');
    self.timesAPI = function(times) {
        var nytimesURL = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + times + "&sort=newest&api-key=37f983f55e3a2e5d63ee4d3b4e71d58c:2:73773273";
        $.getJSON(nytimesURL, function(data) {
            var articles = data.response.docs;
            self.header += times;
            item.innerHTML = "";
            for (var i = 0; i < 8; i++) {
                var article = articles[i];
                self.articles()[i].url = article.web_url;
                self.articles()[i].headline = article.headline.main;
                self.articles()[i].p = article.snippet;

                var li = document.createElement('li');
                var a = document.createElement('a');
                var p = document.createElement('p');
                li.class = "article";
                a.href = self.articles()[i].url;
                a.innerHTML = self.articles()[i].headline;
                p.innerHTML = self.articles()[i].p;
                li.appendChild(a);
                li.appendChild(p);
                item.appendChild(li);


            }



        }).fail(function(e) {
            self.nytHeaderElem.text('New York Times Error')
        }); // in case error occurs displays error message;
    };

    //This function filters the name of places available based on  the user's input and dysplays the result on the list view
    self.filterSearch = ko.computed(function() {
        return this.places().filter(function(place) {
            if (!self.filter() || place.name.toLowerCase().indexOf(self.filter().toLowerCase()) !== -1)
                return place;
        });
    }, this);


    self.images = ko.observableArray([]);
    self.generateStreetViewImages = function() {


        for (var i = 0; i < length; i++) {

            var img = '<img src="https://maps.googleapis.com/maps/api/streetview?size=200x200&location=' + self.places()[i].name + '&key=AIzaSyAtABxc1zGLRvkNG3ux8u3APQ95cOlbrso">';
            self.images().push(img);
        }


    };
    self.generateStreetViewImages();




    self.info = ko.observableArray([]);
    self.generateInfoWindowData = function() {
        for (var i = 0; i < length; i++) {

            var data = '<div id="content">' + '<h1 id="firstHeading" class="firstHeading">' + self.places()[i].name + '</h1>' +
                '<p>' + self.places()[i].address + '</p>' +
                '</div>' + self.images()[i];

            self.info().push(data);

        }



    };
    self.generateInfoWindowData();

    self.Markers = ko.observableArray([]);
    //This function create the markers on the map using information from our places() data
    self.createMarkers = function() {

        var infowindow = new google.maps.InfoWindow;
        for (var i = 0; i < length; i++) {
            var marker = new google.maps.Marker({
                position: {
                    lat: self.places()[i].lat,
                    lng: self.places()[i].lng
                },
                map: map,
                visible: self.places()[i].show,
                animation: google.maps.Animation.BOUNCE,
                title: self.places()[i].name
            });
            marker.setAnimation(null);
            self.Markers().push(marker);

            //add event listener to each of the markers.  turn on and off when clicked; also makes the info window pop for each marker
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infowindow.setContent(self.info()[i]);
                    infowindow.maxWidth = 300;
                    infowindow.open(map, marker);
                    if (this.getAnimation() === null) {
                        this.setAnimation(google.maps.Animation.BOUNCE);
                        marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
                        setTimeout(function() {
                            marker.setAnimation(null);
                            infowindow.close();
                        }, 10000);
                        setTimeout(function() {
                            marker.setIcon(null);
                        }, 10000);
                    } else {
                        this.setAnimation(null);
                        marker.setIcon(null);
                    }


                    self.timesAPI(self.Markers()[i].title);

                }
            })(marker, i));


        } /*------------------------------*/


    };
    self.createMarkers();

    //This function is used to set all markers in the array visible in the filterMarkers function
    self.setAllShow = function() {
        if (self.filter().length <= 0 || self.filter() === "")
            for (var i = 0; i < self.Markers().length; i++) {
                self.Markers()[i].setVisible(true);
            }
    };



    //This function  determines which markers should be hid or shown on the map base on the user's input
    self.visibleMarkers = function() {


        var a = self.filterSearch();
        a.forEach(function(entry) {
            for (var i = 0; i < self.Markers().length; i++) {


                if (entry.name.toLowerCase().indexOf(self.Markers()[i].title.toLowerCase()) == -1) {
                    self.Markers()[i].setVisible(false);
                } else if (entry.name.toLowerCase().indexOf(self.Markers()[i].title.toLowerCase()) !== -1) {
                    self.Markers()[i].setVisible(true);
                }


            }
        });



    };




    // This function is called by the input on the event keyup to filter the Markers, it invoked two other functions based on wheather the filter value is empty or not
    self.filterMarkers = function() {
        if (length > 0 || self.filter() !== "") {
            self.visibleMarkers();
        } else {
            self.setAllShow();
        }
    };
    // This function makes the marker animate when it is selected from the listview
    self.selectMarker = function(item) {
        var infowindow = new google.maps.InfoWindow;
        self.Markers().forEach(function(entry) {

            if (entry.animation == google.maps.Animation.BOUNCE) {
                entry.setAnimation(null);


            }
            if (entry.title.toLowerCase() == item.name.toLowerCase()) {
                entry.setAnimation(google.maps.Animation.BOUNCE);


                infowindow.setContent(entry.title);
                infowindow.maxWidth = 300;
                infowindow.open(map, entry);
                setTimeout(function() {
                    entry.setAnimation(null);
                    infowindow.close();
                }, 2000); // stops animation fo markers after 2 seconds and closes infowindow



            }


        });
    };




}

function startViewModel() {
    initMap();
    ko.applyBindings(new ViewModel());

}