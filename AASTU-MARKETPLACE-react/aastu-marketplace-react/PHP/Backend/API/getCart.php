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
$response = array();
$response['success'] = false;

// For a real application, you would filter by user session or ID
$sql = "SELECT * FROM cart_items";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $items = array();
    while($row = $result->fetch_assoc()) {
        $items[] = $row;
    }
    $response['success'] = true;
    $response['items'] = $items;
} else {
    $response['message'] = "No items in cart";
}

echo json_encode($response);
$conn->close();
?>