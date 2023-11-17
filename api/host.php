<?php
    require_once "index.php";

    //POST - Next question
    $required_keys_POST_host = ["next", "server_code", "host"];
    if($request_method == "POST")
    {
        //Checks if the POST-request has the correct body
        if(count(array_intersect($required_keys_POST_host, array_keys($request_data))) == count($required_keys_POST_host)) 
        {
            $next = $request_data["next"];
            $host = $request_data["host"];
            $server_code = $request_data["server_code"];

            foreach($games as $index => $game)
            {
                if($host == $game["host"] && $server_code == $game["server_code"])
                {
                    $games[$index]["current_question_nr"] += $next;

                    //Updates the games.json file with next question index. 
                    $json = json_encode($games, JSON_PRETTY_PRINT);
                    file_put_contents($games_file, $json);
                }
            }


        }
            
    }

    //GET - Get game object
    if($request_method == "GET") 
    {   
        //Checks if GET-request has the correct parameter
        if(isset($_GET["server_code"]) && isset($_GET["host"])) 
        {
            $server_code = $_GET["server_code"];
            $host = $_GET["host"];

            foreach($games as $index => $game)
            {
                if($host == $game["host"] && $server_code == $game["server_code"])
                {
                    send_JSON($game);
                }
            }
        }
    }
?>