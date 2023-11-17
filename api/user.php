<?php
    require_once "index.php";

    //POST - Vote
        //vote: "x",
        //user: "Isak",
        //server_code: "1975"
    $required_keys_POST = ["vote", "server_code", "user"];
    if($request_method == "POST")
    {
        //Checks if the POST-request has the correct body
        if(count(array_intersect($required_keys_POST, array_keys($request_data))) == count($required_keys_POST)) 
        {

            $server_code = $request_data["server_code"];
            $vote = $request_data["vote"];
            $username = $request_data["user"];

            foreach($games as $index => $game)
            {
                if($server_code == $game["server_code"])
                {
                    $data = 
                    [
                        "vote" => $vote,
                        "user" => $username
                    ];
                    $games[$index]["current_votes"][] = $data;

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

    //GET - Get quiz
        //?server_code=xxx
    if($request_method == "GET") 
    {   
        //Checks if GET-request has the correct parameter
        if(isset($_GET["server_code"])) 
        {
            $server_code = $_GET["server_code"];

            foreach($games as $index => $game)
            {
                if($server_code == $game["server_code"])
                {
                    $data = 
                    [
                        "quiz" => $game["quiz"],
                        "current_question_nr" => $game["current_question_nr"]
                    ];
                    send_JSON($data);
                }
            }

            $message = ["message" => "Error, wrong server code."];
            send_JSON($message, 404);
        }
        else
        {
            $message = ["message" => "Error in GET-request."];
            send_JSON($message, 422);
        }
    }
?>