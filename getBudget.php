<?php 

$id = $_GET['adID'];

$serverURL = "http://api.shareably.net:3030/ad/".$id."?accessToken=SHAREABLY_SECRET_TOKEN&";

$ch = curl_init($serverURL);

curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");

$result = curl_exec($ch);

// Check if any error occurred
if(!curl_errno($ch))
{
    $info = curl_getinfo($ch);
    
    if ($info['http_code'] >= 200 && $info['http_code'] <= 299)
    {
        return json_encode($data);
    }
    else
    {
        return json_encode($data);
    }
}
else 
{
    //error handling
    return json_encode($data);
} 

?>