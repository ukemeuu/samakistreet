<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$servername = "localhost";
// REPLACE THESE WITH YOUR ACTUAL HOSTINGER CREDENTIALS
$username = "u414638948_info"; 
$password = "YOUR_PASSWORD_HERE"; 
$dbname = "u414638948_samaki"; // Update this if you named it differently

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die(json_encode(["error" => "Connection failed: " . $e->getMessage()]));
}
?>
