
function openCamera(){

    var panel= document.getElementById('panel');

    var webcamElement = document.getElementById('webcam');
    var canvasElement = document.getElementById('canvas');
    var panelPhoto = document.getElementById('panelPhoto');

    //panelPhoto.height = window.innerHeight-100;

    webcamElement.style.display= 'block';

    //if (screen.width < screen.height)
    webcamElement.width = screen.width;  // vario altezza e larghezza del canvas con javascript
    //webcamElement.height = screen.width*.75;
    canvasElement.width = webcamElement.width;  // vario altezza e larghezza del canvas con javascript

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
        canvasElement.style.display= 'none';
        panel.style.display= 'none';
    });
}



