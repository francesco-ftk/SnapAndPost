
function openCamera(){

    var panel= document.getElementById('panel');

    var webcamElement = document.getElementById('webcam');
    var canvasElement = document.getElementById('canvas');
    var panelPhoto = document.getElementById('panelPhoto');

    //panelPhoto.height = window.innerHeight-100;

    webcamElement.style.display= 'block';
    //canvasElement.height = canvasElement.width*.75;

    //var controlsHeight = document.getElementById("panelControls").offsetHeight;
    webcamElement.width = window.innerWidth;  // vario altezza e larghezza del canvas con javascript
    webcamElement.height = window.innerWidth*.75;
    canvasElement.width = webcamElement.width;  // vario altezza e larghezza del canvas con javascript
    //canvasElement.height = webcamElement.height;

    /*webcamElement.height = window.innerHeight*.9;
    webcamElement.width = window.innerWidth;*/

    const webcam = new Webcam(webcamElement, 'user', canvasElement);

    //webcam.flip();
    webcam.start();

    panel.style.display= 'block';

    document.getElementById("snap").addEventListener("click", function() {
        webcamElement.style.display= 'none';
        canvasElement.height = webcamElement.height;
        canvasElement.style.display= 'block';

        var picture = webcam.snap();
        webcam.stop();
    });

    document.getElementById("rollBack").addEventListener("click", function() {
        webcam.stop();
        webcamElement.style.display= 'none';
        panel.style.display= 'none';
    });
}



