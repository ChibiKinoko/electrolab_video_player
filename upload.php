<?php
$target_dir = "uploads/";
$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
$types = array('video/mp4');

$uploadOk = 1;
$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);

// Check if image file is a actual image or fake image
if(isset($_POST["submit"])) {
    $fileType = $_FILES["fileToUpload"]["type"];


    if (in_array($fileType, $types)) {

        if (move_uploaded_file($_FILES['fileToUpload']['tmp_name'], $target_file)) {
                // echo "Le fichier est valide, et a été téléchargé avec succès.";

            echo json_encode(array('status' => 'success', 'msg' => 'video upladed', 'src' => $target_file));
        } 

    } else {
        echo json_encode(array('status' => 'error', 'msg' => 'not a mp4 file'));        
    }

}

// function parse($file)   
// {

//     $arr = file($file, FILE_SKIP_EMPTY_LINES | FILE_IGNORE_NEW_LINES);
//     $arr = array_splice($arr, 1);

//     $newFile = [];

//     for ($i = 0; $i < count($arr); $i++) {
//         // var_dump($arr[$i % 3]);
//         if (preg_match('/^[a-zA-Z _\-.]{1,}/', $arr[$i]) == 1) {

//             $timestamp = explode('--> ', $arr[$i + 1]);
//             $start = trim(substr($timestamp[0], 0, 8));
//             $end = trim(substr($timestamp[1], 0, 8));


//             $newFile[$i + 1] = array('start' => $start, 'end' => $end);
//         } else {    
//             // echo "timestamp\n";
//         }
//     }
//     var_dump(json_encode($newFile));
//     // print_r($arr);
// }