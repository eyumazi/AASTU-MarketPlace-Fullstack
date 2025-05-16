<?php
header("Access-Control-Allow-Origin: http://localhost:5173"); // Allow your frontend origin
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allowed methods
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"); // Allowed headers
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204); // No content response for preflight
    exit;
}

require 'connection.php'; // Include your database connection file

$data = json_decode(file_get_contents("php://input"));
$response = array();

if (!empty($data->product_id)) {
    $productId = $data->product_id;
    $quantity = $data->quantity;
    
    $stmt = $conn->prepare("UPDATE cart_items SET quantity = ? WHERE product_id = ?");
    $stmt->bind_param("ii", $quantity, $productId);
    
    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = "Cart updated successfully";
    } else {
        $response['success'] = false;
        $response['message'] = "Error updating cart";
    }
} else {
    $response['success'] = false;
    $response['message'] = "Invalid data";
}

echo json_encode($response);
$conn->close();
?>