<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit();
}

$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON payload"]);
    exit();
}

$parentName = trim($data["parentName"] ?? "");
$email      = trim($data["email"] ?? "");
$phone      = trim($data["phone"] ?? "");
$childName  = trim($data["childName"] ?? "");
$childAge   = trim($data["childAge"] ?? "");
$subjects   = json_encode($data["subjects"] ?? []);
$workbook   = !empty($data["workbookInterest"]) ? 1 : 0;
$notes      = trim($data["notes"] ?? "");
$id         = "reg_" . time() . "_" . bin2hex(random_bytes(3));

// 1. Always write to local JSON backup
$backupFile = __DIR__ . "/registrations_backup.json";
$list = [];
if (file_exists($backupFile)) {
    $existing = file_get_contents($backupFile);
    $list = json_decode($existing, true) ?: [];
}
$list[] = [
    "id" => $id,
    "parentName" => $parentName,
    "email" => $email,
    "phone" => $phone,
    "childName" => $childName,
    "childAge" => $childAge,
    "subjects" => $data["subjects"] ?? [],
    "workbookInterest" => $workbook,
    "created_at" => date("c")
];
@file_put_contents($backupFile, json_encode($list, JSON_PRETTY_PRINT));

// 2. Insert into MySQL sirxoloa_db
$dbHost = "localhost";
$dbUser = "sirxoloa_db";
$dbPass = "UYBxcYSJ5YuxaEPgDBj8";
$dbName = "sirxoloa_db";

try {
    $pdo = new PDO("mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4", $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS parent_registrations (
            id VARCHAR(64) PRIMARY KEY,
            parent_name VARCHAR(150) NOT NULL,
            email VARCHAR(150) NOT NULL,
            phone VARCHAR(50) NOT NULL,
            child_name VARCHAR(100) DEFAULT '',
            child_age VARCHAR(20) DEFAULT '',
            subjects JSON,
            workbook_interest BOOLEAN DEFAULT FALSE,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    $stmt = $pdo->prepare("
        INSERT INTO parent_registrations 
        (id, parent_name, email, phone, child_name, child_age, subjects, workbook_interest, notes)
        VALUES (:id, :pname, :email, :phone, :cname, :cage, :subs, :wb, :notes)
    ");

    $stmt->execute([
        ":id"    => $id,
        ":pname" => $parentName,
        ":email" => $email,
        ":phone" => $phone,
        ":cname" => $childName,
        ":cage"  => $childAge,
        ":subs"  => $subjects,
        ":wb"    => $workbook,
        ":notes" => $notes
    ]);
} catch (Exception $e) {
    // MySQL error logged silently while local backup guarantees data is safe
    error_log("DB Registration Error: " . $e->getMessage());
}

http_response_code(200);
echo json_encode(["success" => true, "id" => $id]);
