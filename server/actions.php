<?php

header('Content-Type: text/json');
require_once("config.php");

$action = $_POST['action'];

/* conterrà la stringa di query al database */
$query_string = "";

/* smista secondo il tipo di richiesta */
switch($action) {
    
    case "load" : 
        getCoordinates();;
    break;

    /*
    case "save" : 
        saveImage();
    break;
    case "get" :
        //echo($action);
        getImages();
    break;
    */
}

function getCoordinates() {
    $query_string = 'SELECT latitudine FROM immagini'; 
    $mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE); 

    // esegui la query
    $result = $mysqli->query($query_string); 

    $todos = array();	

    // cicla sul risultato
    while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
    
        $todo_text = $row['latitudine'];

        $todo = array('text' =>$todo_text);
        array_push($todos, $todo);
    }

    $response = array('todos' => $todos, 'type' => 'load');

    // encodo l'array in JSON
    echo json_encode($response);	

}

/*

    function saveImage() {
        
        $query_string = 'INSERT INTO immagini(latitudine, longitudine, immagine) VALUES(?,?,?)';
        $query=$conn->prepare($query_string);
        // associa ai "?" i veri parametri
        $query->bind_param("ddb",$lat,$lon,$immagine);
        $query->execute();

        $path = 'C:\\Users\\Acer\\Desktop\\[43.773, 11.255]'; // C:\\Users\\betta\\Desktop\\[43.773, 11.255]
		mkdir($path, 0777); //../manageDB/112.67
        
    }

    function getImages() {
        echo "<script>console.log('ciao');</script>";
    }
*/

?>



