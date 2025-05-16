<?php
//selected products
 require 'connection.php';
session_start();
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

   // getProduct.php

   header('Content-Type: application/json');

   // Assuming you have a database connection established
   $productId = $_GET['id'];

// Prepare the SQL query
$query = "SELECT * FROM products WHERE id = " . intval($productId);

// Execute the query
$result = mysqli_query($conn, $query);

// Fetch the product data
$product = mysqli_fetch_assoc($result);

// Close the conn
mysqli_close($conn);

   echo json_encode($product);
   ?>
   
