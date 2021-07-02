<?php

header('Content-Type: text/json');
require_once("config.php");

$action = $_POST['action'];

/* conterrà la stringa di query al database */
$query_string = "";

/* smista secondo il tipo di richiesta */
switch($action) {
    
    case "load" : 
        getCoordinates();
    break;

    case "save" :
        saveImage();
    break;
    /*
    case "get" :
        //echo($action);
        getImages();
    break;
    */
}

function getCoordinates() {
    $query_string = 'SELECT latitudine, longitudine, nome FROM immagini GROUP BY latitudine, longitudine, nome';
    $mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE); 

    // esegui la query
    $result = $mysqli->query($query_string); 

    $coordinates = array();

    // cicla sul risultato
    while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
    
        $lat = $row['latitudine'];
        $lon = $row['longitudine'];
        $nome = $row['nome'];

        $coordinate = array('lat' =>$lat, 'lon' =>$lon, 'nome' =>$nome);
        array_push($coordinates, $coordinate);
    }

    $response = array('coordinates' => $coordinates, 'type' => 'load');

    // encodo l'array in JSON
    echo json_encode($response);	

}

function saveImage() {

    $lat = $_POST['lat'];
    $lng = $_POST['lng'];
    $img = $_POST['img'];
    $title = $_POST['title'];


    $img = str_replace('data:image/png;base64,', '', $img);
    $img = str_replace(' ', '+', $img);

    // create an image file
    $fp = fopen("../Immagini/tmp.png", "w+");
    // write the data in image file
    fwrite($fp, base64_decode($img));
    // close an open file pointer
    fclose($fp);

    $query_string = 'INSERT INTO immagini (latitudine, longitudine, immagine, nome) VALUES(?,?,?,?)';
    $mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
    $query = $mysqli->prepare($query_string);
    $null = NULL;
    $query->bind_param("ddbs", $lat, $lng, $null, $title);
    $query->send_long_data(2, file_get_contents('../Immagini/tmp.png'));
    $query->execute();
/*
    $id = $mysqli->insert_id;

    $query = $mysqli->prepare('SELECT * FROM immagini WHERE id=?');
    $query->bind_param("i", $id);
    $query->execute();
    $result = $query->get_result();
    $row = $result->fetch_assoc();
    $line = array('lat' =>$row['latitudine'], 'lon' =>$row['longitudine'], 'nome' =>$row['nome'], 'img'=> $row['immagine']);
    $lines = array();
    array_push($lines, $line);
    $response = array('lines' => $lines, 'type' => 'save');
    echo json_encode($response);
*/
}

/*
function getImages() {
    echo "<script>console.log('ciao');</script>";
}
*/

?>



