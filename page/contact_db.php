<?php
// Database connection settings
$servername = "localhost";
$username = "root";
$password = "";
$database = "contact";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo 'Connected successfully<br>';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $category = trim($_POST['category']);
    $message = trim($_POST['message']);
    $priority = trim($_POST['priority']);

    // Prepare SQL Statement
    $sql = "INSERT INTO contact (name, email, category, message, priority)
            VALUES ('$name', '$email', '$category', '$message', '$priority')";

    if ($conn->query($sql) === TRUE) {
        echo "Record inserted successfully!";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}
else {
    echo "Invalid request method.";
}

$conn->close();
?>