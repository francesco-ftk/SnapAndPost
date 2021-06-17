(function($){

    $.fn.displayCamera = function(){  // passare cordinate per popup e dimensione canvas?

        var sizeDefaults = {
            width: 640,
            height: 480
        }

        var panel= $('.panel');
        var panelPhoto= $('.panelPhoto');
        var video= $('#video');
        var canvas=$('#canvas');

        //var h = window.innerHeight-201;

        panelPhoto.css({
            height: window.innerHeight-201
        })

        // TODO: gestire dimensioni Canvas e Video in base a device

        panel.css({
            display: 'block'
        });

        openCamera();

    }

})(jQuery);

function openCamera(){
    // Grab elements, create settings, etc.
    var video = document.getElementById('video');

    // Get access to the camera!
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Not adding `{ audio: true }` since we only want video now
        navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
            //video.src = window.URL.createObjectURL(stream);
            video.srcObject = stream;
            video.play();
        });
    }

    // Elements for taking the snapshot
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var video = document.getElementById('video');

    // Trigger photo take
    document.getElementById("snap").addEventListener("click", function() {
        context.drawImage(video, 0, 0, 640, 480);
    });
}
