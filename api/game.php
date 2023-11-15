<?php
    require_once "index.php";

    // Get game
    if( $request_method == "GET") 
    {   
        //Checks if GET-request has the correct parameter
        if(isset($_GET["game"])) 
        {
            $possible_password = $_GET["game"];

            foreach($games as $game)
            {
                if($possible_password == $game["server_code"])
                {
                    send_JSON($game);
                }
                else
                {
                    $message = [ "message" => "Error, wrong server_code."];
                    send_JSON( $message, 422);
                }
            }
        }
        else
        {
            $message = [ "message" => "Error in GET-request."];
            send_JSON( $message, 422);
        }
    }
?>