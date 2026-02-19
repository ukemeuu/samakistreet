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
    $sql = "UPDATE menu_items SET name = :name, price = :price, description = :desc, image_url = :img WHERE item_id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':name' => $data['name'], // Added name update
        ':price' => $data['price'],
        ':desc' => $data['description'],
        ':img' => $data['image_url'],
        ':id' => $data['id']
    ]);

    echo json_encode(["success" => true]);
} catch(PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
