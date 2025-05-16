<?php 

$server = "localhost";
$username = "root";
$password = "";
$database = "aastumarketplace";

try {
    $dsn = "mysql:host=$server;dbname=$database, charset=utf8mb4";
    $conn = new PDO($dsn, $username, $password);

    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected successfully";
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}

?>
