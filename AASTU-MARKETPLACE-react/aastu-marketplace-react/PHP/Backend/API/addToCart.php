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

// Get the posted data
$data = json_decode(file_get_contents("php://input"));

// Validate data
if (!empty($data->product_id) && !empty($data->name) && !empty($data->price) && !empty($data->quantity)) {
    
    // Check if product already exists in cart
    $checkSql = "SELECT * FROM cart_items WHERE product_id = ?";
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bind_param("i", $data->product_id);
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    
    if ($result->num_rows > 0) {
        // Update quantity if product exists
        $row = $result->fetch_assoc();
        $newQuantity = $row['quantity'] + $data->quantity;
        
        $updateSql = "UPDATE cart_items SET quantity = ? WHERE product_id = ?";
        $updateStmt = $conn->prepare($updateSql);
        $updateStmt->bind_param("ii", $newQuantity, $data->product_id);
        
        if ($updateStmt->execute()) {
            http_response_code(200);
            echo json_encode(array("message" => "Product quantity updated in cart.", "success" => true));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to update cart.", "success" => false));
        }
    } else {
        // Insert new item
        $insertSql = "INSERT INTO cart_items (product_id, name, price, quantity, image, subtotal) VALUES (?, ?, ?, ?, ?, ?)";
        $insertStmt = $conn->prepare($insertSql);
        $insertStmt->bind_param("isdisd", 
            $data->product_id, 
            $data->name, 
            $data->price, 
            $data->quantity,
            $data->image,
            $data->subtotal
        );
        
        if ($insertStmt->execute()) {
            http_response_code(201);
            echo json_encode(array("message" => "Product added to cart.", "success" => true));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to add to cart.", "success" => false));
        }
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Incomplete data.", "success" => false));
}

$conn->close();
?>
