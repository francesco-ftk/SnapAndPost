(function($){
    $.fn.confirm = function() {
        var request_type = "save";
        var request = $.ajax({
            url: "php/actions.php",
            type: "POST",
            data: {"action" : request_type},
        });
    }

    $.fn.coordinates = function(){
        var request_type = "coordinates";
        var request = $.ajax({
            url: "php/actions.php",
            type: "POST",
            data: {"action" : request_type},
        });
    }

})(jQuery);