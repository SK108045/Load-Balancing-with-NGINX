$totalRequests = 60

for ($i = 1; $i -le $totalRequests; $i++) {
    Write-Host "Request $i"
    curl.exe http://localhost:8080
    Write-Host "`n"
}
