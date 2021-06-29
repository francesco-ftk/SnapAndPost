<?php
    require_once("config.php");

    $action = $_POST['action'];

    /* conterrà la stringa di query al database */
    $query_string = "";

    /* smista secondo il tipo di richiesta */
    switch($action) {

        case "coordinates":
            getCoordinates();
        break;
        case "save" : 
            saveImage();
        break;
        case "get" :
            //echo($action);
            getImages();
        break;
    }

function getCoordinates() {
    $query_string = 'SELECT latitudine, longitudine FROM immagini GROUP BY latitudine, longitudine';

    $query=$conn->prepare($query_string);
    $query->execute();
    $result = $query->get_result();
    //header('Content-Type: text/json');

    $coordinates = array();

    // cicla sul risultato
    while ($row = $result->fetch_assoc()) {

        $lat= $row['latitudine'];
        $lon = $row['longitudine'];

        //$coordinates = array('id' => $todo_id,'text' =>$todo_text, 'completed' => $to_do_completed, 'date' => $todo_date);
        array_push($coordinates, '[' .$lat .',' .$lon .']');
    }

    foreach ($coordinates as $i){
        echo "<script> console.log('. $i .');</script>";
    }

    return $coordinates;

    /*
        $response = array('todos' => $todos, 'type' => 'load');

        // encodo l'array in JSON
        echo json_encode($response);
    */

}

    function saveImage() {

        $query_string = 'INSERT INTO immagini(latitudine, longitudine, immagine) VALUES(?,?,?)';
        $query=$conn->prepare($query_string);
        // associa ai "?" i veri parametri
        $query->bind_param("ddb",$lat,$lon,$immagine);                      // mettere double su database TODO !!!!!!!!
        $query->execute();

        /*
        $path = 'C:\\Users\\Acer\\Desktop\\[43.773, 11.255]'; // C:\\Users\\betta\\Desktop\\[43.773, 11.255]
		mkdir($path, 0777); //../manageDB/112.67
        */
}

function getImages() {
    mkdir("C:\\Users\\betta\\Desktop\\112.67", 0777); //../manageDB/112.67
}
?>