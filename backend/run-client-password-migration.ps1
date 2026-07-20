# Script to run the client password migration
# This adds the password column to the clients table

param(
    [string]$DatabaseUrl = $env:DATABASE_URL
)

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Client Password Migration" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

if (-not $DatabaseUrl) {
    Write-Host "DATABASE_URL not set in environment. Using .env file..." -ForegroundColor Yellow
    Get-Content .env | ForEach-Object {
        if ($_ -match "^DATABASE_URL=(.+)$") {
            $DatabaseUrl = $matches[1]
        }
    }
}

if (-not $DatabaseUrl) {
    Write-Host "Error: DATABASE_URL not found" -ForegroundColor Red
    exit 1
}

Write-Host "Database URL: $($DatabaseUrl -replace 'password=[^@]*', 'password=***')" -ForegroundColor Gray

# Run the migration using psql
Write-Host "`nExecuting migration..." -ForegroundColor Cyan

# Convert PostgreSQL URI to psql format
$Uri = [System.Uri]::new($DatabaseUrl)
$User = $Uri.UserInfo.Split(':')[0]
$Password = $Uri.UserInfo.Split(':')[1]
$Host = $Uri.Host
$Port = $Uri.Port
$Database = $Uri.LocalPath.TrimStart('/')

$env:PGPASSWORD = $Password

psql -h $Host -p $Port -U $User -d $Database -f prisma/add-password-to-clients.sql

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Migration completed successfully!" -ForegroundColor Green
} else {
    Write-Host "`n❌ Migration failed!" -ForegroundColor Red
    exit 1
}

# Clear password from environment
Remove-Item env:PGPASSWORD -ErrorAction SilentlyContinue

Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Update clients with passwords" -ForegroundColor Gray
Write-Host "2. Run 'npm start' to start the backend" -ForegroundColor Gray
Write-Host "3. Test login with client DNI and password" -ForegroundColor Gray
