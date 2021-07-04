$(document).ready(function() {
	console.log("DOM LOADED");

	// carico dinamicamente il javascript per l'editing delle foto

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        // Codice da eseguire nel caso di un dispositivo mobile
        console.log("mobile")
        loadjsfile("js/drawingMobile.js", "js");
    } else {
        // Codice da eseguire nel caso di un dispositivo tradizionale
        console.log("desktop")
        loadjsfile("js/drawingDesktop.js", "js");
    }

    jQuery("#mapid").createMap({serverURL : "server/actions.php"});
    //jQuery(this).getGallery({serverURL : "server/actions.php"});
});

function loadjsfile(filename, filetype){
    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script')
        fileref.setAttribute("type","text/javascript")
        fileref.setAttribute("src", filename)
    }
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}