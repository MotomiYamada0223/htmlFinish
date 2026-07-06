$files = @(
    "js\constants.js",
    "js\blockPatterns.js",
    "js\pathfinder.js",
    "js\mapGenerator.js",
    "js\player.js",
    "js\enemyA.js",
    "js\enemyB.js",
    "js\uiManager.js",
    "js\main.js"
)

$output = "bundle.js"
$Utf8NoBomEncoding = New-Object System.Text.UTF8Encoding $False

[System.IO.File]::WriteAllText((Join-Path $PWD $output), "", $Utf8NoBomEncoding)

foreach ($file in $files) {
    $filePath = Join-Path $PWD $file
    $content = [System.IO.File]::ReadAllText($filePath, $Utf8NoBomEncoding)
    
    # Remove import statements
    $content = $content -replace '(?m)^import\s+.*$', ''
    # Remove export statements (keep the declaration)
    $content = $content -replace '(?m)^export\s+(const|let|var|class|function)', '$1'
    # Default exports
    $content = $content -replace '(?m)^export\s+default\s+(class|function)', '$1'
    
    [System.IO.File]::AppendAllText((Join-Path $PWD $output), "/* --- $file --- */`n", $Utf8NoBomEncoding)
    [System.IO.File]::AppendAllText((Join-Path $PWD $output), $content + "`n", $Utf8NoBomEncoding)
}

Write-Host "Bundle created: $output"
