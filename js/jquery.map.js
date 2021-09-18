var mymap = null;
var myPos = null;
var myCircle = null;
var radius = 200;
var refresh_id = null;
var myIcon = L.icon({
    iconUrl: 'Immagini/marker.png',
    iconSize: [50, 50],
    iconAnchor: [26, 45]
});
var markers = null;
var startRefresh = false;
var newCoords = null;
var popen = false;
var interval = 4000;

(function ($) {

    $.fn.createMap = function (options) {

        var defaults = {
            serverURL: "server/actions.php",
        }

        options = $.extend(defaults, options);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(setMap);
            setTimeout(function () {
                startRefresh = true;
                refresh_id = setInterval(function () {
                    navigator.geolocation.getCurrentPosition(refresh);
                }, interval);

                mymap.on('popupopen', function (ev) {
                    popen = true;
                    clearInterval(refresh_id);
                });
                mymap.on('popupclose', function (ev) {
                    popen = false;
                    refresh_id = setInterval(function () {
                        navigator.geolocation.getCurrentPosition(refresh);
                    }, interval);
                });

            }, 2000);
            var $confirmButton = $('#confirm');
            $confirmButton.on('click', function (event) {
                sendImage();
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }

        function setMap(position) {
            mymap = L.map('mapid', {zoomControl: true}).setView([position.coords.latitude, position.coords.longitude], 16);

            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                attribution: 'Map data &copy; <change href="https://www.openstreetmap.org/copyright">OpenStreetMap</change> contributors, Imagery Â© <change href="https://www.mapbox.com/">Mapbox</change>',
                maxZoom: 18,
                minZoom: 4,
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1,
                accessToken: 'pk.eyJ1IjoiYmFuem8iLCJhIjoiY2twODZkZXFjMDV5ODJ5b2dtc3lyYm5qMyJ9.c-pRfXAUsbjdQJ7FpUjZuQ'
            }).addTo(mymap);

            myPos = L.marker([position.coords.latitude, position.coords.longitude], {icon: myIcon}, alt="You are here").addTo(mymap);

            myCircle = L.circle([position.coords.latitude, position.coords.longitude], {
                color: 'red',
                fillColor: '#de3737',
                fillOpacity: 0.5,
                radius: radius
            }).addTo(mymap);

            var url = "https://en.wikipedia.org/w/api.php";
            var params = {
                action: "query",
                list: "geosearch",
                gscoord: position.coords.latitude + '|' + position.coords.longitude,
                gsradius: radius,
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
                        markers.addLayer(L.marker([pages[place].lat, pages[place].lon]).bindPopup("<div class='popup'>" + "<div class='buttonPopup camera' onclick='openCamera()'>" + "</div>" + "<p>" + pages[place].title + "<br>within 200m, camera allowed.</p>" +  "</div>").openPopup());
                    }
                    queryCoordinates();

                })
                .catch(function (error) {
                    console.log(error);
                });
        }

        function queryCoordinates() {
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
            var coordinates = data["coordinates"];
            var Array = markers.getLayers();
            var popups = getCameraPopups(Array);
            var markers2 = L.markerClusterGroup();
            var replace = false;

            if (coordinates.length > 0) {
                $(coordinates).each(function (index, object) {
                    replace = false;
                    for (var i = 0; i < popups.length; i++) {
                        if (object['nome'] == popups[i].title) {
                            replace = true;
                            for (var j = 0; j < Array.length; j++) {
                                var title = Array[j].getPopup().getContent();
                                title = title.split("<p>");
                                title = title[1].split("<br>");
                                if (title[0] == object['nome']) {
                                    Array.splice(j, 1);
                                    break;
                                }
                            }
                            markers2.addLayer(L.marker([object['lat'], object['lon']]).bindPopup("<div class='popup'>" + "<div class='flexContainerButtons'><div class='buttonPopup gallery' onclick='jQuery(this).getGallery({serverURL : \"server/actions.php\"});'>" + "</div>" + "<div class='buttonPopup camera' onclick='openCamera()'>" + "</div></div>" + "<p>" + object['nome'] + "<br>within 200m, camera allowed.</p>" + "</div>").openPopup())
                            break;
                        }
                    }
                    if (!replace) {
                        markers2.addLayer(L.marker([object['lat'], object['lon']]).bindPopup("<div class='popup'>" + "<div class='buttonPopup gallery' onclick='jQuery(this).getGallery({serverURL : \"server/actions.php\"});'>" + "</div>" + "<p>" + object['nome'] + "<br>outside 200m, camera not allowed.</p>" + "</div>").openPopup());
                    }
                });
                markers2.addLayers(Array);
                markers = markers2;
            }


            if (startRefresh) {
                var x = 0;
                mymap.eachLayer(function (layer) {
                    if (x != 0)
                        mymap.removeLayer(layer);
                    x = 1;
                });

                myPos = L.marker(newCoords, {icon: myIcon}, alt="You are here").addTo(mymap);

                myCircle = L.circle(newCoords, {
                    color: 'red',
                    fillColor: '#de3737',
                    fillOpacity: 0.5,
                    radius: radius
                }).addTo(mymap);
            }

            mymap.addLayer(markers);

            if (startRefresh) {
                if (!popen) {
                    refresh_id = setInterval(function () {
                        navigator.geolocation.getCurrentPosition(refresh);
                    }, interval);
                    mymap.off('popupclose');
                    mymap.on('popupclose', function (ev) {
                        popen = false;
                        refresh_id = setInterval(function () {
                            navigator.geolocation.getCurrentPosition(refresh);
                        }, interval);
                    });
                } else {
                    mymap.off('popupclose');
                    mymap.on('popupclose', function (ev) {
                        popen = false;
                        refresh_id = setInterval(function () {
                            navigator.geolocation.getCurrentPosition(refresh);
                        }, interval);
                    });
                }
            }

        }

        function sendImage() {
            var params = getParams();
            request_type = "save";

            var $cover = $('#cover');
            var $alert = $('#alert1');
            $cover.css("display", "flex");
            $alert.css("display", "block");

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
                window.location.reload();
            });

            request.fail(
                function (jqXHR, textStatus) {
                    alert("Request failed: " + textStatus);
                });
        }

        function refresh(position) {
            var latlng = myPos.getLatLng();
            newCoords = [position.coords.latitude, position.coords.longitude];
            if (getDistanceFromLatLonInKm(latlng.lat, latlng.lng, newCoords[0], newCoords[1]) > 0.01) {
                mymap.off('popupclose');
                mymap.on('popupclose', function (ev) {
                    popen = false;
                });
                clearInterval(refresh_id);
                var url = "https://en.wikipedia.org/w/api.php";
                var params = {
                    action: "query",
                    list: "geosearch",
                    gscoord: position.coords.latitude + '|' + position.coords.longitude,
                    gsradius: radius,
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
                            markers.addLayer(L.marker([pages[place].lat, pages[place].lon]).bindPopup("<div class='popup'>" + "<div class='buttonPopup camera' onclick='openCamera()'>" + "</div>" + "<p>" + pages[place].title + "<br>within 200m, camera allowed.</p>" + "</div>").openPopup());
                        }

                        queryCoordinates();

                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        }
    }

    $.fn.getGallery = function (options) {
        var defaults = {
            serverURL: "server/actions.php",
        }
        options = $.extend(defaults, options);
        queryGallery();

        function queryGallery() {
            request_type = "get";
            var title = getActivePopupInfo();

            var $cover = $('#cover');
            var $alert = $('#alert2');
            $cover.css("display", "flex");
            $alert.css("display", "block");

            var request = $.ajax({
                url: options.serverURL,
                type: "POST",
                data: {"action": request_type, "title": title},
                dataType: "json",
            });

            request.done(function (data) {
                var images = data["images"];
                for (var i = 0; i < images.length; i++) {
                    images[i].img = "data:image/jpeg;base64," + images[i].img;
                }
                $('ul').slider(images, data["title"], {
                    speed: 100,
                    transition: "fade"
                })
            });

            request.fail(
                function (jqXHR, textStatus) {
                    alert("Request failed: " + textStatus);
                });
        }
    }
})(jQuery);

function getActivePopupInfo(m = null) {
    if (m == null) {
        var Array = markers.getLayers();
        for (var i = 0; i < Array.length; i++) {
            if (Array[i].isPopupOpen()) {
                var title = Array[i].getPopup().getContent();
                title = title.split("<p>");
                title = title[1].split("<br>");
                break;
            }
        }
    } else {
        var title = m.getPopup().getContent();
        title = title.split("<p>");
        title = title[1].split("<br>");
    }
    return title[0];
}

function getCameraPopups(Array) {
    var cameraPopups = [];
    var x = null;
    var title = null;
    for (var i = 0; i < Array.length; i++) {
        x = Array[i].getLatLng();
        title = Array[i].getPopup().getContent();
        title = title.split("<p>");
        title = title[1].split("<br>");
        cameraPopups.push({"lat": x.lat, "lng": x.lng, "title": title[0]});
    }
    return cameraPopups;
}

/* DISTANCE BETWEEN COORDS */

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}