<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require 'connection.php'; // Include your database connection file

$data = json_decode(file_get_contents("php://input"));
$response = array();

if (!empty($data->product_id)) {
    $productId = $data->product_id;
    
    $stmt = $conn->prepare("DELETE FROM cart_items WHERE product_id = ?");
    $stmt->bind_param("i", $productId);
    
    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = "Item removed from cart";
    } else {
        $response['success'] = false;
        $response['message'] = "Error removing item";
    }
} else {
    $response['success'] = false;
    $response['message'] = "Invalid data";
}

echo json_encode($response);
$conn->close();
?>