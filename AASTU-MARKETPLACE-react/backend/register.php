<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$dbHost = "aws-0-us-east-2.pooler.supabase.com";
$dbPort = "6543";
$dbName = "postgres";
$username = "postgres.znwwxleyxvhljyhzvtsg";
$password = "mhAsdMzjtm2E3esZ";
$tableName = 'registrationdata';

function generateVerificationCode() {
    return str_pad(mt_rand(0, 999999), 6, '0', STR_PAD_LEFT);
}
require '../backend/PHPMailer-master/src/PHPMailer.php';
require '../backend/PHPMailer-master/src/SMTP.php';
require '../backend/PHPMailer-master/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

function sendVerificationEmail($email, $code) {
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
        $mail->addAddress($email);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = 'AASTU Marketplace - Email Verification';
        $mail->Body = '
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification</title>
            <style>
                body {
                    font-family: \'Arial\', sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    background-color: #2c3e50;
                    color: white;
                    padding: 20px;
                    text-align: center;
                    border-radius: 5px 5px 0 0;
                }
                .content {
                    padding: 30px;
                    background-color: #f9f9f9;
                    border-left: 1px solid #ddd;
                    border-right: 1px solid #ddd;
                }
                .code-container {
                    margin: 25px 0;
                    text-align: center;
                }
                .verification-code {
                    display: inline-block;
                    padding: 15px 30px;
                    background-color: #3498db;
                    color: white;
                    font-size: 24px;
                    font-weight: bold;
                    letter-spacing: 2px;
                    border-radius: 5px;
                    text-decoration: none;
                }
                .footer {
                    padding: 15px;
                    text-align: center;
                    background-color: #ecf0f1;
                    border-radius: 0 0 5px 5px;
                    font-size: 12px;
                    color: #7f8c8d;
                    border-left: 1px solid #ddd;
                    border-right: 1px solid #ddd;
                    border-bottom: 1px solid #ddd;
                }
                .note {
                    font-size: 14px;
                    color: #e74c3c;
                    margin-top: 20px;
                    text-align: center;
                }
                .logo {
                    max-width: 150px;
                    margin-bottom: 15px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>AASTU Marketplace</h2>
                <p>Email Verification</p>
            </div>
            
            <div class="content">
                <p>Hello,</p>
                <p>Thank you for registering with AASTU Marketplace. To complete your registration, please use the following verification code:</p>
                
                <div class="code-container">
                    <div class="verification-code">'.$code.'</div>
                </div>
                
                <p class="note">This code will expire in 1 minute. Please do not share this code with anyone.</p>
                
                <p>If you didn\'t request this code, you can safely ignore this email.</p>
                
                <p>Best regards,<br>The AASTU Marketplace Team</p>
            </div>
            
            <div class="footer">
                <p>&copy; '.date('Y').' AASTU Marketplace. All rights reserved.</p>
                <p>Addis Ababa Science and Technology University</p>
            </div>
        </body>
        </html>
        ';
        
        // Plain text version for non-HTML email clients
        $mail->AltBody = "AASTU Marketplace - Email Verification\n\n".
                         "Your verification code is: $code\n\n".
                         "This code will expire in 1 minute.\n\n".
                         "If you didn't request this code, please ignore this email.";
        
        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Mailer Error: {$mail->ErrorInfo}");
        return false;
    }
}

function dd($value) {
    echo '<pre>';
    echo var_dump($value);
    echo '</pre>';
    die;
}

$response = [
    'success' => false,
    'message' => '',
    'errors' => [],
    'requires_verification' => false
];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['message'] = 'Invalid request method';
    echo json_encode($response);
    exit;
}

