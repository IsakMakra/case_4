<?php
    require_once "index.php";

    //POST - Next question
        //next: 1,
        //server_code: xxxx,
        //host: x
    $required_keys_POST = ["next", "server_code", "host"];
    if($request_method == "POST")
    {
        //Checks if the POST-request has the correct body
        if(count(array_intersect($required_keys_POST, array_keys($request_data))) == count($required_keys_POST)) 
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
                    $message = ["message" => "Success."];
                    send_JSON($message);
                }
            }

            $message = ["message" => "Error, wrong host username or server code."];
            send_JSON($message, 404);

        }
        else
        {
            $message = ["message" => "Error in POST-request."];
            send_JSON($message, 422);
        }
    }

    //PATCH - Choose winner
        //winner: x,
        //server_code: xxxx
        //host: x
    $required_keys_PATCH = ["winner", "server_code", "host"];
    if($request_method == "PATCH") 
    {
        //Checks if the POST-request has the correct body
        if(count(array_intersect($required_keys_PATCH, array_keys($request_data))) == count($required_keys_PATCH)) 
        {
            $winner = $request_data["winner"];
            $server_code = $request_data["server_code"];
            $host = $request_data["host"];

            foreach($games as $index => $game)
            {
                if($host == $game["host"] && $server_code == $game["server_code"])
                {
                    $games[$index]["users"][$winner]["points"] += 2;

                    foreach ($game['users'] as $index2 => $user) 
                    {
                        foreach ($game['current_votes'] as $index3 => $vote) 
                        {
                            if ($user['username'] == $vote['user'] && $vote['vote'] == $winner) 
                            {
                                $games[$index]["users"][$index2]["points"] += 1;
                            }
                        }
                    }

                    //Updates the games.json file with next question index. 
                    $json = json_encode($games, JSON_PRETTY_PRINT);
                    file_put_contents($games_file, $json);
                    $message = ["message" => "Success."];
                    send_JSON($message);
                }
            }

            $message = ["message" => "Error, wrong host username or server code."];
            send_JSON($message, 404);

        }
        else
        {
            $message = ["message" => "Error in PATCH-request."];
            send_JSON($message, 422);
        }
    }

    //GET - Get game object
        //?server_code=xxxx&host=x
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

            $message = ["message" => "Error, wrong host username or server code."];
            send_JSON($message, 404);
        }
        else
        {
            $message = ["message" => "Error in GET-request."];
            send_JSON($message, 422);
        }
    }
?>