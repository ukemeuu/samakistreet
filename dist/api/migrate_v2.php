<?php
include 'db_connect.php';

$sql = "
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(100) NOT NULL,
    sort_order INT DEFAULT 0
);
";

try {
    $conn->exec($sql);
    echo "Categories table created.<br>";

    // Populate from existing items
    $stmt = $conn->query("SELECT DISTINCT category FROM menu_items");
    $categories = $stmt->fetchAll(PDO::FETCH_COLUMN);

    $order = 0;
    foreach ($categories as $cat) {
        $slug = $cat;
        $title = ucfirst($cat); // Default title
        
        // Insert if not exists
        $insert = "INSERT IGNORE INTO categories (slug, title, sort_order) VALUES (:slug, :title, :order)";
        $stmtInsert = $conn->prepare($insert);
        $stmtInsert->execute([':slug' => $slug, ':title' => $title, ':order' => $order]);
        $order++;
    }
    echo "Categories populated.<br>";

    // Add sort_order to menu_items if not exists (optional, for item reordering later)
    // For now we just order items by insertion ID or we can add a column.
    // Let's add it for future proofing.
    $conn->exec("ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0");
    echo "menu_items schema updated.<br>";

} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
