<?php
    require_once "index.php";

    // GET - Get game
    if($request_method == "GET") 
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

    //POST - Host game
    $required_keys_POST_host = ["host", "quiz"];
    if($request_method == "POST")
    {
        //Checks if the POST-request has the correct body
        if(count(array_intersect($required_keys_POST_host, array_keys($request_data))) == count($required_keys_POST_host)) 
        {
            $host = $request_data["host"];
            $quiz = $request_data["quiz"];
            
            //Creates a server_code
            $numbers = "123456789";
            $shuffled_numbers = str_shuffle($numbers);

            $server_code = substr($shuffled_numbers, 0, 4);

            //Creates an unique id for the game
            $highest_id = 0;
            foreach($games as $game) 
            {
                if($game["id"] > $highest_id)
                {
                    $highest_id = $game["id"];
                }
            }

            $next_id = $highest_id + 1;
    
            $game = [
                "host" => $host,
                "id" => $next_id,
                "server_code" => $server_code,
                "quiz" => $quiz,
                "current_question_nr" => 0,
                "current_votes" => [],
                "players" => []
            ];

            //Updates the games.json file with the new game. 
            $games[] = $game;
            $json = json_encode( $games, JSON_PRETTY_PRINT);
            file_put_contents( $games_file, $json);
            send_JSON( $game);
        }
    }
?>