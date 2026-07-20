# Test Withdrawals API
# This script tests the withdrawals endpoint

$baseUrl = "http://localhost:3010/api"
$token = "YOUR_JWT_TOKEN_HERE"  # Replace with actual token

# Headers
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Test: Get all accounts first (to get account numbers)
Write-Host "========== STEP 1: Get Accounts ==========" -ForegroundColor Cyan
$accountsResponse = Invoke-RestMethod -Uri "$baseUrl/accounts" -Method Get -Headers $headers
Write-Host "Accounts:" -ForegroundColor Green
$accountsResponse | ForEach-Object {
    Write-Host "  - Account: $($_.accountNumber) | Balance: S/. $($_.balance) | Currency: $($_.currency)"
}

# Extract first account for testing
$testAccount = $accountsResponse[0]
if (-not $testAccount) {
    Write-Host "No accounts found! Please create an account first." -ForegroundColor Red
    exit
}

# Test: Process a withdrawal
Write-Host "`n========== STEP 2: Process Withdrawal ==========" -ForegroundColor Cyan
$withdrawalAmount = 50.00
$withdrawalReason = "ATM Withdrawal"

$withdrawalPayload = @{
    accountNumber = $testAccount.accountNumber
    amount = $withdrawalAmount
    reason = $withdrawalReason
} | ConvertTo-Json

Write-Host "Withdrawal Request:" -ForegroundColor Yellow
Write-Host $withdrawalPayload

try {
    $withdrawalResponse = Invoke-RestMethod -Uri "$baseUrl/withdrawals" -Method Post -Headers $headers -Body $withdrawalPayload
    Write-Host "`nWithdrawal Response:" -ForegroundColor Green
    $withdrawalResponse | ConvertTo-Json | Write-Host
    $transactionId = $withdrawalResponse.transactionId
} catch {
    Write-Host "Error during withdrawal:" -ForegroundColor Red
    $errorResponse = $_.ErrorDetails.Message | ConvertFrom-Json
    Write-Host $errorResponse | ConvertTo-Json | Write-Host
    exit
}

# Test: Get withdrawal history
Write-Host "`n========== STEP 3: Get Withdrawal History ==========" -ForegroundColor Cyan
try {
    $historyResponse = Invoke-RestMethod -Uri "$baseUrl/withdrawals/history" -Method Get -Headers $headers
    Write-Host "Withdrawal History:" -ForegroundColor Green
    $historyResponse | ForEach-Object {
        Write-Host "  - ID: $($_.id) | Amount: S/. $($_.amount) | Type: $($_.type) | Date: $($_.createdAt)"
    }
} catch {
    Write-Host "Error fetching history:" -ForegroundColor Red
    $_.ErrorDetails.Message | Write-Host
}

# Test: Get accounts again to verify balance was updated
Write-Host "`n========== STEP 4: Verify Balance Update ==========" -ForegroundColor Cyan
$updatedAccountsResponse = Invoke-RestMethod -Uri "$baseUrl/accounts" -Method Get -Headers $headers
$updatedTestAccount = $updatedAccountsResponse | Where-Object { $_.accountNumber -eq $testAccount.accountNumber }
Write-Host "Updated Account:" -ForegroundColor Green
Write-Host "  - Account: $($updatedTestAccount.accountNumber) | Balance: S/. $($updatedTestAccount.balance) | Currency: $($updatedTestAccount.currency)"
Write-Host "  - Previous Balance: S/. $($testAccount.balance)" -ForegroundColor Yellow
Write-Host "  - Withdrawn Amount: S/. $withdrawalAmount" -ForegroundColor Yellow
Write-Host "  - Expected New Balance: S/. $([decimal]$testAccount.balance - [decimal]$withdrawalAmount)" -ForegroundColor Yellow

Write-Host "`n✅ Withdrawal test completed successfully!" -ForegroundColor Green
