<?php
$host = 'localhost';
$user = 'studenti';
$password = 'S039C8R7';
$database = 'Qcodeigniter';

$conn = new mysqli($host, $user, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("❌ Connection failed: " . $conn->connect_error);
}
echo "✅ Connected successfully to MySQL!";
?>
