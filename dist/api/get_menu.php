<?php
include 'db_connect.php';

try {
    // 1. Fetch Categories Sorted
    $catStmt = $conn->query("SELECT * FROM categories ORDER BY sort_order ASC");
    $categories = $catStmt->fetchAll(PDO::FETCH_ASSOC);

    // 2. Fetch All Items
    $itemStmt = $conn->query("SELECT * FROM menu_items ORDER BY id ASC"); // Default item order by ID for now
    $items = $itemStmt->fetchAll(PDO::FETCH_ASSOC);

    // 3. Group Items by Category
    $itemsByCat = [];
    foreach ($items as $item) {
        $itemsByCat[$item['category']][] = [
            'id' => $item['item_id'], // Keep compatibility with frontend ID usage (s2, s3 etc)
            'db_id' => $item['id'], // Actual DB ID for updates
            'name' => $item['name'],
            'price' => (int)$item['price'],
            'desc' => $item['description'],
            'img' => $item['image_url']
        ];
    }

    // 4. Construct Final Response
    $response = [];
    foreach ($categories as $cat) {
        $slug = $cat['slug'];
        $response[] = [
            'id' => $cat['id'],
            'slug' => $slug,
            'title' => $cat['title'],
            'items' => isset($itemsByCat[$slug]) ? $itemsByCat[$slug] : []
        ];
    }

    // Capture orphaned items (categories not in categories table?) - verify migration worked
    // If migration worked, all should be covered.

    echo json_encode($response);
} catch(PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
