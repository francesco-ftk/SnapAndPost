$(document).ready(function() {
	console.log("DOM LOADED");
     jQuery("#mapid").createMap({serverURL : "server/actions.php"});
});