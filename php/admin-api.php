<?php
/**
 * Admin API - Handles all admin dashboard requests
 */

require_once 'config.php';

// Start session
session_start();

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Get request details
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Handle preflight requests
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // Route requests
    switch ($action) {
        case 'login':
            handleLogin();
            break;
        case 'logout':
            handleLogout();
            break;
        case 'check-auth':
            checkAuth();
            break;
        case 'get-quotations':
            getQuotations();
            break;
        case 'get-quotation':
            getQuotation();
            break;
        case 'update-status':
            updateStatus();
            break;
        case 'add-note':
            addNote();
            break;
        case 'delete-quotation':
            deleteQuotation();
            break;
        case 'get-stats':
            getStats();
            break;
        default:
            sendJSON(['success' => false, 'message' => 'Invalid action'], 400);
    }
} catch (Exception $e) {
    error_log("Admin API Error: " . $e->getMessage());
    sendJSON(['success' => false, 'message' => $e->getMessage()], 500);
}

// ==================== AUTHENTICATION ====================

function handleLogin() {
    global $method;
    
    if ($method !== 'POST') {
        sendJSON(['success' => false, 'message' => 'Invalid request method'], 405);
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $username = sanitizeInput($input['username'] ?? '');
    $password = $input['password'] ?? '';

    error_log("Login attempt - Username: " . $username);
    error_log("Login attempt - Password provided: " . (!empty($password) ? 'yes' : 'no'));

    if (empty($username) || empty($password)) {
        error_log("Login failed - Empty credentials");
        sendJSON(['success' => false, 'message' => 'Username and password required'], 400);
    }

    $conn = getDBConnection();
    $stmt = $conn->prepare("SELECT id, username, password, full_name, email FROM admin_users WHERE username = :username");
    $stmt->execute([':username' => $username]);
    $user = $stmt->fetch();

    if (!$user) {
        error_log("Login failed - User not found: " . $username);
        sendJSON(['success' => false, 'message' => 'Invalid credentials'], 401);
    }

    error_log("User found - Verifying password...");
    if (!password_verify($password, $user['password'])) {
        error_log("Login failed - Password verification failed for user: " . $username);
        sendJSON(['success' => false, 'message' => 'Invalid credentials'], 401);
    }

    error_log("Login successful for user: " . $username);

    // Set session
    $_SESSION[ADMIN_SESSION_NAME] = [
        'id' => $user['id'],
        'username' => $user['username'],
        'full_name' => $user['full_name'],
        'email' => $user['email'],
        'login_time' => time()
    ];

    // Update last login
    $stmt = $conn->prepare("UPDATE admin_users SET last_login = NOW() WHERE id = :id");
    $stmt->execute([':id' => $user['id']]);

    sendJSON([
        'success' => true,
        'message' => 'Login successful',
        'user' => [
            'username' => $user['username'],
            'full_name' => $user['full_name'],
            'email' => $user['email']
        ]
    ]);
}

function handleLogout() {
    session_destroy();
    sendJSON(['success' => true, 'message' => 'Logged out successfully']);
}

function checkAuth() {
    if (!isAuthenticated()) {
        sendJSON(['success' => false, 'authenticated' => false], 401);
    }
    
    sendJSON([
        'success' => true,
        'authenticated' => true,
        'user' => $_SESSION[ADMIN_SESSION_NAME]
    ]);
}

function isAuthenticated() {
    if (!isset($_SESSION[ADMIN_SESSION_NAME])) {
        return false;
    }

    // Check session timeout
    $loginTime = $_SESSION[ADMIN_SESSION_NAME]['login_time'] ?? 0;
    if (time() - $loginTime > SESSION_TIMEOUT) {
        session_destroy();
        return false;
    }

    return true;
}

function requireAuth() {
    if (!isAuthenticated()) {
        sendJSON(['success' => false, 'message' => 'Unauthorized'], 401);
    }
}

// ==================== QUOTATIONS ====================

function getQuotations() {
    requireAuth();

    $status = $_GET['status'] ?? 'all';
    $search = $_GET['search'] ?? '';
    $page = max(1, intval($_GET['page'] ?? 1));
    $limit = min(100, max(10, intval($_GET['limit'] ?? 20)));
    $offset = ($page - 1) * $limit;

    $conn = getDBConnection();

    // Build query
    $where = [];
    $params = [];

    if ($status !== 'all') {
        $where[] = 'status = :status';
        $params[':status'] = $status;
    }

    if (!empty($search)) {
        $where[] = '(full_name LIKE :search OR email LIKE :search OR phone LIKE :search OR city LIKE :search)';
        $params[':search'] = "%$search%";
    }

    $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

    // Get total count
    $countSql = "SELECT COUNT(*) as total FROM quotations $whereClause";
    $countStmt = $conn->prepare($countSql);
    $countStmt->execute($params);
    $total = $countStmt->fetch()['total'];

    // Get quotations
    $sql = "SELECT * FROM quotations $whereClause ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
    $stmt = $conn->prepare($sql);
    
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    
    $stmt->execute();
    $quotations = $stmt->fetchAll();

    sendJSON([
        'success' => true,
        'data' => $quotations,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'pages' => ceil($total / $limit)
        ]
    ]);
}

