<?php

// if it's form request
if (isset($_POST["submit"])) {
    $target_dir = "uploads/";
    $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
    $types = array('video/mp4');

    $fileType = $_FILES["fileToUpload"]["type"];


    if (in_array($fileType, $types)) {

        if (move_uploaded_file($_FILES['fileToUpload']['tmp_name'], $target_file)) {
                // echo "Le fichier est valide, et a été téléchargé avec succès.";

            echo json_encode(array('status' => 'success', 'msg' => 'video upladed', 'src' => $target_file));
        } 

    } else {
        echo json_encode(array('status' => 'error', 'msg' => 'not a mp4 file'));        
    }

} else {
    $times = json_decode($_POST['data']);

    $tmpJson = [];

    // first parse for sort by key
    foreach ($times as $one) {
        $tmpJson[$one->start] = $one->end;
    }

    ksort($tmpJson);

    // second sort for parse in json
    $newJson = [];
    $compt = 1;
    foreach ($tmpJson as $key => $value) {
        $newJson[$compt] = array('start' => $key, 'end' => $value);
        $compt++;
    }

    $fp = fopen('results.json', 'w');
    fwrite($fp, json_encode($newJson));
    fclose($fp);
 
    echo 'results.json';        

}