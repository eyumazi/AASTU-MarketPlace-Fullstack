<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Content-Type, Authorization');



$response = ['success' => false, 'products' => [], 'totalItems' => 0];

try {
    // Get query parameters
    $categoryId = $_GET['category'] ?? null;
    $excludeId = $_GET['exclude_id'] ?? null;
    $page = max(1, intval($_GET['page'] ?? 1));
    $limit = max(1, intval($_GET['limit'] ?? 4));
    $offset = ($page - 1) * $limit;
    
    if (!$categoryId) {
        throw new Exception('Category ID is required');
    }

    // Connect to database
    require 'connection.php';

    // Get total count of related products
    $countStmt = $conn->prepare("
        SELECT COUNT(*) as total 
        FROM products 
        WHERE category = ? AND id != ?
    ");
    $countStmt->bind_param("ii", $categoryId, $excludeId);
    $countStmt->execute();
    $countResult = $countStmt->get_result();
    $totalItems = $countResult->fetch_assoc()['total'];
    $countStmt->close();
    
    $response['totalItems'] = $totalItems;

    // Get paginated products
    $stmt = $conn->prepare("
        SELECT id, name, price, image, original_price 
        FROM products 
        WHERE category = ? AND id != ? 
        ORDER BY RAND()
        LIMIT ? OFFSET ?
    ");
    
    $stmt->bind_param("iiii", $categoryId, $excludeId, $limit, $offset);
    $stmt->execute();
    $result = $stmt->get_result();
    
    while ($row = $result->fetch_assoc()) {
        $response['products'][] = $row;
    }
    
    $stmt->close();
    $conn->close();
    
    $response['success'] = true;

} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>