var markers = null;
//var popups = [];
//var IDs = [];

(function ($) {

    $.fn.createMap = function (options) {

        var mymap = null;

        console.log("JQUERY: " + $);

        var defaults = {
            serverURL: "example.com/server_page_url",
        }
        options = $.extend(defaults, options);
        console.log("OPTIONS: " + defaults['serverURL']);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(setMap);
            //queryCoordinates();
            var $confirmButton = $('#confirm');
            $confirmButton.on('click', function (event) {
                sendImage();
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }

        function setMap(position) {
            console.log("setMap called")
            mymap = L.map('mapid', {zoomControl: true}).setView([position.coords.latitude, position.coords.longitude], 16);

            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                minZoom: 4,
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1,
                accessToken: 'pk.eyJ1IjoiYmFuem8iLCJhIjoiY2twODZkZXFjMDV5ODJ5b2dtc3lyYm5qMyJ9.c-pRfXAUsbjdQJ7FpUjZuQ'
            }).addTo(mymap);

            var myIcon = L.icon({
                iconUrl: 'Immagini/marker.png',
                iconSize: [50, 50],
                iconAnchor: [26, 45]
            });

            var marker = L.marker([position.coords.latitude, position.coords.longitude], {icon: myIcon}).addTo(mymap);  //

            var circle = L.circle([position.coords.latitude, position.coords.longitude], {
                color: 'red',
                fillColor: '#de3737',
                fillOpacity: 0.5,
                radius: 100
            }).addTo(mymap);

            /*SEARCH NEARBY PAGES*/
            var url = "https://en.wikipedia.org/w/api.php";

            var params = {
                action: "query",
                list: "geosearch",
                gscoord: position.coords.latitude + '|' + position.coords.longitude,
                gsradius: "10000", // 100
                gslimit: "100",
                format: "json"
            };

            url = url + "?origin=*";
            Object.keys(params).forEach(function (key) {
                url += "&" + key + "=" + params[key];
            });
            markers = L.markerClusterGroup();
            fetch(url)
                .then(function (response) {
                    return response.json();
                })
                .then(function (response) {
                    var pages = response.query.geosearch;
                    for (var place in pages) {
                        //console.log(pages[place].title);
                        markers.addLayer(L.marker([pages[place].lat, pages[place].lon]).bindPopup("<div class='popup'>" + "<div class='buttonPopup camera' onclick='openCamera()'>" + "</div>" + "<p>" + pages[place].title + "</p>" + "</div>").openPopup());  //" " + pages[place].lat + " " + pages[place].lon + +  " - " + pages[place].dist + "m" +
                        //popups.push({"lat": pages[place].lat, "lng": pages[place].lon, "title": pages[place].title});
                    }
                    //mymap.addLayer(markers);
                    queryCoordinates();

                })
                .catch(function (error) {
                    console.log(error);
                });
        }

        function queryCoordinates() {
            console.log("queryCoordinates")
            request_type = "load";


            var request = $.ajax({
                url: options.serverURL,
                type: "POST",
                data: {"action": request_type},
                dataType: "json",
                async: "false",
            });

            request.done(function (data) {
                addMonumentsMarker(data);
            });

            request.fail(
                function (jqXHR, textStatus) {
                    alert("Request failed: " + textStatus);
                });

        }

        function addMonumentsMarker(data) {
            console.log("addMonumentsMarker");
            var coordinates = data["coordinates"];
            var Array = markers.getLayers();
            var popups = getCameraPopups(Array);
            var markers2 = L.markerClusterGroup();
            var replace = false;

            if (coordinates.length > 0) {
                $(coordinates).each(function (index, object) {
                    replace = false;
                    for (var i = 0; i < popups.length; i++) {
                        if (object['lat'] == popups[i].lat && object['lon'] == popups[i].lng && object['nome'] == popups[i].title) {
                            replace = true;
                            for(var j=0; j<Array.length;j++) {
                                var title = Array[j].getPopup().getContent();
                                title = title.split("<p>");
                                title = title[1].split("</p>");
                                if(title[0] == object['nome']) {
                                    Array.splice(j, 1);
                                    break;
                                }
                            }
                            markers2.addLayer(L.marker([object['lat'], object['lon']]).bindPopup("<div class='popup'>" + "<div class='flexContainerButtons'><div class='buttonPopup gallery' onclick='jQuery(this).getGallery({serverURL : \"server/actions.php\"});'>" + "</div>" + "<div class='buttonPopup camera' onclick='openCamera()'>" + "</div></div>" + "<p>" + object['nome'] + "</p>" + "</div>").openPopup())
                            //Array[i].getPopup().setContent("<div class='popup'>" + "<div class='flexContainerButtons'><div class='buttonPopup gallery' onclick='jQuery(this).getGallery({serverURL : \"server/actions.php\"});'>" + "</div>" + "<div class='buttonPopup camera' onclick='openCamera()'>" + "</div></div>" + "<p>" + object['nome'] + "</p>" + "</div>");
                            break;
                        }
                    }
                    if (!replace) {
                        markers2.addLayer(L.marker([object['lat'], object['lon']]).bindPopup("<div class='popup'>" + "<div class='buttonPopup gallery' onclick='jQuery(this).getGallery({serverURL : \"server/actions.php\"});'>" + "</div>" + "<p>" + object['nome'] + "</p>" + "</div>").openPopup());
                    }
                });
                markers2.addLayers(Array);
                markers = markers2;
                mymap.addLayer(markers2);
                console.log("funziona tutto");
            }
        }

        function sendImage() {
            var params = getParams();
            console.log("saveImage");
            request_type = "save";
            var request = $.ajax({
                url: options.serverURL,
                type: "POST",
                data: {
                    "action": request_type,
                    "lat": params.lat,
                    "lng": params.lng,
                    "title": params.title,
                    "img": params.img
                },
                dataType: "json",
            });

            request.done(function (data) {
                //window.location.reload();
                backToHome();
            });

            request.fail(
                function (jqXHR, textStatus) {
                    alert("Request failed: " + textStatus);
                });
        }
    }

    $.fn.getGallery = function (options) {
        var defaults = {
            serverURL: "example.com/server_page_url",
        }
        options = $.extend(defaults, options);
        queryGallery();

        function queryGallery() {
            console.log('FUNZIONE ONCLICK');
            request_type = "get";
            var coords = getActivePopupInfo();
            var request = $.ajax({
                url: options.serverURL,
                type: "POST",
                data: {"action": request_type, "lat": coords.lat, "lng": coords.lng, "title": coords.title},
                dataType: "json",  // img?
            });

            request.done(function (data) {
                renderCarousel(data['lines'], data['title']);
                //console.log('prese foto');
            });

            request.fail(
                function (jqXHR, textStatus) {
                    alert("Request failed: " + textStatus);
                });
        }
    }
})(jQuery);

function getActivePopupInfo() {
    console.log('getCoords');
    var Array = markers.getLayers();
    for (var i = 0; i < Array.length; i++) {
        if (Array[i].isPopupOpen()) {
            var x = Array[i].getLatLng();
            var title = Array[i].getPopup().getContent();
            title = title.split("<p>");
            title = title[1].split("</p>");
            return {"lat": x.lat, "lng": x.lng, "title": title[0]};
        }
    }
}

function getCameraPopups(Array) {
    var cameraPopups = [];
    //var Array = markers.getLayers();
    var x = null;
    var title = null;
    for (var i = 0; i < Array.length; i++) {
        x = Array[i].getLatLng();
        title = Array[i].getPopup().getContent();
        title = title.split("<p>");
        title = title[1].split("</p>");
        cameraPopups.push({"lat": x.lat, "lng": x.lng, "title": title[0]});
    }
    return cameraPopups;
}