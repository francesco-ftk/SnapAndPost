<?php
	//header('Content-Type: text/json');
    require_once("config.php");

    $action = $_POST['action'];

    /* conterrà la stringa di query al database /
    $query_string = "";

    / smista secondo il tipo di richiesta */
    switch($action) {

        case "save" : 
            saveImage();
        break;
        case "get" :
            //echo($action);
            getImages();
        break;
    }

    function saveImage() {
        $path = 'C:\\Users\\betta\\Desktop\\[43.773, 11.255]'; // C:\\Users\\betta\\Desktop\\[43.773, 11.255]
		mkdir($path, 0777); //../manageDB/112.67
}

function getImages() {
    mkdir("C:\\Users\\betta\\Desktop\\112.67", 0777); //../manageDB/112.67
}
?>