<?php
/**
 * Setup Wizard for Midnight Construction Database Integration
 * Run this file once to set up the system
 */

// Prevent running in production
if (isset($_SERVER['HTTP_HOST']) && !in_array($_SERVER['HTTP_HOST'], ['localhost', 'localhost:8000', '127.0.0.1', '127.0.0.1:8000', '[::1]:8000', '::1'])) {
    die('Setup wizard can only be run on localhost');
}

$step = $_GET['step'] ?? 1;
$errors = [];
$success = [];

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Setup Wizard - Midnight Construction</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #3d4a7d 0%, #8bb58f 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        .container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            max-width: 600px;
            width: 100%;
            padding: 3rem;
        }
        h1 {
            color: #3d4a7d;
            margin-bottom: 1rem;
            font-size: 2rem;
        }
        .step-indicator {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 2rem;
        }
        .step {
            flex: 1;
            height: 4px;
            background: #e0e0e0;
            border-radius: 2px;
        }
        .step.active { background: #3d4a7d; }
        .step.completed { background: #8bb58f; }
        .form-group {
            margin-bottom: 1.5rem;
        }
        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: #333;
        }
        input, textarea {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 1rem;
        }
        input:focus, textarea:focus {
            outline: none;
            border-color: #3d4a7d;
        }
        .btn {
            padding: 0.875rem 2rem;
            background: #3d4a7d;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
        }
        .btn:hover { background: #2d3a5d; }
        .success {
            background: #d1e7dd;
            color: #0f5132;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
        }
        .error {
            background: #f8d7da;
            color: #842029;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
        }
        .info {
            background: #cff4fc;
            color: #055160;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
        }
        ul { margin-left: 1.5rem; margin-top: 0.5rem; }
        code {
            background: #f5f5f5;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-family: monospace;
        }
        .checklist { list-style: none; margin-left: 0; }
        .checklist li { padding: 0.5rem 0; }
        .checklist li:before { content: "✓ "; color: #8bb58f; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔧 Setup Wizard</h1>
        <p style="color: #666; margin-bottom: 2rem;">Midnight Construction Database Integration</p>

        <div class="step-indicator">
            <div class="step <?= $step >= 1 ? 'active' : '' ?>"></div>
            <div class="step <?= $step >= 2 ? 'active' : '' ?>"></div>
            <div class="step <?= $step >= 3 ? 'active' : '' ?>"></div>
            <div class="step <?= $step >= 4 ? 'active' : '' ?>"></div>
        </div>

        <?php if ($step == 1): ?>
            <h2 style="color: #3d4a7d; margin-bottom: 1rem;">Step 1: Prerequisites Check</h2>
            
            <?php
            $php_version = phpversion();
            $php_ok = version_compare($php_version, '7.4.0', '>=');
            
            $extensions = ['pdo', 'pdo_mysql', 'json', 'fileinfo'];
            $ext_status = [];
            foreach ($extensions as $ext) {
                $ext_status[$ext] = extension_loaded($ext);
            }
            
            $all_ok = $php_ok && !in_array(false, $ext_status);
            ?>

            <div class="<?= $all_ok ? 'success' : 'error' ?>">
                <strong>System Requirements:</strong>
                <ul class="checklist">
                    <li>PHP Version: <?= $php_version ?> <?= $php_ok ? '✓' : '✗ (Requires 7.4+)' ?></li>
                    <?php foreach ($ext_status as $ext => $loaded): ?>
                        <li><?= $ext ?>: <?= $loaded ? '✓' : '✗ Not Loaded' ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>

            <div class="info">
                <strong>Before proceeding, ensure:</strong>
                <ul>
                    <li>MySQL/MariaDB server is running</li>
                    <li>You have database administrator credentials</li>
                    <li>You know your database host (usually localhost)</li>
                </ul>
            </div>

            <?php if ($all_ok): ?>
                <a href="?step=2" class="btn">Next: Database Configuration →</a>
            <?php else: ?>
                <p style="color: #842029; margin-top: 1rem;">Please install required PHP extensions and try again.</p>
            <?php endif; ?>

        <?php elseif ($step == 2): ?>
            <h2 style="color: #3d4a7d; margin-bottom: 1rem;">Step 2: Database Configuration</h2>

            <?php
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $db_host = $_POST['db_host'] ?? 'localhost';
                $db_name = $_POST['db_name'] ?? 'midnight_construction';
                $db_user = $_POST['db_user'] ?? 'root';
                $db_pass = $_POST['db_pass'] ?? '';

                try {
                    $dsn = "mysql:host=$db_host";
                    $pdo = new PDO($dsn, $db_user, $db_pass);
                    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

                    // Create database
                    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$db_name` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
                    
                    // Connect to new database
                    $pdo->exec("USE `$db_name`");
                    
                    // Read and execute SQL file
                    $sql = file_get_contents(__DIR__ . '/../database/setup.sql');
                    $sql = str_replace('CREATE DATABASE IF NOT EXISTS midnight_construction;', '', $sql);
                    $sql = str_replace('USE midnight_construction;', '', $sql);
                    
                    // Execute SQL statements
                    $pdo->exec($sql);

                    // Update config file
                    $config = file_get_contents(__DIR__ . '/config.php');
                    $config = preg_replace("/define\('DB_HOST', '.*?'\);/", "define('DB_HOST', '$db_host');", $config);
                    $config = preg_replace("/define\('DB_NAME', '.*?'\);/", "define('DB_NAME', '$db_name');", $config);
                    $config = preg_replace("/define\('DB_USER', '.*?'\);/", "define('DB_USER', '$db_user');", $config);
                    $config = preg_replace("/define\('DB_PASS', '.*?'\);/", "define('DB_PASS', '$db_pass');", $config);
                    file_put_contents(__DIR__ . '/config.php', $config);

                    echo '<div class="success"><strong>Success!</strong> Database created and configured.</div>';
                    echo '<a href="?step=3" class="btn">Next: Create Directories →</a>';

                } catch (Exception $e) {
                    echo '<div class="error"><strong>Error:</strong> ' . htmlspecialchars($e->getMessage()) . '</div>';
                }
            }
            ?>

            <form method="POST">
                <div class="form-group">
                    <label>Database Host:</label>
                    <input type="text" name="db_host" value="localhost" required>
                </div>
                <div class="form-group">
                    <label>Database Name:</label>
                    <input type="text" name="db_name" value="midnight_construction" required>
                </div>
                <div class="form-group">
                    <label>Database Username:</label>
                    <input type="text" name="db_user" value="root" required>
                </div>
                <div class="form-group">
                    <label>Database Password:</label>
                    <input type="password" name="db_pass">
                </div>
                <button type="submit" class="btn">Create Database</button>
            </form>

        <?php elseif ($step == 3): ?>
            <h2 style="color: #3d4a7d; margin-bottom: 1rem;">Step 3: Directory Setup</h2>

            <?php
            $dirs = [
                __DIR__ . '/uploads' => 'Uploads directory for plan files',
                __DIR__ . '/logs' => 'Logs directory for errors'
            ];

            $all_created = true;
            foreach ($dirs as $dir => $desc) {
                if (!file_exists($dir)) {
                    if (@mkdir($dir, 0755, true)) {
                        echo "<div class='success'>✓ Created: $desc</div>";
                    } else {
                        echo "<div class='error'>✗ Failed to create: $desc<br>Please create manually: $dir</div>";
                        $all_created = false;
                    }
                } else {
                    echo "<div class='info'>✓ Already exists: $desc</div>";
                }
            }

            // Create .htaccess for uploads
            $htaccess = __DIR__ . '/uploads/.htaccess';
            if (!file_exists($htaccess)) {
                file_put_contents($htaccess, "Options -Indexes\n");
            }
            ?>

            <?php if ($all_created): ?>
                <a href="?step=4" class="btn" style="margin-top: 1rem;">Next: Complete Setup →</a>
            <?php endif; ?>

        <?php elseif ($step == 4): ?>
            <h2 style="color: #3d4a7d; margin-bottom: 1rem;">🎉 Setup Complete!</h2>

            <div class="success">
                <strong>Your system is ready to use!</strong>
            </div>

            <div class="info">
                <strong>Default Admin Credentials:</strong>
                <ul>
                    <li>Username: <code>admin</code></li>
                    <li>Password: <code>admin123</code></li>
                </ul>
                <p style="margin-top: 0.5rem;"><strong>⚠️ Change these immediately after first login!</strong></p>
            </div>

            <div style="margin-top: 2rem;">
                <h3 style="margin-bottom: 1rem;">Next Steps:</h3>
                <ul style="line-height: 1.8;">
                    <li>Access the <a href="../html/admin-dashboard.html" style="color: #3d4a7d;">Admin Dashboard</a></li>
                    <li>Test the <a href="../html/get-quotation.html" style="color: #3d4a7d;">Quotation Form</a></li>
                    <li>Change default admin password</li>
                    <li>Configure email notifications (optional)</li>
                    <li>Review security settings in config.php</li>
                    <li><strong>Delete this setup.php file for security</strong></li>
                </ul>
            </div>

            <div style="margin-top: 2rem;">
                <a href="../html/admin-dashboard.html" class="btn">Go to Admin Dashboard →</a>
            </div>

        <?php endif; ?>

        <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 0.9rem;">
            Need help? Check <a href="../docs/DATABASE_SETUP.md" style="color: #3d4a7d;">DATABASE_SETUP.md</a>
        </div>
    </div>
</body>
</html>
