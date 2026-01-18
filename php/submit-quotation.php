<?php
/**
 * Submit Quotation Handler
 * Handles form submission from get-quotation.html
 */

require_once 'config.php';

// Set headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJSON(['success' => false, 'message' => 'Invalid request method'], 405);
}

try {
    // Get form data
    $projectType = sanitizeInput($_POST['projectType'] ?? '');
    $budget = filter_var($_POST['budget'] ?? 0, FILTER_VALIDATE_FLOAT);
    $hasPlans = sanitizeInput($_POST['hasPlans'] ?? 'no');
    $startDate = sanitizeInput($_POST['startDate'] ?? '');
    $fullName = sanitizeInput($_POST['fullName'] ?? '');
    $email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $phone = sanitizeInput($_POST['phone'] ?? '');
    $city = sanitizeInput($_POST['city'] ?? '');
    $consultation = isset($_POST['consultation']) && $_POST['consultation'] === 'true' ? 'yes' : 'no';

    // Validation
    $errors = [];

    if (empty($projectType)) {
        $errors[] = 'Project type is required';
    }

    if (!$budget || $budget < 0) {
        $errors[] = 'Valid budget is required';
    }

    if (empty($fullName)) {
        $errors[] = 'Full name is required';
    }

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Valid email is required';
    }

    if (empty($phone)) {
        $errors[] = 'Phone number is required';
    }

    if (empty($city)) {
        $errors[] = 'City is required';
    }

    if (!empty($errors)) {
        $errorMessage = implode(', ', $errors);
        error_log("Quotation Validation Error: " . $errorMessage);
        error_log("POST Data: " . print_r($_POST, true));
        sendJSON(['success' => false, 'message' => $errorMessage], 400);
    }

    // Handle file upload if plans are provided
    $planFileName = null;
    if ($hasPlans === 'yes' && isset($_FILES['planFile']) && $_FILES['planFile']['error'] === UPLOAD_ERR_OK) {
        $file = $_FILES['planFile'];
        $fileName = $file['name'];
        $fileSize = $file['size'];
        $fileTmpName = $file['tmp_name'];
        $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        // Validate file
        if ($fileSize > MAX_FILE_SIZE) {
            sendJSON(['success' => false, 'message' => 'File size exceeds 10MB limit'], 400);
        }

        if (!in_array($fileExt, ALLOWED_EXTENSIONS)) {
            sendJSON(['success' => false, 'message' => 'Invalid file type. Only PDF, JPG, PNG allowed'], 400);
        }

        // Generate unique filename
        $planFileName = uniqid('plan_', true) . '.' . $fileExt;
        $uploadPath = UPLOAD_DIR . $planFileName;

        if (!move_uploaded_file($fileTmpName, $uploadPath)) {
            sendJSON(['success' => false, 'message' => 'Failed to upload file'], 500);
        }
    }

    // Insert into database
    $conn = getDBConnection();
    
    $sql = "INSERT INTO quotations (
        project_type, budget, has_plans, plan_file, start_date, 
        full_name, email, phone, city, consultation, status
    ) VALUES (
        :project_type, :budget, :has_plans, :plan_file, :start_date,
        :full_name, :email, :phone, :city, :consultation, 'pending'
    )";

    $stmt = $conn->prepare($sql);
    $result = $stmt->execute([
        ':project_type' => $projectType,
        ':budget' => $budget,
        ':has_plans' => $hasPlans,
        ':plan_file' => $planFileName,
        ':start_date' => $startDate ?: null,
        ':full_name' => $fullName,
        ':email' => $email,
        ':phone' => $phone,
        ':city' => $city,
        ':consultation' => $consultation
    ]);

    if ($result) {
        $quotationId = $conn->lastInsertId();
        
        // Optional: Send email notification (uncomment and configure)
        // sendEmailNotification($email, $fullName, $quotationId);
        
        sendJSON([
            'success' => true,
            'message' => 'Quotation submitted successfully! We will contact you within 24 hours.',
            'quotationId' => $quotationId
        ], 201);
    } else {
        sendJSON(['success' => false, 'message' => 'Failed to save quotation'], 500);
    }

} catch (Exception $e) {
    error_log("Quotation Submission Error: " . $e->getMessage());
    sendJSON(['success' => false, 'message' => 'An error occurred. Please try again later.'], 500);
}

/**
 * Optional: Send email notification
 */
function sendEmailNotification($to, $name, $quotationId) {
    $subject = "Quotation Request Received - #" . $quotationId;
    $message = "Dear $name,\n\n";
    $message .= "Thank you for your quotation request. We have received your details and will contact you within 24 hours.\n\n";
    $message .= "Quotation ID: #$quotationId\n\n";
    $message .= "Best regards,\n" . SITE_NAME;
    
    $headers = "From: " . ADMIN_EMAIL . "\r\n";
    $headers .= "Reply-To: " . ADMIN_EMAIL . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // Uncomment to actually send email
    // mail($to, $subject, $message, $headers);
}