try {
    // Get raw JSON data if Content-Type is application/json
    $input = file_get_contents('php://input');
    if (strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) {
        $_POST = json_decode($input, true);
    }

    // Handle verification request
    if (isset($_POST['verification_code'])) {
        require './db_connection.php';

        // Ensure $conn is initialized
        if (!isset($conn) || $conn === null) {
            throw new Exception("Database connection not established");
        }
        
        $email = $_POST['Email'];
        $code = $_POST['verification_code'];
        
        // Check if code is valid and not expired
        $stmt = $conn->prepare("SELECT * FROM verification_codes WHERE email = :email AND code = :code AND expires_at > NOW()");
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":code", $code);
        $stmt->execute();
        $result = $stmt->fetch();
        
        if ($result) {
            // Mark user as verified
            $updateStmt = $conn->prepare("UPDATE registrationdata SET verified = true WHERE Email = :email");
            $updateStmt->bindParam(":email", $email);
            $updateStmt->execute();
            
            // Delete the used code
            $deleteStmt = $conn->prepare("DELETE FROM verification_codes WHERE email = :email AND code = :code");
            $deleteStmt->bindParam(":email", $email);
            $deleteStmt->bindParam(":code", $code);
            $deleteStmt->execute();
            
            $response['success'] = true;
            $response['message'] = "Email verified successfully!";
        } else {
            $response['message'] = "Invalid or expired verification code";
        }
        
        echo json_encode($response);
        exit;
    }

    // Handle resend verification code request
    if (isset($_POST['resend_verification'])) {
        require './db_connection.php';

        // Ensure $conn is initialized
        if (!isset($conn) || $conn === null) {
            throw new Exception("Database connection not established");
        }
        
        $email = $_POST['Email'];
        $code = generateVerificationCode();
        $expiresAt = date('Y-m-d H:i:s', strtotime('+1 minute'));
        
        // Delete any existing codes for this email
        $deleteStmt = $conn->prepare("DELETE FROM verification_codes WHERE email = :email");
        $deleteStmt->bindParam(":email", $email);
        $deleteStmt->execute();
        
        // Insert new code
        $insertStmt = $conn->prepare("INSERT INTO verification_codes (email, code, expires_at) VALUES (:email, :code, :expires_at)");
        $insertStmt->bindParam(":email", $email);
        $insertStmt->bindParam(":code", $code);
        $insertStmt->bindParam(":expires_at", $expiresAt);
        $insertStmt->execute();
        
        // Send email
        if (sendVerificationEmail($email, $code)) {
            $response['success'] = true;
            $response['message'] = "Verification code resent successfully!";
        } else {
            $response['message'] = "Failed to send verification email";
        }
        
        echo json_encode($response);
        exit;
    }

    // Original registration validation
    $requiredFields = ['Id', 'Email', 'Name', 'Phone', 'Password', 'Role'];
    foreach ($requiredFields as $field) {
        if (empty($_POST[$field] ?? null)) {
            $response['errors'][$field] = "This field is required";
        }
    }

    // Validate email format
    if (!empty($_POST['Email']) && (!filter_var($_POST['Email'], FILTER_VALIDATE_EMAIL) || !str_ends_with($_POST['Email'], '@aastustudent.edu.et'))) {
        $response['errors']['Email'] = "Please use a valid AASTU institutional email";
    }

    // Validate phone number
    if (!empty($_POST['Phone']) && !preg_match('/^[0-9]{10}$/', $_POST['Phone'])) {
        $response['errors']['Phone'] = "Please enter a valid 10-digit phone number";
    }

    // Validate password strength
    if (!empty($_POST['Password'])) {
        if (strlen($_POST['Password']) < 8) {
            $response['errors']['Password'] = "Password must be at least 8 characters";
        } elseif (
            !preg_match('/[A-Z]/', $_POST['Password']) ||
            !preg_match('/[a-z]/', $_POST['Password']) ||
            !preg_match('/[0-9]/', $_POST['Password'])
        ) {
            $response['errors']['Password'] = "Password must contain uppercase, lowercase, and numbers";
        }
    }

    // Check if terms were accepted
    if (empty($_POST['terms'] ?? null)) {
        $response['errors']['terms'] = "You must accept the terms and conditions";
    }

    // Handle file upload
    $profilePicturePath = null;
    if (!empty($_FILES['PPpath']['name'])) {
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        $fileInfo = finfo_open(FILEINFO_MIME_TYPE);
        $detectedType = finfo_file($fileInfo, $_FILES['PPpath']['tmp_name']);

        if (!in_array($detectedType, $allowedTypes)) {
            $response['errors']['PPpath'] = "Only JPG, PNG, and GIF files are allowed (max 2MB)";
        } elseif ($_FILES['PPpath']['size'] > 2097152) {
            $response['errors']['PPpath'] = "File size must be less than 2MB";
        } else {
            $uploadDir = __DIR__ . '/uploads/';
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }

            $extension = pathinfo($_FILES['PPpath']['name'], PATHINFO_EXTENSION);
            $filename = 'profile_' . uniqid() . '.' . $extension;
            $uploadPath = $uploadDir . $filename;

            if (move_uploaded_file($_FILES['PPpath']['tmp_name'], $uploadPath)) {
                $profilePicturePath = 'uploads/' . $filename;
            } else {
                $response['errors']['PPpath'] = "Failed to upload profile picture";
            }
        }
    } else {
        $response['errors']['PPpath'] = "Profile picture is required";
    }

    // Return errors if any
    if (!empty($response['errors'])) {
        $response['message'] = "Please fix the errors below";
        echo json_encode($response);
        exit;
    }

    require './db_connection.php';
    
    // Ensure $conn is initialized
    if (!isset($conn) || $conn === null) {
        throw new Exception("Database connection not established");
    }
    
    // Check if user already exists
    $checkStmt = $conn->prepare("SELECT * FROM RegistrationData WHERE Email = :email OR Id = :id");
    $checkStmt->bindParam(":id", $_POST['Id'], PDO::PARAM_STR);
    $checkStmt->bindParam(":email", $_POST['Email'], PDO::PARAM_STR);
    $checkStmt->execute();
    $checkResult = $checkStmt->fetch();
    
    if ($checkResult) {
        throw new Exception("User with this ID or Email already exists");
    }

    // Hash password
    $hashedPassword = password_hash($_POST['Password'], PASSWORD_DEFAULT);

    // Insert new user with prepared statement
    $insertQuery = $conn->prepare("INSERT INTO $tableName (Id, Email, Name, Phone, Password, PPpath, Role, verified) VALUES (?, ?, ?, ?, ?, ?, ?, false)");
    $insertQuery->execute([
        $_POST['Id'],
        $_POST['Email'],
        $_POST['Name'],
        $_POST['Phone'],
        $hashedPassword,
        $profilePicturePath,
        $_POST['Role']
    ]);

    // Generate verification code
    $verificationCode = generateVerificationCode();
    $expiresAt = date('Y-m-d H:i:s', strtotime('+1 minute'));
    
    // Store verification code
    $codeStmt = $conn->prepare("INSERT INTO verification_codes (email, code, expires_at) VALUES (?, ?, ?)");
    $codeStmt->execute([$_POST['Email'], $verificationCode, $expiresAt]);
    
    // Send verification email
    if (sendVerificationEmail($_POST['Email'], $verificationCode)) {
        $response['success'] = true;
        $response['message'] = "Registration successful! Please check your email for the verification code.";
        $response['requires_verification'] = true;
    } else {
        throw new Exception("Registration successful but failed to send verification email");
    }

} catch (Exception $e) {
    $response['message'] = $e->getMessage();
    error_log("Registration Error: " . $e->getMessage());
} finally {
    if (isset($dbconn)) {
        pg_close($dbconn);
    }
}

echo json_encode($response);
?>