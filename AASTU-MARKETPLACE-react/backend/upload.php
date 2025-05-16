<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $itemName = $_POST['itemName'] ?? '';
    $itemDescription = $_POST['itemDescription'] ?? '';
    $itemPrice = $_POST['itemPrice'] ?? '';
    $itemRate = 0;

    if (isset($_FILES['image'])) {
        $imageName = time() . '_' . basename($_FILES['image']['name']);
       $uploadDir = __DIR__ . "/uploads/";

        $targetPath = $targetDir . $imageName;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
            // Save only the filename to the database
            $stmt = $conn->prepare("INSERT INTO itemdetail (itemName, itemPrice, itemRate, itemDescription, itemProfile) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("sdiss", $itemName, $itemPrice, $itemRate, $itemDescription, $imageName);

            if ($stmt->execute()) {
                echo json_encode(["message" => "Item uploaded successfully."]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "DB insert failed."]);
            }

            $stmt->close();
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to move uploaded image."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Image is required."]);
    }
}
?>
