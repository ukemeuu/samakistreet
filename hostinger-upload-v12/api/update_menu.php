session_start();
include 'db_connect.php';

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    die(json_encode(["error" => "Unauthorized"]));
}
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id']) || !isset($data['price'])) {
    die(json_encode(["error" => "Invalid input"]));
}

try {
    $sql = "UPDATE menu_items SET price = :price, description = :desc, image_url = :img WHERE item_id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':price' => $data['price'],
        ':desc' => $data['description'],
        ':img' => $data['image_url'], // Added image update (expects full path string)
        ':id' => $data['id']
    ]);

    echo json_encode(["success" => true]);
} catch(PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
