<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Midnight Construction - Setup</title>
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
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            max-width: 600px;
            width: 100%;
            padding: 3rem;
            text-align: center;
        }
        h1 {
            color: #3d4a7d;
            margin-bottom: 1rem;
            font-size: 2.5rem;
        }
        .icon {
            font-size: 4rem;
            margin-bottom: 1rem;
        }
        p {
            color: #666;
            margin-bottom: 2rem;
            font-size: 1.1rem;
            line-height: 1.6;
        }
        .links {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-top: 2rem;
        }
        a {
            padding: 1rem 2rem;
            background: #3d4a7d;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
        a:hover {
            background: #2d3a5d;
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        }
        a.secondary {
            background: #8bb58f;
        }
        a.secondary:hover {
            background: #7aa57f;
        }
        a.tertiary {
            background: #ff6b35;
        }
        a.tertiary:hover {
            background: #e55a25;
        }
        .status {
            background: #d1e7dd;
            color: #0f5132;
            padding: 0.75rem;
            border-radius: 8px;
            margin-bottom: 2rem;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">🏗️</div>
        <h1>Midnight Construction</h1>
        <p>Database Integration System</p>
        
        <div class="status">
            ✓ Server Running on Port 8000
        </div>

        <p>Choose where you want to go:</p>

        <div class="links">
            <a href="/php/setup.php">
                <span>🔧</span>
                <span>Setup Wizard (Start Here)</span>
            </a>
            
            <a href="/html/admin-dashboard.html" class="secondary">
                <span>📊</span>
                <span>Admin Dashboard</span>
            </a>
            
            <a href="/html/get-quotation.html" class="tertiary">
                <span>📝</span>
                <span>Customer Quotation Form</span>
            </a>
        </div>

        <p style="margin-top: 2rem; font-size: 0.9rem; color: #999;">
            First time? Run the Setup Wizard to configure the database.
        </p>
    </div>
</body>
</html>
