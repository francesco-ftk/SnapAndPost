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

    case "get" :
        getImages();
    break;
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

    /*$query_string1 = 'SELECT latitudine, longitudine FROM immagini WHERE nome=? GROUP BY nome, latitudine, longitudine';
    $query = $mysqli->prepare($query_string1);
    $query->bind_param("s", $title);
    $query->execute();
    $result = $query->get_result();
    while($row = $result->fetch_assoc()) {
        if(round($row['latitudine'],2)==round($lat,2) && round($row['longitudine'],2)==round($lng,2)){
            $lat=$row['latitudine'];
            $lng=$row['longitudine'];
        }
    }*/

    $query_string = 'INSERT INTO immagini (latitudine, longitudine, immagine, nome) VALUES(?,?,?,?)';
    $mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
    $query = $mysqli->prepare($query_string);
    $null = NULL;
    $query->bind_param("ddbs", $lat, $lng, $null, $title);
    $query->send_long_data(2, file_get_contents('../Immagini/tmp.png'));
    if(!$query->execute()){
        $line = array('controllo' => 'not ok');
        $lines = array();
        array_push($lines, $line);
        $response = array('lines' => $lines, 'type' => 'save');
        echo json_encode($response);
    }
    else{
        $id = $mysqli->insert_id;

        $query = $mysqli->prepare('SELECT nome FROM immagini WHERE id=?');
        $query->bind_param("i", $id);
        $query->execute();
        $result = $query->get_result();
        $row = $result->fetch_assoc();
        $line = array('nome' =>$row['nome']);
        $lines = array();
        array_push($lines, $line);
        $response = array('lines' => $lines, 'type' => 'save');
        echo json_encode($response);
    }
}

//TODO controllare se funziona e prende immagini
function getImages() {

    $lat = $_POST['lat'];
    $lng = $_POST['lng'];
    $title = $_POST['title'];

    $query_string = 'SELECT immagine FROM immagini WHERE nome=? and latitudine=? and longitudine=?';
    $mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
    $query = $mysqli->prepare($query_string);
    $query->bind_param("sdd", $title,$lat, $lng);
    $query->execute();

    $images = array();

    $query->store_result();
    $query->bind_result($gallery);
    while($query->fetch()) {
        $img= array('img' =>base64_encode($gallery));
        array_push($images, $img);
    }

    $response = array('images' => $images, 'type' => 'get');

    // encodo l'array in JSON
    echo json_encode($response);
}

?>



