$(document).ready(function () {

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // Codice da eseguire nel caso di un dispositivo mobile
        loadjsfile("js/drawingMobile.js", "js");
    } else {
        // Codice da eseguire nel caso di un dispositivo tradizionale
        loadjsfile("js/drawingDesktop.js", "js");
    }

    jQuery("#mapid").createMap({serverURL: "server/actions.php"});
});

function loadjsfile(filename, filetype) {
    if (filetype == "js") {
        var fileref = document.createElement('script')
        fileref.setAttribute("type", "text/javascript")
        fileref.setAttribute("src", filename)
    }
    if (typeof fileref != "undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}