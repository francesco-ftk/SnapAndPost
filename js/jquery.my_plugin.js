(function($){

    $.fn.createMap = function(options){

        console.log("JQUERY: " + $);

        var defaults = {
			serverURL : "example.com/server_page_url",
		}
		options = $.extend(defaults, options);
		console.log("OPTIONS: " + defaults['serverURL']);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(setMap);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }

        coordinates();

        function setMap(position) {
            console.log("setMap called")
            var mymap = L.map('mapid', { zoomControl:true }).setView([position.coords.latitude, position.coords.longitude], 16);
        
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
                iconAnchor: [26,45]
            });
        
            var marker = L.marker([position.coords.latitude, position.coords.longitude], {icon: myIcon}).addTo(mymap);
        
            var circle = L.circle([position.coords.latitude, position.coords.longitude], {
                color: 'red',
                fillColor: '#de3737',
                fillOpacity: 0.5,
                radius: 100
            }).addTo(mymap);
        
            //var markers = L.markerClusterGroup();
            /*
            markers.addLayer(L.marker([43.773, 11.258])); <!-- Cordinate da passare con pagine wikipedia -->
            markers.addLayer(L.marker([43.773, 11.257]).bindPopup("<img src='Immagini/duomo.jpg' width='250px'>").openPopup());
            mymap.addLayer(markers);
            */
        
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

        function coordinates(){
            console.log("coordinates")
            request_type = "load";
				
            var request = $.ajax({
                url: options.serverURL,
                type: "POST",
                data: {"action" : request_type},
                dataType: "json",
            });
 
            request.done(function(data) {
                handleLoad(data);
            });
 
            request.fail(
                function(jqXHR, textStatus) {
                    alert( "Request failed: " + textStatus );
            });

        }

        function handleLoad(data) {
            console.log("handleLoad");
            var todos = data["todos"];

            if (todos.length > 0) {
                $(todos).each(function(index, object) {
                    console.log("lat: " + object['text']);
                });
                

            /*
            console.log("createPopup called");
            var coordinates = data["coordinates"];
            if (coordinates.length > 0) {
                console.log("yes coordinates");
                /*
                var markers = L.markerClusterGroup();
                $(coordinates).each(function (index, object) {
                    markers.addLayer(L.marker([object['lat'], object['lon']]));
                });
                obj.addLayer(markers);
                console.log("funziona tutto");
            */
            }      

        }

        /*
          function confirm() {
        var request_type = "save";
        var request = $.ajax({
            url: "php/actions.php",
            type: "POST",
            data: {"action": request_type},
        });
        }
        */

    }

})(jQuery);


