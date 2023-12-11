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
                    if($game["current_question_nr"] == 0)
                    {
                        //Selects which users are to be alternatives for each question
                        foreach($game["quiz"] as $index2 => $question) 
                        {    
                            $alternatives = [];

                            if($question == "start") 
                            {
                                continue;
                            }

                            if($question == "end")
                            {
                                continue;
                            }

                            $nr_of_alternatives = $question["nr_of_users"];
                            $users = $game["users"];
                            shuffle($users);

                            if(count($users) == 0) 
                            {
                                $message = ["message" => "Error, no users in lobby."];
                                send_JSON($message, 400);
                            }

                            for ($i = 0; $i < $nr_of_alternatives; $i++)
                            {
                                $games[$index]["quiz"][$index2]["alternatives"][] = $users[$i]["username"];
                            }
                        }
                    } 

                    //Updates the games.json file with next question index
                    //and clears current_votes
                    $games[$index]["current_question_nr"] += $next;
                    $games[$index]["current_votes"] = [];
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
                    //Adds 50 point to the users who chose corretly and 100 points to the winner
                    foreach ($game['users'] as $index2 => $user) 
                    {
                        if($user["points_gained"] > 0) {
                            $games[$index]["users"][$index2]["points_gained"] = 0;
                        }

                        if($winner == $user["username"]) 
                        {
                            $games[$index]["users"][$index2]["points"] += 100;
                            $games[$index]["users"][$index2]["points_gained"] = 100;
                        }

                        foreach($game['current_votes'] as $index3 => $vote) 
                        {
                            if ($user['username'] == $vote['user'] && $vote['vote'] == $winner) 
                            {
                                $games[$index]["users"][$index2]["points"] += 50;
                                $games[$index]["users"][$index2]["points_gained"] = 50;
                            }
                        }
                    }

                    //Updates the games.json file with the 
                    //added points for the users
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