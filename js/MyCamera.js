var width = window.innerWidth;  // We will scale the photo width to this
var height = 0;     // This will be computed based on the input stream
var streaming = false; // "streaming" indicates whether or not we're currently streaming video from the camera.

var video = null;
var canvas = null;
var snapButton = null;
var panel = null;
var switchCamera = null;
var confirm = null;
var container3 = null;
var count = 0;
var lat;
var lng;
var title;
var img;
var change = 0;
var constraints = {
    audio: false,
    video: {"facingMode": 'environment'}
}

function openCamera() {
    title = getActivePopupInfo();

    var url = "https://en.wikipedia.org/w/api.php";
    var params = {
        action: "query",
        prop: "coordinates",
        titles: title,
        format: "json"
    };
    url = url + "?origin=*";
    Object.keys(params).forEach(function (key) {
        url += "&" + key + "=" + params[key];
    });
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            var pages = response.query.pages;
            for (var page in pages) {
                lat = pages[page].coordinates[0].lat;
                lng = pages[page].coordinates[0].lon;
            }
        })
        .catch(function (error) {
            console.log(error);
        });


    canvas = document.getElementById('canvas');
    canvas.style.display = 'none';

    container3 = document.getElementById('container3');
    container3.style.display = 'none';

    confirm = document.getElementById('confirm');
    confirm.style.display = 'none';

    snapButton = document.getElementById('snapButton');
    snapButton.style.display = 'block';

    switchCamera = document.getElementById('switchCamera');
    switchCamera.style.display = 'block';

    panel = document.getElementById('panel');
    panel.style.display = 'block';

    // The width and height of the captured photo. We will set the
    // width to the value defined here, but the height will be
    // calculated based on the aspect ratio of the input stream.

    video = document.getElementById('video');
    video.style.display = 'block';
    height = video.videoHeight / (video.videoWidth / width);
    video.setAttribute('width', width);
    video.setAttribute('height', height);

    document.getElementById('titleCamera').innerHTML = title;

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
            video.srcObject = stream;
            video.play();
        })
        .catch(function (err) {
            console.log("An error occurred: " + err);
        });

    /*
      Il callback di errore viene chiamato se l'apertura del flusso non funziona.
      Ciò accadrà ad esempio se non è collegata alcuna fotocamera compatibile o se l'utente ha negato l'accesso. (Codice sopra)
    */

    /*
      C'è un periodo di tempo che trascorre prima che il flusso del video inizi a scorrere.
      Per evitare il blocco fino a quando ciò non accade, aggiungiamo un listener di eventi video per l'evento canplay,
      che viene attuato quando inizia effettivamente la riproduzione del video.
      A quel punto, tutte le proprietà video nell'oggetto sono state configurate in base al formato del flusso. (Codice sotto)
    */

    video.addEventListener('canplay', function (ev) {
        if (!streaming) {
            height = video.videoHeight / (video.videoWidth / width);

            /*
              Impostiamo l'altezza del video in base alla differenza di dimensione tra la dimensione
              effettiva del video, video.videoWidth, e la larghezza alla quale lo renderemo, width.
            */

            // Firefox currently has change bug where the height can't be read from
            // the video, so we will make assumptions if this happens. (Codice sotto)

            if (isNaN(height)) {
                height = width / (4 / 3);
            }

            video.setAttribute('width', width);
            video.setAttribute('height', height);
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            streaming = true;
        }
    }, false);

    snapButton.addEventListener('click', function (ev) {
        if (count === 0) {
            takepicture();
            count++;
        }
        ev.preventDefault();
    }, false);

    clearphoto();
}

function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

// Capture change photo by fetching the current contents of the video
// and drawing it into change canvas, then converting that to change PNG
// format data URL. By drawing it on an offscreen canvas and then
// drawing that to the screen, we can change its size and/or apply
// other changes before drawing it.

}

function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
        video.style.display = 'none';
        canvas.style.display = 'block';
        img = canvas.toDataURL('image/jpeg', 1);

        openEditor(canvas, container3, snapButton, switchCamera, confirm);
        video.srcObject.getTracks().forEach(function (track) {
            track.stop();
        });
    } else {
        clearphoto();
    }
}


function closeCamera() {
    var panel = document.getElementById('panel');
    var canvas = document.getElementById('canvas');
    var video = document.getElementById('video');
    if (video.style.display === 'block') {
        video.srcObject.getTracks().forEach(function (track) {
            track.stop();
        });
        canvas.style.display = 'none';
        video.style.display = 'none';
        panel.style.display = 'none';
    } else {
        count = 0;
        var rollBack = document.getElementById('rollBack');
        rollBack.style.backgroundImage = "url('Immagini/back.png')";
        openCamera();
    }
}

function getParams() {
    img = canvas.toDataURL('image/jpeg', 1);
    return {"lat": lat, "lng": lng, "title": title, "img": img};
}

function flipCamera() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        if (change == 1) {
            constraints = {
                audio: false,
                video: {"facingMode": 'environment'}
            }
            change = 0;
        } else {
            constraints = {
                audio: false,
                video: {"facingMode": 'user'}
            }
            change = 1;
        }
        video.srcObject.getTracks().forEach(function (track) {
            track.stop();
        });
        navigator.mediaDevices.getUserMedia(constraints)
            .then(function (stream) {
                video.srcObject = stream;
                video.play();
            })
            .catch(function (err) {
                console.log("An error occurred: " + err);
            });
    } else {
        alert("Switching camera  is not allowed if not mobile");
    }
}