<?php
session_start();
header("Content-Type: application/json");

// Check Auth
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

if (!isset($_FILES['image'])) {
    echo json_encode(['error' => 'No file uploaded']);
    exit;
}

$target_dir = "../assets/";
// Ensure directory exists
if (!is_dir($target_dir)) {
    mkdir($target_dir, 0755, true);
}

$file_name = basename($_FILES["image"]["name"]);
// Clean filename to prevent issues
$file_name = preg_replace("/[^a-zA-Z0-9\.\-_]/", "", $file_name);
$target_file = $target_dir . $file_name;
$imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

// Check if image file is a actual image or fake image
$check = getimagesize($_FILES["image"]["tmp_name"]);
if($check === false) {
    echo json_encode(['error' => 'File is not an image']);
    exit;
}

// Allow certain file formats
if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
&& $imageFileType != "gif" && $imageFileType != "webp" && $imageFileType != "avif" ) {
    echo json_encode(['error' => 'Sorry, only JPG, JPEG, PNG, GIF, WEBP & AVIF files are allowed.']);
    exit;
}

if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
    // Return the public path
    echo json_encode(['success' => true, 'path' => '/assets/' . $file_name]);
} else {
    echo json_encode(['error' => 'Sorry, there was an error uploading your file.']);
}
?>
