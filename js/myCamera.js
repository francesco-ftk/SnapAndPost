
function openCamera(){

    var panel= document.getElementById('panel');

    var webcamElement = document.getElementById('webcam');
    var canvasElement = document.getElementById('canvas');
    var panelControls = document.getElementById('ciao');
    var panelPhoto = document.getElementById('panelPhoto');

    //panelPhoto.height = window.innerHeight-100;

    if (screen.width > screen.height) {
    webcamElement.style.display= 'block';
    webcamElement.width = 640;
    webcamElement.height = 480;
    canvasElement.width = webcamElement.width;
    canvasElement.height = webcamElement.height;
    } else {
        webcamElement.width = window.innerWidth;
        webcamElement.height = window.innerHeight*.9;
        canvasElement.width = webcamElement.width*.98;
        canvasElement.height = webcamElement.height;
    }

    var webcam = new Webcam(webcamElement, 'user', canvasElement);

    webcam.start();

    panel.style.display= 'block';

    document.getElementById("snap").addEventListener("click", function() {
        webcamElement.style.display= 'none';
        /*if (screen.width > screen.height) {
            canvasElement.width = webcamElement.width;
        } else {
            canvasElement.height = webcamElement.width*.75;
        }*/
        canvasElement.style.display= 'block';

        var picture = webcam.snap();
        webcam.stop();
    });

    document.getElementById("rollBack").addEventListener("click", function() {
        webcam.stop();
        webcamElement.style.display= 'none';
        canvasElement.style.display= 'none';
        panel.style.display= 'none';
    });

    document.getElementById("rollBack2").addEventListener("click", function() {
        webcam.flip();
    });
}



