$(document).ready(function() {
	console.log("DOM LOADED");
     jQuery("#mapid").createMap({serverURL : "server/actions.php"});
     //jQuery(this).getGallery({serverURL : "server/actions.php"});
});