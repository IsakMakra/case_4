<?php
    function send_JSON($data, $status_code = 200) 
    {
        header("Content-Type: application/json");
        http_response_code($status_code);
        $json = json_encode($data);
        echo $json;
        exit();
    }
?>