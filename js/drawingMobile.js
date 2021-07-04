var canvas = null;
var context = null;
var coloreSelezionato = "black";
var larghezzaLinea = 3;
var drawingTouchList = [];


function openEditor(canvas, controls, snapButton, switchCamera, confirm1) {
    snapButton.style.display = 'none';
    switchCamera.style.display = 'none';
    controls.style.display = 'block';
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
                if (id === 'bottoneCancella') {
                    cancella();
                } else {
                    selezionaColore({colore: colore[0].toLocaleLowerCase()});
                }
            })
        }
    );

    canvas.addEventListener('touchmove', function (e) {
        calcolaCoordinate(e);
    });

    canvas.addEventListener('touchstart', function (e) {
        calcolaCoordinate(e);
    });

    canvas.addEventListener('touchend', function (e) {
        calcolaCoordinate(e);
    });

}


function selezionaColore(obj) {
    coloreSelezionato = obj.colore;
}

function calcolaCoordinate(e) {

    switch (e.type) {
        case 'touchmove':
            var touches = e.changedTouches
            for (var i = 0; i < touches.length; i++) {
                var instance;
                for (var j = 0; j < drawingTouchList.length; j++) {
                    if (drawingTouchList[j].identifier == touches[i].identifier) {
                        instance = drawingTouchList[j];
                        instance.updateCurrentPosition(touches[i].pageX, touches[i].pageY);
                        instance.disegna();
                        instance.setPreviousPosition(touches[i].pageX, touches[i].pageY);
                    }
                }
            }

            e.preventDefault();

            break;
        case 'touchstart':
            var touches = e.changedTouches
            for (var i = 0; i < touches.length; i++) {
                var identifier = touches[i].identifier;
                var touchX = touches[i].pageX;
                var touchY = touches[i].pageY;

                var instance = new DrawingTouch(identifier, touchX, touchY);
                drawingTouchList.push(instance);
            }
            break;
        case 'touchend':
            var touches = e.changedTouches
            for (var x = 0; x < touches.length; x++) {
                for (var y = 0; y < drawingTouchList.length; y++) {
                    if (drawingTouchList[y].identifier == touches[x].identifier) {
                        drawingTouchList.splice(x, 1);
                    }
                }
            }
            break;
        default:
            console.log("no mouse event");
    }
}

function disegna(puntoInizioDisegnoX, puntoInizioDisegnoY, posizioneCorrenteMouseX, posizioneCorrenteMouseY) {
    console.log('disegna');
    context.beginPath();
    context.moveTo(puntoInizioDisegnoX, puntoInizioDisegnoY);
    context.lineTo(posizioneCorrenteMouseX, posizioneCorrenteMouseY);
    context.strokeStyle = coloreSelezionato;
    context.lineWidth = larghezzaLinea;
    context.stroke();
    context.closePath();

}

function cancella() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    var image = new Image();
    image.onload = function() {
        context.drawImage(image,0,0,canvas.width,canvas.height);
    };
    image.src = img;
}

function DrawingTouch(identifier, puntoInizioDisegnoX, puntoInizioDisegnoY) {
    this.identifier = identifier;
    this.puntoInizioDisegnoX = puntoInizioDisegnoX;
    this.puntoInizioDisegnoY = puntoInizioDisegnoY;
    this.posizioneCorrenteTouchX = puntoInizioDisegnoX;
    this.posizioneCorrenteTouchY = puntoInizioDisegnoY;
}

DrawingTouch.prototype.setPreviousPosition = function (x, y) {
    this.puntoInizioDisegnoX = x;
    this.puntoInizioDisegnoY = y;
}

DrawingTouch.prototype.updateCurrentPosition = function (x, y) {
    this.posizioneCorrenteTouchX = x;
    this.posizioneCorrenteTouchY = y;
}

DrawingTouch.prototype.disegna = function () {
    disegna(this.puntoInizioDisegnoX, this.puntoInizioDisegnoY, this.posizioneCorrenteTouchX, this.posizioneCorrenteTouchY);
}