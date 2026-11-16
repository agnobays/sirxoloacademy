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

// 1. ALWAYS SAVE TO LOCAL JSON BACKUP
$backupFile = __DIR__ . "/registrations_backup.json";
$list = [];
if (file_exists($backupFile)) {
    $existing = @file_get_contents($backupFile);
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
    "notes" => $notes,
    "created_at" => date("c")
];
@file_put_contents($backupFile, json_encode($list, JSON_PRETTY_PRINT));

// 2. INSERT INTO MYSQL sirxoloa_db
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
    error_log("DB Registration Notice: " . $e->getMessage());
}

// 3. SEND EMAIL NOTIFICATION TO preapplicattion@sirxoloacademy.co.za
$adminEmail = "preapplicattion@sirxoloacademy.co.za";
$subject = "New Pre-Registration: " . ($parentName ?: "Parent") . " (Learner: " . ($childName ?: "Child") . ")";

$subsList = is_array($data["subjects"] ?? null) ? implode(", ", $data["subjects"]) : "All 3 Subjects";
$body = "=====================================================\r\n";
$body .= "NEW SIR XOLO ACADEMY PRE-REGISTRATION\r\n";
$body .= "=====================================================\r\n";
$body .= "Submission Date: " . date("Y-m-d H:i:s") . "\r\n";
$body .= "Registration ID: " . $id . "\r\n\r\n";
$body .= "PARENT DETAILS:\r\n";
$body .= "- Full Name: " . $parentName . "\r\n";
$body .= "- Email: " . $email . "\r\n";
$body .= "- WhatsApp / Phone: " . $phone . "\r\n\r\n";
$body .= "LEARNER DETAILS:\r\n";
$body .= "- Child Name: " . ($childName ?: "Not specified") . "\r\n";
$body .= "- Child Age: " . ($childAge ?: "Not specified") . "\r\n";
$body .= "- Subject Interests: " . $subsList . "\r\n";
$body .= "- Workbook Interest: " . ($workbook ? "YES (Wants workbooks)" : "No") . "\r\n";
if (!empty($notes)) {
    $body .= "- Parent Notes: " . $notes . "\r\n";
}
$body .= "\r\nSTATUS: Recorded in MySQL database (sirxoloa_db.parent_registrations)\r\n";
$body .= "=====================================================\r\n";

// Function to send via SMTP (port 587)
function sendViaSmtp($to, $subject, $content) {
    $user = "preapplicattion@sirxoloacademy.co.za";
    $pass = "HgTvABMZrV8jL42JLKPy";
    $host = "127.0.0.1";
    $port = 587;

    $sock = @fsockopen($host, $port, $errno, $errstr, 5);
    if (!$sock) {
        $sock = @fsockopen("mail.sirxoloacademy.co.za", $port, $errno, $errstr, 5);
    }
    if ($sock) {
        @fgets($sock, 515);
        @fputs($sock, "EHLO sirxoloacademy.co.za\r\n");
        @fgets($sock, 515);
        @fputs($sock, "AUTH LOGIN\r\n");
        @fgets($sock, 515);
        @fputs($sock, base64_encode($user) . "\r\n");
        @fgets($sock, 515);
        @fputs($sock, base64_encode($pass) . "\r\n");
        @fgets($sock, 515);
        @fputs($sock, "MAIL FROM: <$user>\r\n");
        @fgets($sock, 515);
        @fputs($sock, "RCPT TO: <$to>\r\n");
        @fgets($sock, 515);
        @fputs($sock, "DATA\r\n");
        @fgets($sock, 515);

        $headers = "From: Sir Xolo Academy <$user>\r\n";
        $headers .= "Reply-To: $user\r\n";
        $headers .= "Subject: $subject\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

        @fputs($sock, $headers . "\r\n" . $content . "\r\n.\r\n");
        @fgets($sock, 515);
        @fputs($sock, "QUIT\r\n");
        @fclose($sock);
        return true;
    }
    return false;
}

$sent = sendViaSmtp($adminEmail, $subject, $body);
if (!$sent) {
    // Native PHP mail fallback
    $headers = "From: preapplicattion@sirxoloacademy.co.za\r\nReply-To: preapplicattion@sirxoloacademy.co.za\r\n";
    @mail($adminEmail, $subject, $body, $headers);
}

http_response_code(200);
echo json_encode(["success" => true, "id" => $id]);
