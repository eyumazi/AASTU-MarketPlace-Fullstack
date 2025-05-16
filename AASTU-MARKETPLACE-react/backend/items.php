<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "aastu_marketplace");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$uploadDir = "../uploads/";

function getInputData() {
    return json_decode(file_get_contents("php://input"), true);
}

switch ($method) {
    case 'GET':
        $result = $conn->query("SELECT * FROM itemdetail ORDER BY itemId DESC");
        $items = [];

        while ($row = $result->fetch_assoc()) {
            $row['itemProfile'] = "http://localhost/AASTU-MarketPlace-Fullstack/uploads/" . $row['itemProfile'];
            $items[] = $row;
        }

        echo json_encode($items);
        break;

    case 'POST':
        if (!isset($_FILES["image"])) {
            http_response_code(400);
            echo json_encode(["error" => "Image file missing"]);
            exit();
        }

        $originalName = basename($_FILES["image"]["name"]);
        $filename = time() . "_" . preg_replace("/[^A-Za-z0-9\.\-_]/", "", $originalName);
        $targetFile = $uploadDir . $filename;

        if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetFile)) {
            $name = $_POST['itemName'] ?? '';
            $description = $_POST['itemDescription'] ?? '';
            $price = $_POST['itemPrice'] ?? 0;
            $rate = $_POST['itemRate'] ?? 0;

            $stmt = $conn->prepare("INSERT INTO itemdetail (itemName, itemPrice, itemRate, itemDescription, itemProfile) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("sdiss", $name, $price, $rate, $description, $filename);
            $stmt->execute();

            echo json_encode(["message" => "Item uploaded successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to move uploaded file"]);
        }
        break;

    case 'PUT':
        $data = getInputData();

        if (!isset($data['itemId'])) {
            http_response_code(400);
            echo json_encode(["error" => "itemId is required"]);
            exit();
        }

        $id = $data['itemId'];
        $name = $data['itemName'] ?? '';
        $price = $data['itemPrice'] ?? 0;
        $rate = $data['itemRate'] ?? 0;
        $desc = $data['itemDescription'] ?? '';
        $profile = basename($data['itemProfile']) ?? '';

        $stmt = $conn->prepare("UPDATE itemdetail SET itemName = ?, itemPrice = ?, itemRate = ?, itemDescription = ?, itemProfile = ? WHERE itemId = ?");
        $stmt->bind_param("sdissi", $name, $price, $rate, $desc, $profile, $id);
        $stmt->execute();

        echo json_encode(["message" => "Item updated"]);
        break;

    case 'DELETE':
        $data = getInputData();

        if (!isset($data['itemId'])) {
            http_response_code(400);
            echo json_encode(["error" => "itemId is required"]);
            exit();
        }

        $id = $data['itemId'];

        // Delete image file first
        $result = $conn->query("SELECT itemProfile FROM itemdetail WHERE itemId = $id");
        if ($row = $result->fetch_assoc()) {
            $imgPath = $uploadDir . basename($row['itemProfile']);
            if (file_exists($imgPath)) {
                unlink($imgPath);
            }
        }

        $conn->query("DELETE FROM itemdetail WHERE itemId = $id");
        echo json_encode(["message" => "Item deleted"]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
        break;
}
?>
