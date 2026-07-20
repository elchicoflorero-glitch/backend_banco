Write-Host "=== OpenSSL Configuration Check ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Checking Node.js and npm versions:" -ForegroundColor Green
node --version
npm --version
Write-Host ""

Write-Host "2. Checking Prisma installation:" -ForegroundColor Green
if (Test-Path "node_modules/.prisma") {
    Write-Host "✓ Prisma is installed" -ForegroundColor Green
    Get-ChildItem "node_modules/.prisma/client/" -ErrorAction SilentlyContinue | 
        Where-Object { $_.Name -like "*.node" } | 
        ForEach-Object { Write-Host "  - $($_.Name)" }
} else {
    Write-Host "✗ Prisma not found - run: npm run prisma:generate" -ForegroundColor Red
}
Write-Host ""

Write-Host "3. Checking environment variables:" -ForegroundColor Green
Write-Host "NODE_ENV: $($env:NODE_ENV -or 'not set')"
Write-Host "PRISMA_CLI_BINARY_TARGETS: $($env:PRISMA_CLI_BINARY_TARGETS -or 'not set')"
Write-Host ""

Write-Host "4. Checking package.json scripts:" -ForegroundColor Green
Write-Host "Available scripts:"
$package = Get-Content "package.json" | ConvertFrom-Json
$package.scripts | Get-Member -MemberType NoteProperty | 
    ForEach-Object { Write-Host "  - $($_.Name)" }
Write-Host ""

Write-Host "5. Docker Build Instructions:" -ForegroundColor Green
Write-Host "To test locally with Docker:"
Write-Host "  docker build -f Dockerfile -t banco-peru-backend:test ."
Write-Host ""

Write-Host "6. Checking for build requirements:" -ForegroundColor Green
$buildRequirements = @(
    @{name = "Python"; cmd = "python --version"},
    @{name = "Git"; cmd = "git --version"}
)

foreach ($req in $buildRequirements) {
    try {
        $version = & cmd /c $req.cmd 2>&1
        Write-Host "  ✓ $($req.name): $version" -ForegroundColor Green
    } catch {
        Write-Host "  ✗ $($req.name): Not found" -ForegroundColor Red
    }
}
Write-Host ""

Write-Host "=== Troubleshooting Steps ===" -ForegroundColor Yellow
Write-Host "1. If Prisma fails during build:"
Write-Host "   npm run prisma:generate"
Write-Host ""
Write-Host "2. If Docker build fails:"
Write-Host "   docker system prune -a"
Write-Host "   docker build --no-cache -f Dockerfile -t banco-peru-backend:test ."
Write-Host ""
Write-Host "3. For Railway deployment:"
Write-Host "   - Ensure Dockerfile has: RUN apk add --no-cache openssl1.1-compat"
Write-Host "   - Check railway.toml is present"
Write-Host "   - Commit and push to trigger Railway deployment"
