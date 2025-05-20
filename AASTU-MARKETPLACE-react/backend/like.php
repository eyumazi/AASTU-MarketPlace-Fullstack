<?php
// Enable CORS
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight request
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

// Show errors
ini_set('display_errors', 1);
error_reporting(E_ALL);

// DB connection
$dbHost = "aws-0-us-east-2.pooler.supabase.com";
$dbPort = "6543";
$dbName = "postgres";
$username = "postgres.znwwxleyxvhljyhzvtsg";
$password = "mhAsdMzjtm2E3esZ";
$dsn = "pgsql:host={$dbHost};port={$dbPort};dbname={$dbName};sslmode=require;options='--client_encoding=UTF8'";

try {
    $conn = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
    exit();
}

// Read JSON input
$data = json_decode(file_get_contents("php://input"));

$user_id = $data->user_id ?? null;
$item_id = $data->item_id ?? null;

if (!$user_id || !$item_id) {
    http_response_code(400);
    echo json_encode(["error" => "Missing user_id or item_id"]);
    exit();
}

// Get current liked items from cookie (if any)
$likedItems = [];
if (isset($_COOKIE['likedItems'])) {
    $likedItems = json_decode($_COOKIE['likedItems'], true);
    if (!is_array($likedItems)) {
        $likedItems = [];
    }
}

try {
    // Check if user already liked the item
    $checkStmt = $conn->prepare("SELECT 1 FROM likes WHERE user_id = :user_id AND item_id = :item_id");
    $checkStmt->execute([':user_id' => $user_id, ':item_id' => $item_id]);
    $exists = $checkStmt->fetchColumn();

    if ($exists) {
        // Unlike: delete the like
        $delStmt = $conn->prepare("DELETE FROM likes WHERE user_id = :user_id AND item_id = :item_id");
        $delStmt->execute([':user_id' => $user_id, ':item_id' => $item_id]);

        // Remove from cookie list
        $likedItems = array_filter($likedItems, fn($id) => $id != $item_id);

        // Decrement itemrate by 1
        $updateRate = $conn->prepare("UPDATE itemdetail SET itemrate = GREATEST(itemrate - 1, 0) WHERE itemid = :item_id");
        $updateRate->execute([':item_id' => $item_id]);
    } else {
        // Like: insert new like
        $insStmt = $conn->prepare("INSERT INTO likes (user_id, item_id) VALUES (:user_id, :item_id)");
        $insStmt->execute([':user_id' => $user_id, ':item_id' => $item_id]);

        // Add to cookie list
        $likedItems[] = $item_id;
        $likedItems = array_values(array_unique($likedItems)); // unique & reset keys

        // Increment itemrate by 1
        $updateRate = $conn->prepare("UPDATE itemdetail SET itemrate = itemrate + 1 WHERE itemid = :item_id");
        $updateRate->execute([':item_id' => $item_id]);
    }

    // Set updated cookie (expires in 7 days)
    setcookie('likedItems', json_encode($likedItems), time() + (7 * 24 * 60 * 60), "/");

    echo json_encode([
        "status" => "success",
        "likedItems" => $likedItems
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "DB error: " . $e->getMessage()]);
}
?>
