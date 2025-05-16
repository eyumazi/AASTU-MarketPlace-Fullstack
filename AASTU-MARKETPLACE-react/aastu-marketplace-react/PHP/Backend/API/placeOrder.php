<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Content-Type, Authorization');




$response = ['success' => false, 'message' => '', 'order_id' => null];

try {
    // Get the POST data
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON input');
    }

    // Validate required data
    if (empty($input['customer_info']) || empty($input['cart_items'])) {
        throw new Exception('Missing required order data');
    }

    // Connect to database
   require 'connection.php'; // Include your database connection file

    // Start transaction
    $conn->begin_transaction();

    try {
        // Insert order header
        $customer = $input['customer_info'];
        $stmt = $conn->prepare("
            INSERT INTO orders (
                customer_name, 
                company_name,
                email, 
                phone, 
                address, 
                apartment_floor,
                city, 
                payment_method,
                total_amount,
                order_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->bind_param(
            "ssssssssds",
            $customer['fname'],
            $customer['companyName'],
            $customer['email'],
            $customer['phone'],
            $customer['address'],
            $customer['apartFloor'],
            $customer['city'],
            $input['payment_method'],
            $input['total_amount'],
            $input['order_date']
        );
        
        if (!$stmt->execute()) {
            throw new Exception('Failed to save order: ' . $stmt->error);
        }
        
        $orderId = $conn->insert_id;
        $stmt->close();

        // Insert order items
        $stmt = $conn->prepare("
            INSERT INTO order_items (
                order_id, 
                product_id, 
                product_name, 
                quantity, 
                unit_price,
                subtotal
            ) VALUES (?, ?, ?, ?, ?, ?)
        ");

        foreach ($input['cart_items'] as $item) {
            $subtotal = $item['price'] * $item['quantity'];
            $stmt->bind_param(
                "issidd",
                $orderId,
                $item['product_id'],
                $item['name'],
                $item['quantity'],
                $item['price'],
                $subtotal
            );
            
            if (!$stmt->execute()) {
                throw new Exception('Failed to save order item: ' . $stmt->error);
            }
        }

        $stmt->close();
        $conn->commit();
        
        $response['success'] = true;
        $response['order_id'] = $orderId;
        $response['total_amount'] = $input['total_amount'];
        $response['message'] = 'Order placed successfully';
        
    } catch (Exception $e) {
        $conn->rollback();
        throw $e;
    } finally {
        $conn->close();
    }

} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>