<?php
// Ensure no output before headers
ob_start();

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"); // Allowed headers


// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204); 
    exit;
}
// Include your database connection
require_once 'connection.php';

// Initialize response array
$response = ['success' => false, 'message' => ''];

try {
    // Validate input
    if (!isset($_GET['product_id']) || !is_numeric($_GET['product_id'])) {
        $response['message'] = 'Invalid product ID';
        http_response_code(400);
        echo json_encode($response);
        exit;
    }

    $product_id = intval($_GET['product_id']);

    // Prepare and execute query
    $stmt = $conn->prepare("SELECT quantity FROM products WHERE id = ?");
    $stmt->execute([$product_id]);
    $product = mysqli_fetch_assoc($stmt->get_result());
    $stmt->close();

    if ($product) {
        $response = [
            'success' => true,
            'stock' => (int)$product['quantity'],
            'message' => 'Stock available'
        ];
    } else {
        $response['message'] = 'Product not found';
        http_response_code(404);
    }
} catch (PDOException $e) {
    $response['message'] = 'Database error';
    http_response_code(500);
    // Log the actual error for debugging
    error_log($e->getMessage());
} catch (Exception $e) {
    $response['message'] = 'Server error';
    http_response_code(500);
    error_log($e->getMessage());
}

// Ensure no other output
ob_end_clean();
echo json_encode($response);
exit;
?>