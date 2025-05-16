<?php
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
  header('Content-Type: application/json');
 header('Access-Control-Allow-Headers: Content-Type, Authorization');

 //check if the payment method is selected and process the payment
  $data = json_decode(file_get_contents("php://input"), true);
  $Fname = $data['Fname'];
  $email = $data['email'];
  $phone = $data['phone'];
  $city = $data['city'];
  $address = $data['address'];
  $errors = [];
    if (empty($Fname)) {
        $errors['Fname'] = "Full name is required";
    }else if (!preg_match("/^[a-zA-Z ]*$/", $Fname)) {
        $errors['Fname'] = "Only letters and white space allowed in first name";
    }
    if (empty($email)) {
        $errors['email'] = "Email is required";
    } else if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = "Invalid email format";
    }   
    if (empty($phone)) {
        $errors['phone'] = "Phone number is required";
    } else if (!preg_match("/^[0-9]{10}$/", $phone)) {
        $errors['phone'] = "Invalid phone number format";
    }
    if (empty($city)) {
        $errors['city'] = "City is required";
    } else if (!preg_match("/^[a-zA-Z ]*$/", $city)) {
        $errors['city'] = "Only letters and white space allowed in city name";
    }

    if (empty($address)) {
        $errors['address'] = "Address is required";
    }


    if (empty($errors)) {
        $response = [
            'status' => 'success',
            'message' => 'All fields are valid'
        ];
    } else {
        $response = [
            'status' => 'error',
            'errors' => $errors
        ];
    }
    echo json_encode($response);


?>