<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

$dbHost = "aws-0-us-east-2.pooler.supabase.com";
$dbPort = "6543";
$dbName = "postgres";
$username = "postgres.znwwxleyxvhljyhzvtsg";
$password = "mhAsdMzjtm2E3esZ";

$dsn = "pgsql:host=$dbHost;port=$dbPort;dbname=$dbName;sslmode=require;options='--client_encoding=UTF8'";

try {
    $conn = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "DB connection failed: " . $e->getMessage()]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$userId = $data["user_id"] ?? null;
$itemId = $data["item_id"] ?? null;

if (!$userId || !$itemId) {
    http_response_code(400);
    echo json_encode(["error" => "Missing user_id or item_id"]);
    exit();
}

try {
    $stmt = $conn->prepare("DELETE FROM wishlist WHERE user_id = :user_id AND item_id = :item_id");
    $stmt->execute([
        ':user_id' => $userId,
        ':item_id' => $itemId,
    ]);

    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Delete failed: " . $e->getMessage()]);
}
