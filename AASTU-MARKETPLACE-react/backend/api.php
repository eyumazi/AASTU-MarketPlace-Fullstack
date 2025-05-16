<?php
$request = $_SERVER['REQUEST_URI'];
switch ($request) {
    case '/items' && $_SERVER['REQUEST_METHOD'] === 'GET':
        require 'items.php';
        break;
    case '/items' && $_SERVER['REQUEST_METHOD'] === 'POST':
        require 'upload.php';
        break;
    default:
        http_response_code(404);
        echo json_encode(["error" => "Endpoint not found"]);
        break;
}
?>