function getQuotation() {
    requireAuth();

    $id = intval($_GET['id'] ?? 0);
    if ($id <= 0) {
        sendJSON(['success' => false, 'message' => 'Invalid quotation ID'], 400);
    }

    $conn = getDBConnection();
    $stmt = $conn->prepare("SELECT * FROM quotations WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $quotation = $stmt->fetch();

    if (!$quotation) {
        sendJSON(['success' => false, 'message' => 'Quotation not found'], 404);
    }

    sendJSON(['success' => true, 'data' => $quotation]);
}

function updateStatus() {
    requireAuth();
    global $method;

    if ($method !== 'POST') {
        sendJSON(['success' => false, 'message' => 'Invalid request method'], 405);
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $id = intval($input['id'] ?? 0);
    $status = sanitizeInput($input['status'] ?? '');

    $validStatuses = ['pending', 'contacted', 'quoted', 'completed', 'cancelled'];
    if (!in_array($status, $validStatuses)) {
        sendJSON(['success' => false, 'message' => 'Invalid status'], 400);
    }

    $conn = getDBConnection();
    $stmt = $conn->prepare("UPDATE quotations SET status = :status WHERE id = :id");
    $result = $stmt->execute([':status' => $status, ':id' => $id]);

    if (!$result) {
        sendJSON(['success' => false, 'message' => 'Failed to update status'], 500);
    }

    sendJSON(['success' => true, 'message' => 'Status updated successfully']);
}

function addNote() {
    requireAuth();
    global $method;

    if ($method !== 'POST') {
        sendJSON(['success' => false, 'message' => 'Invalid request method'], 405);
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $id = intval($input['id'] ?? 0);
    $note = sanitizeInput($input['note'] ?? '');

    if (empty($note)) {
        sendJSON(['success' => false, 'message' => 'Note cannot be empty'], 400);
    }

    $conn = getDBConnection();
    $stmt = $conn->prepare("UPDATE quotations SET notes = :note WHERE id = :id");
    $result = $stmt->execute([':note' => $note, ':id' => $id]);

    if (!$result) {
        sendJSON(['success' => false, 'message' => 'Failed to add note'], 500);
    }

    sendJSON(['success' => true, 'message' => 'Note added successfully']);
}

function deleteQuotation() {
    requireAuth();
    global $method;

    if ($method !== 'DELETE' && $method !== 'POST') {
        sendJSON(['success' => false, 'message' => 'Invalid request method'], 405);
    }

    $id = intval($_GET['id'] ?? $_POST['id'] ?? 0);
    if ($id <= 0) {
        sendJSON(['success' => false, 'message' => 'Invalid quotation ID'], 400);
    }

    $conn = getDBConnection();
    
    // Get file name before deleting
    $stmt = $conn->prepare("SELECT plan_file FROM quotations WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $quotation = $stmt->fetch();

    // Delete file if exists
    if ($quotation && $quotation['plan_file']) {
        $filePath = UPLOAD_DIR . $quotation['plan_file'];
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }

    // Delete from database
    $stmt = $conn->prepare("DELETE FROM quotations WHERE id = :id");
    $result = $stmt->execute([':id' => $id]);

    if (!$result) {
        sendJSON(['success' => false, 'message' => 'Failed to delete quotation'], 500);
    }

    sendJSON(['success' => true, 'message' => 'Quotation deleted successfully']);
}

function getStats() {
    requireAuth();

    $conn = getDBConnection();

    // Total quotations
    $totalStmt = $conn->query("SELECT COUNT(*) as total FROM quotations");
    $total = $totalStmt->fetch()['total'];

    // By status
    $statusStmt = $conn->query("
        SELECT status, COUNT(*) as count 
        FROM quotations 
        GROUP BY status
    ");
    $byStatus = $statusStmt->fetchAll(PDO::FETCH_KEY_PAIR);

    // Recent quotations (last 7 days)
    $recentStmt = $conn->query("
        SELECT COUNT(*) as count 
        FROM quotations 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    ");
    $recentCount = $recentStmt->fetch()['count'];

    // Total budget value
    $budgetStmt = $conn->query("SELECT SUM(budget) as total FROM quotations");
    $totalBudget = $budgetStmt->fetch()['total'] ?? 0;

    sendJSON([
        'success' => true,
        'stats' => [
            'total' => $total,
            'pending' => $byStatus['pending'] ?? 0,
            'contacted' => $byStatus['contacted'] ?? 0,
            'quoted' => $byStatus['quoted'] ?? 0,
            'completed' => $byStatus['completed'] ?? 0,
            'cancelled' => $byStatus['cancelled'] ?? 0,
            'recent' => $recentCount,
            'totalBudget' => $totalBudget
        ]
    ]);
}
