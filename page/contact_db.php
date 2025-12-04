<?php
// contact_db.php
// Secure contact form handler for XAMPP local development.

$config = require __DIR__ . '/db_config.php';

// Show errors for development (disable in production)
ini_set('display_errors', '1');
error_reporting(E_ALL);

try {
    // Throw exceptions on mysqli errors
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

    // Connect to database
    $mysqli = new mysqli($config['host'], $config['user'], $config['pass'], $config['name']);
    $mysqli->set_charset('utf8mb4');

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo 'Invalid request method.';
        exit;
    }

    // Read and trim inputs
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $category = isset($_POST['category']) ? trim($_POST['category']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';
    $priority = isset($_POST['priority']) ? trim($_POST['priority']) : '';

    // Basic validation
    $errors = [];

    if ($name === '' || mb_strlen($name) > 100) {
        $errors[] = 'Name is required and must be 100 characters or less.';
    }

    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 255) {
        $errors[] = 'A valid email address is required.';
    }

    $allowed_categories = ['battery','performance','display','overheating','software','hardware','other',''];
    if (!in_array($category, $allowed_categories, true)) {
        $errors[] = 'Invalid category selected.';
    }

    $allowed_priorities = ['low','medium','high'];
    if (!in_array($priority, $allowed_priorities, true)) {
        $errors[] = 'Invalid priority selected.';
    }

    if ($message === '' || mb_strlen($message) > 2000) {
        $errors[] = 'Message is required and must be 2000 characters or less.';
    }

    if (!empty($errors)) {
        http_response_code(400);
        foreach ($errors as $err) {
            echo htmlspecialchars($err, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . "<br>";
        }
        exit;
    }

    // Prepared statement to insert
    $stmt = $mysqli->prepare("INSERT INTO contact (name, email, category, message, priority, created_at) VALUES (?, ?, ?, ?, ?, NOW())");
    $stmt->bind_param('sssss', $name, $email, $category, $message, $priority);
    $stmt->execute();
    $stmt->close();

    // Success response: redirect back to form or print message.
    // For local testing, printing a message is fine:
    echo 'Record inserted successfully. Thank you!';

} catch (Exception $e) {
    error_log('Contact DB error: ' . $e->getMessage());
    http_response_code(500);
    echo 'Sorry, an error occurred while saving your message. Please try again later.';
} finally {
    if (!empty($mysqli) && $mysqli instanceof mysqli) {
        $mysqli->close();
    }
}