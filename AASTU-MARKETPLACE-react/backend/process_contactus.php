<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Include the database connection file
require 'db_connection.php';
if (!isset($conn) || $conn === null) {
   throw new Exception("Database connection not established");
}

// Set the recipient email address
$recipient_email = "dawitgetachew808@gmail.com";

// Initialize response array
$response = [
   'success' => false,
   'message' => '',
   'errors' => []
];

// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
   // Get JSON input (for React fetch)
   $data = json_decode(file_get_contents("php://input"), true);

   // Fallback to form data if JSON is empty
   if (empty($data)) {
      $data = $_POST;
   }

   // Get form data and sanitize it
   $full_name = isset($data['FullName']) ? htmlspecialchars(trim($data['FullName'])) : '';
   $email = isset($data['EmailAddress']) ? filter_var(trim($data['EmailAddress']), FILTER_SANITIZE_EMAIL) : '';
   $phone = isset($data['PhoneNumber']) ? htmlspecialchars(trim($data['PhoneNumber'])) : '';
   $message = isset($data['Message']) ? htmlspecialchars(trim($data['Message'])) : '';

   // Validate inputs
   $valid = true;
   if (empty($full_name)) {
      $response['errors']['FullName'] = 'Name is required';
      $valid = false;
   }
   if (empty($email)) {
      $response['errors']['EmailAddress'] = 'Email is required';
      $valid = false;
   } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
      $response['errors']['EmailAddress'] = 'Invalid email format';
      $valid = false;
   }
   if (empty($phone)) {
      $response['errors']['PhoneNumber'] = 'Phone is required';
      $valid = false;
   }
   if (empty($message)) {
      $response['errors']['Message'] = 'Message is required';
      $valid = false;
   }

   if ($valid) {
      // Prepare email content
      $email_subject = "New Contact Form Submission from $full_name";
      $email_body = "You have received a new message from the AASTU Marketplace contact form.\n\n";
      $email_body .= "Name: $full_name\n";
      $email_body .= "Email: $email\n";
      $email_body .= "Phone: $phone\n\n";
      $email_body .= "Message:\n$message\n";

      // Set email headers
      $headers = "From: $email\r\n";
      $headers .= "Reply-To: $email\r\n";
      $headers .= "X-Mailer: PHP/" . phpversion();

      // Send the email
      if (mail($recipient_email, $email_subject, $email_body, $headers)) {
         // If email sent successfully, store in database
         try {
            $stmt = $conn->prepare("INSERT INTO contact_messages (full_name, email, phone, message, created_at) VALUES (?, ?, ?, ?, NOW())");
            $stmt->execute([$full_name, $email, $phone, $message]);

            $response['success'] = true;
            $response['message'] = 'Your message has been sent successfully!';
         } catch (PDOException $e) {
            // Email was sent but database insert failed
            error_log("Database error: " . $e->getMessage());
            $response['success'] = true;
            $response['message'] = 'Message sent, but we could not save it to our records.';
         }
      } else {
         $response['message'] = 'Failed to send message. Please try again later.';
      }
   } else {
      $response['message'] = 'Please correct the errors in the form.';
   }
} else {
   $response['message'] = 'Invalid request method.';
}

// Return JSON response
http_response_code($response['success'] ? 200 : 400);
echo json_encode($response);
