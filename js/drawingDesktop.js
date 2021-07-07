var canvas = null;
var context = null;
var coloreSelezionato = "black";
var larghezzaLinea = 3;
var puntoInizioDisegnoX;
var puntoInizioDisegnoY;
var posizioneCorrenteMouseX;
var posizioneCorrenteMouseY;
var mouseIsDown = false;

function openEditor(canvas, container3, snapButton, switchCamera, confirm1) {
    snapButton.style.display = 'none';
    switchCamera.style.display = 'none';
    container3.style.display = 'flex';
    confirm1.style.display = 'block';
    var rollBack = document.getElementById('rollBack');
    rollBack.style.backgroundImage = "url('Immagini/delete.png')";

    context = canvas.getContext('2d');

    [].forEach.call(
        document.querySelectorAll('.bottone'),
        function (el) {
            el.addEventListener('click', function () {
                var id = this.id;
                var colore = id.match(/[A-Z][a-z]+/g);
                selezionaColore({colore: colore[0].toLowerCase()})
            });
        }
    );

    canvas.addEventListener('mousemove', function (e) {
        calcolaCordinate(e);
    });

    canvas.addEventListener('mousedown', function (e) {
        calcolaCordinate(e);
    });

    canvas.addEventListener('mouseup', function (e) {
        calcolaCordinate(e);
    });

    canvas.addEventListener('mouseout', function (e) {
        calcolaCordinate(e);
    });

}

function selezionaColore(obj) {
    coloreSelezionato = obj.colore;
}

function cancella() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    var image = new Image();
    image.onload = function () {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    image.src = img;
}

function calcolaCordinate(e) {

    switch (e.type) {
        case 'mousemove' :
            if (mouseIsDown) {
                posizioneCorrenteMouseX = e.clientX - canvas.offsetLeft;
                posizioneCorrenteMouseY = e.clientY - canvas.offsetTop;
                disegna();
                puntoInizioDisegnoX = posizioneCorrenteMouseX;
                puntoInizioDisegnoY = posizioneCorrenteMouseY;
            }
            break;
        case 'mousedown' :
            mouseIsDown = true;
            puntoInizioDisegnoX = e.clientX - canvas.offsetLeft;
            puntoInizioDisegnoY = e.clientY - canvas.offsetTop;
            break;
        case 'mouseup' :
            mouseIsDown = false;
            break;
        case 'mouseout' :
            mouseIsDown = false;
            break;
    }
    e.preventDefault();
}

function disegna() {
    context.beginPath();
    context.moveTo(puntoInizioDisegnoX, puntoInizioDisegnoY);
    context.lineTo(posizioneCorrenteMouseX, posizioneCorrenteMouseY);
    context.strokeStyle = coloreSelezionato;
    context.lineWidth = larghezzaLinea;
    context.stroke();
    context.closePath();
}
