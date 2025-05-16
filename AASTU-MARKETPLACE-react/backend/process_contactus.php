<?php
require '../backend/PHPMailer-master/src/PHPMailer.php';
require '../backend/PHPMailer-master/src/SMTP.php';
require '../backend/PHPMailer-master/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require 'db_connection.php';
if (!isset($conn) || $conn === null) {
    throw new Exception("Database connection not established");
}

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

        function sendContactusEmail($full_name, $email, $phone, $message, $recipient_email) {
            $mail = new PHPMailer(true);
            
            try {
                // Server settings
                $mail->isSMTP();
                $mail->Host       = 'smtp.gmail.com';
                $mail->SMTPAuth   = true;
                $mail->Username   = 'dawitgetachew808@gmail.com';
                $mail->Password   = 'ltmi inho ejhv iooz'; //google app password
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port       = 587;
                
                // Recipients
                $mail->setFrom('dawitgetachew808@gmail.com', 'AASTU Marketplace');
                $mail->addAddress($recipient_email); // Send to your admin email
                $mail->addReplyTo($email, $full_name); // Allow reply to sender
                
                // Content
                $mail->isHTML(true);
                $mail->Subject = 'New Contact Form Submission from ' . $full_name;
                $mail->Body = '<!DOCTYPE html>
                            <html>
                            <head>
                                <meta charset="UTF-8">
                                <title>New Contact Form Submission</title>
                                <style>
                                    body {
                                        font-family: Arial, sans-serif;
                                        line-height: 1.6;
                                        color: #333;
                                        max-width: 600px;
                                        margin: 0 auto;
                                        padding: 20px;
                                    }
                                    .header {
                                        color: #2c3e50;
                                        font-size: 24px;
                                        margin-bottom: 20px;
                                        border-bottom: 2px solid #eee;
                                        padding-bottom: 10px;
                                    }
                                    .details {
                                        background-color: #f9f9f9;
                                        padding: 15px;
                                        border-radius: 5px;
                                        margin-bottom: 20px;
                                    }
                                    .label {
                                        font-weight: bold;
                                        color: #2c3e50;
                                        display: inline-block;
                                        width: 80px;
                                    }
                                    .message {
                                        padding: 15px;
                                        background-color: #f0f8ff;
                                        border-left: 4px solid #3498db;
                                        border-radius: 0 5px 5px 0;
                                    }
                                    .footer {
                                        margin-top: 20px;
                                        font-size: 12px;
                                        color: #7f8c8d;
                                        text-align: center;
                                    }
                                </style>
                            </head>
                            <body>
                                <div class="header">New Contact Form Submission</div>
                                
                                <p>You have received a new message from the AASTU Marketplace contact form.</p>
                                
                                <div class="details">
                                    <p><span class="label">Name:</span> ' . htmlspecialchars($full_name) . '</p>
                                    <p><span class="label">Email:</span> ' . htmlspecialchars($email) . '</p>
                                    <p><span class="label">Phone:</span> ' . htmlspecialchars($phone) . '</p>
                                </div>
                                
                                <div class="message">
                                    <p><strong>Message:</strong></p>
                                    <p>' . nl2br(htmlspecialchars($message)) . '</p>
                                </div>
                                
                                <div class="footer">
                                    This email was sent from the contact form on AASTU Marketplace.
                                </div>
                            </body>
                            </html>';
            
                // Plain text version for non-HTML email clients
                $mail->AltBody = "New Contact Form Submission\n\n".
                                "You have received a new message from the AASTU Marketplace contact form.\n\n".
                                "Name: $full_name\n".
                                "Email: $email\n".
                                "Phone: $phone\n\n".
                                "Message:\n$message\n\n".
                                "This email was sent from the contact form on AASTU Marketplace.";
                
                return $mail->send();
            } catch (Exception $e) {
                error_log("Mailer Error: {$mail->ErrorInfo}");
                return false;
            }
        }

        // Send the email
        if (sendContactusEmail($full_name, $email, $phone, $message, $recipient_email)) {
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
echo json_encode($response);

