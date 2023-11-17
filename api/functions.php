<?php
    function send_JSON($data, $status_code = 200) 
    {
        header("Content-Type: application/json");
        http_response_code($status_code);
        $json = json_encode($data);
        echo $json;
        exit();
    }

    function create_server_code($games) 
    {
        //Creates a server code
        $numbers = "123456789";
        $shuffled_numbers = str_shuffle($numbers);
        $server_code = substr($shuffled_numbers, 0, 4);

        //Checks if the password is already taken
        foreach($games as $index => $game) 
        {
            $server_codes[] = $game["server_code"];
            if($game["server_code"] == $server_code) 
            {
                create_server_code($games);
            }
        }

        return $server_code;
    }
?>