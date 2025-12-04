<?php
// db_config.php
// XAMPP-friendly defaults for local development.
// If you change credentials in phpMyAdmin, update these values.

return [
    'host' => getenv('DB_HOST') ?: '127.0.0.1', // localhost or 127.0.0.1
    'user' => getenv('DB_USER') ?: 'root',
    'pass' => getenv('DB_PASS') ?: '',
    'name' => getenv('DB_NAME') ?: 'contact_db',
];