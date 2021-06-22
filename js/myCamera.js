
function openCamera(){

    var panel= document.getElementById('panel');

    var webcamElement = document.getElementById('webcam');
    var canvasElement = document.getElementById('canvas');

    webcamElement.style.display= 'block';
    //canvasElement.height = canvasElement.width*.75;
    webcamElement.height = screen.height;
    webcamElement.width = screen.width;

    const webcam = new Webcam(webcamElement, 'user', canvasElement);

    //webcam.flip();
    webcam.start();

    panel.style.display= 'block';

    document.getElementById("snap").addEventListener("click", function() {
        webcamElement.style.display= 'none';
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



