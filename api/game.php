<?php
    require_once "index.php";

    //POST - Host game
        //quiz: x,
        //host: x
    $required_keys_POST = ["host", "quiz"];
    if($request_method == "POST")
    {
        //Checks if the POST-request has the correct body
        if(count(array_intersect($required_keys_POST, array_keys($request_data))) == count($required_keys_POST)) 
        {
            $host = $request_data["host"];
            $quiz_name = $request_data["quiz"];

            $server_code = create_server_code($games);

            //Handles the quiz name and selects the appropriate index for the quiz.json file
            if($quiz_name == "random") 
            {$quiz_index = 0;}
            else if($quiz_name == "family")
            {$quiz_index = 1;}
            else if($quiz_name == "active")
            {$quiz_index = 2;}
            else if($quiz_name == "party")
            {$quiz_index = 3;}

            $quiz_array = $quizes[$quiz_index];
            shuffle($quiz_array);

            //Making sure there is a starting screen and ending screen in the quiz
            $quiz_array[0] = "start";
            $quiz_array[count($quiz_array)] = "end";

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
    
            $game = 
            [
                "host" => $host,
                "id" => $next_id,
                "server_code" => $server_code,
                "quiz" => $quiz_array,
                "current_question_nr" => 0,
                "current_votes" => [],
                "users" => [],
                "active" => true
            ];

            //Updates the games.json file with the new game. 
            $games[] = $game;
            $json = json_encode($games, JSON_PRETTY_PRINT);
            file_put_contents($games_file, $json);
            send_JSON($game);
        }        
        else
        {
            $message = ["message" => "Error in POST-request."];
            send_JSON($message, 422);
        }
    }

    // GET - Join a game
        //?game=xxxx&user=x
    if($request_method == "GET") 
    {   
        //Checks if GET-request has the correct parameter
        if(isset($_GET["server_code"]) && isset($_GET["user"])) 
        {
            $server_code = $_GET["server_code"];
            $username = $_GET["user"];

            foreach($games as $index1 => $game)
            {
                if($server_code == $game["server_code"])
                {
                    //Checks if the username is already taken
                    foreach($game["users"] as $index2 => $player) 
                    {
                        if($player["username"] == $username) 
                        {
                            $message = ["message" => "Error, username already taken."];
                            send_JSON($message, 406);
                        }
                    }

                    $user = 
                    [ 
                        "username" => $username, 
                        "points" => 0, 
                    ];

                    $games[$index1]["users"][] = $user;

                    //Updates the games.json file with the new user joined
                    $json = json_encode($games, JSON_PRETTY_PRINT);
                    file_put_contents($games_file, $json);

                    $data = 
                    [
                        $game["quiz"],
                        $game["current_question_nr"]
                    ];
                    
                    send_JSON($data);
                }
            }
            
            $message = ["message" => "Error, wrong server_code."];
            send_JSON($message, 422);
                
        }
        else
        {
            $message = ["message" => "Error in GET-request."];
            send_JSON($message, 422);
        }
    }


    //DELETE - Deletes a game from games.json
        //host: x
        //server_code: xxxx
    $required_keys_DELETE = ["host", "server_code"];
    if($request_method == "DELETE")
    {
        //Checks if DELETE-request has the correct parameter
        if(count(array_intersect($required_keys_DELETE, array_keys($request_data))) == count($required_keys_DELETE)) 
        {
            $host = $request_data["host"];
            $server_code = $request_data["server_code"];

            foreach($games as $index => $game)
            {
                if($host == $game["host"] && $server_code == $game["server_code"])
                {
                    unset($games[$index]);
                    $message = ["message" => "Success."];

                    //Updates the games.json file with the deleted game
                    $json = json_encode($games, JSON_PRETTY_PRINT);
                    file_put_contents($games_file, $json);
                    send_JSON($message);
                }
            }
        }
        else
        {
            $message = ["message" => "Error in DELETE-request."];
            send_JSON($message, 422);
        }
    }
?>