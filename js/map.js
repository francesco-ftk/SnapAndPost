if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setMap);
} else {
    x.innerHTML = "Geolocation is not supported by this browser.";
}

function setMap(position) {
    var mymap = L.map('mapid', { zoomControl:true }).setView([position.coords.latitude, position.coords.longitude], 16);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <change href="https://www.openstreetmap.org/copyright">OpenStreetMap</change> contributors, Imagery © <change href="https://www.mapbox.com/">Mapbox</change>',
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
        iconAnchor: [26,45]
    });

    var marker = L.marker([position.coords.latitude, position.coords.longitude], {icon: myIcon}).addTo(mymap);

    var circle = L.circle([position.coords.latitude, position.coords.longitude], {
        color: 'red',
        fillColor: '#de3737',
        fillOpacity: 0.5,
        radius: 100
    }).addTo(mymap);

    var markers = L.markerClusterGroup();
    markers.addLayer(L.marker([43.773, 11.258])); <!-- Cordinate da passare con pagine wikipedia -->
    markers.addLayer(L.marker([43.773, 11.257]).bindPopup("<img src='Immagini/duomo.jpg' width='250px'>").openPopup());
    mymap.addLayer(markers);


    /*L.control.zoom({position: 'bottomleft'}).addTo(mymap);*/

/*SEARCH NEARBY PAGES*/
    var url = "https://en.wikipedia.org/w/api.php";

    var params = {
        action: "query",
        list: "geosearch",
        gscoord: position.coords.latitude + '|' + position.coords.longitude,
        gsradius: "100",
        gslimit: "100",
        format: "json"
    };

    url = url + "?origin=*";
    Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});
    var markers = L.markerClusterGroup();
    fetch(url)
        .then(function(response){return response.json();})
        .then(function(response) {
            var pages = response.query.geosearch;
            for (var place in pages) {
                //console.log(pages[place].title);
                markers.addLayer(L.marker([pages[place].lat, pages[place].lon]).bindPopup(pages[place].title + ", " + pages[place].dist).openPopup());
            }
            mymap.addLayer(markers);
        })
        .catch(function(error){console.log(error);});
}


/*

var mymap = L.map('mapid');//.setView([43.773, 11.255], 16);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <change href="https://www.openstreetmap.org/copyright">OpenStreetMap</change> contributors, Imagery © <change href="https://www.mapbox.com/">Mapbox</change>',
    maxZoom: 18,
    minZoom: 4,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYmFuem8iLCJhIjoiY2twODZkZXFjMDV5ODJ5b2dtc3lyYm5qMyJ9.c-pRfXAUsbjdQJ7FpUjZuQ'
}).addTo(mymap);

mymap.locate({setView: true, watch: true});

function onLocationFound(e) {
    var radius = e.accuracy / 2;
    L.marker(e.latlng).addTo(mymap)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();
    L.circle(e.latlng, radius).addTo(mymap);
}

function onLocationError(e) {
    alert(e.message);
}

mymap.on('locationfound', onLocationFound);
mymap.on('locationerror', onLocationError);

var marker = L.marker([43.773, 11.255]).addTo(mymap); <!-- Cordinate da passare con geolocalizzazione -->

var circle = L.circle([43.773, 11.255], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 100
}).addTo(mymap);

var markers = L.markerClusterGroup();
markers.addLayer(L.marker([43.773, 11.258])); <!-- Cordinate da passare con pagine wikipedia -->
markers.addLayer(L.marker([43.773, 11.257]).bindPopup("<img src='http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg' width='200px'>").openPopup());
mymap.addLayer(markers);

*/