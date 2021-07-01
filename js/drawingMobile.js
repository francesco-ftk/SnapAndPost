var canvas = null;
var context = null;
var coloreSelezionato = "black";
var larghezzaLinea = 3;
var drawingTouchList = [];
var controls= null;
var startbutton= null;
var switchCamera= null;
var confirm1= null;


function openEditor() {
    startbutton = document.getElementById('startbutton');
    startbutton.style.display = 'none';
    switchCamera = document.getElementById('switchCamera');
    switchCamera.style.display = 'none';
    controls = document.getElementById('controls');
    controls.style.display = 'block';
    confirm1 = document.getElementById('confirm');
    confirm1.style.display = 'block';
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    [].forEach.call(
        document.querySelectorAll('.bottone'),
        function (el) {
            el.addEventListener('click', function () {
                var id = this.id;
                console.log(el);
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
    console.log(e);

    switch (e.type) {
        case 'touchmove':
            var touches = e.changedTouches
            console.log("mousemove");
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
//                console.log("mousedown");
//
//                console.log("mouseout");
//                posizioneCorrenteMouseX = touches[i].clientX;
//                posizioneCorrenteMouseY = touches[i].clientY;

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
                        console.log("remove")
                    }
                }
            }
            break;
//        case 'mouseout':
//            console.log("mouseout");
//            mouseIsDown = false;
//        break;
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
    var finestraConferma = confirm('Vuoi davvero cancellare?');
    if (finestraConferma) {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
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