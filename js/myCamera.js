
function openCamera(){

    var panel= document.getElementById('panel');

    var webcamElement = document.getElementById('webcam');
    var canvasElement = document.getElementById('canvas');

    webcamElement.style.display= 'block';
    canvasElement.height = canvasElement.width*.75;

    const webcam = new Webcam(webcamElement, 'user', canvasElement);

    webcam.flip();
    webcam.start();

    panel.style.display= 'block';

    document.getElementById("snap").addEventListener("click", function() {
        canvasElement.style.display= 'block';
        var picture = webcam.snap();
        webcam.stop();
        webcamElement.style.display= 'none';
    });

    document.getElementById("rollBack").addEventListener("click", function() {
        webcam.stop();
        webcamElement.style.display= 'none';
        panel.style.display= 'none';
    });
}



