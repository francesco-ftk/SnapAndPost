(function($){

    $.fn.getMarkers  = function(){
        coordinates();
    }

    function coordinates(){
        var request_type = "coordinates";
        var request = $.ajax({
            url: "../php/actions.php",
            type: "POST",
            data: {"action" : request_type},
            //success: create_popup(data),
            dataType: "json",
        });

        request.done(function(data) {
            create_popup(data);
        });
    }

    function create_popup(data) {
        var coordinates = data["coordinates"];
        if (coordinates.length > 0) {
            /*var markers = L.markerClusterGroup();
            $(coordinates).each(function (index, object) {
                markers.addLayer(L.marker([object['lat'], object['lon']]));
            });
            mymap.addLayer(markers);
            */
            console.log('funziona');
        }
    }

    function confirm() {
        var request_type = "save";
        var request = $.ajax({
            url: "php/actions.php",
            type: "POST",
            data: {"action": request_type},
        });
    }


})(jQuery);

