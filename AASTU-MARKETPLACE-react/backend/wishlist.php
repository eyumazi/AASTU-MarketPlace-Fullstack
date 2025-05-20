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

// Handle wishlist logic
$data = json_decode(file_get_contents("php://input"));

$user_id = $data->user_id ?? null;
$item_id = $data->item_id ?? null;

if (!$user_id || !$item_id) {
    http_response_code(400);
    echo json_encode(["error" => "Missing user_id or item_id"]);
    exit();
}

try {
    $stmt = $conn->prepare("INSERT INTO wishlist (user_id, item_id) VALUES (:user_id, :item_id) 
                            ON CONFLICT (user_id, item_id) DO NOTHING");

    $stmt->execute([
        ':user_id' => $user_id,
        ':item_id' => $item_id
    ]);

    echo json_encode(["status" => "success"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Insert failed: " . $e->getMessage()]);
}
?>
