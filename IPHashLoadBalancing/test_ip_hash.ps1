$ips = @("192.168.1.1", "192.168.1.2", "192.168.1.3", "192.168.1.4", "192.168.1.5")
foreach ($ip in $ips) {
    $random = Get-Random -Minimum 1 -Maximum 255
    $testIP = "192.168.$random.$random"
    Write-Host "Testing with IP: $testIP"
    curl.exe --resolve localhost:8080:127.0.0.1 -H "X-Forwarded-For: $testIP" http://localhost:8080
    Write-Host "`n"
}



