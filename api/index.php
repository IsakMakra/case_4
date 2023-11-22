<?php
    require_once "functions.php";
    
    $request_method = $_SERVER["REQUEST_METHOD"];

    //CORS error
    if($request_method == "OPTIONS") 
    {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: *");
        header("Access-Control-Allow-Methods: *");
        exit();
    }
    else 
    {
        header("Access-Control-Allow-Origin: *");
    }

    $allowed_methods = ["GET","POST", "PATCH", "DELETE"];
    $games_file = "games.json";
    $quiz_file = "quizes.json";

    //Checks if the HTTP method is allowed
    if(!in_array($request_method, $allowed_methods)) 
    {
        $message = ["message" => "Error, invalid HTTP method."];
        send_JSON($message, 405);
    }

    //Creates an array for all current games in the games.json file
    $games = [];

    if(file_exists($games_file)) 
    {
        $json = file_get_contents($games_file);
        $games = json_decode($json, true);
    }

    //Creates an array for all current quizes in the quiz.json file
    $quizes = [];

    if(file_exists($quiz_file)) 
    {
        $json = file_get_contents($quiz_file);
        $quizes = json_decode($json, true);
    }

    //Allowed Content-Type
    if( isset( $_SERVER["CONTENT-TYPE"])) 
    {
        if(!$_SERVER = "application/json") 
        {
            $message = ["message" => "Error, invalid content type."];
            send_JSON($message, 415);          
        }
    }

    //Gets the information from the POST- and the PATCH-requests
    $request_JSON = file_get_contents("php://input");
    $request_data = json_decode($request_JSON, true);
?>