param(
  [switch]$ApiOnly,
  [switch]$WebOnly
)

$ErrorActionPreference = 'Stop'
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$envPath = Join-Path $repoRoot '.env'
$runnerPath = Join-Path $PSScriptRoot 'run-service.ps1'

if ($ApiOnly -and $WebOnly) { throw 'Choose either -ApiOnly or -WebOnly, not both.' }
if (-not (Test-Path -LiteralPath $envPath)) { throw 'Local .env is missing. Copy .env.example to .env and configure it before starting BridgeSync.' }

function Read-LocalSetting([string]$name) {
  $line = Get-Content -LiteralPath $envPath | Where-Object { $_ -match "^\s*$([regex]::Escape($name))\s*=" } | Select-Object -First 1
  if (-not $line) { return $null }
  $value = ($line -replace '^\s*[^=]+=', '').Trim()
  return $value.Trim('"').Trim("'")
}

$origin = Read-LocalSetting 'APP_ORIGIN'
if ($origin -ne 'http://127.0.0.1:5181') { throw 'APP_ORIGIN must be http://127.0.0.1:5181 so sign-in requests match the Vite origin.' }
$configuredPort = Read-LocalSetting 'PORT'
if ($configuredPort -and $configuredPort -ne '3001') { throw 'PORT must be 3001 for the local BridgeSync API.' }

$services = if ($ApiOnly) { @(@{ Name = 'api'; Port = 3001 }) }
  elseif ($WebOnly) { @(@{ Name = 'web'; Port = 5181 }) }
  else { @(@{ Name = 'api'; Port = 3001 }, @{ Name = 'web'; Port = 5181 }) }

foreach ($service in $services) {
  $listener = Get-NetTCPConnection -State Listen -LocalPort $service.Port -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($listener) { throw "Port $($service.Port) is already occupied (PID $($listener.OwningProcess)). No process was stopped. Close or inspect that process, then retry." }
}

$windowsPowerShell = Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe'
$started = @()
foreach ($service in $services) {
  $arguments = "-NoProfile -ExecutionPolicy RemoteSigned -File `"$runnerPath`" -Service $($service.Name)"
  $terminal = Start-Process -FilePath $windowsPowerShell -ArgumentList $arguments -WorkingDirectory $repoRoot -PassThru -WindowStyle Normal
  $started += [pscustomobject]@{ Service = $service.Name; Port = $service.Port; TerminalPid = $terminal.Id }
  Write-Host "Opened persistent $($service.Name) terminal (PID $($terminal.Id)); target port $($service.Port)." -ForegroundColor Green
}

function Wait-ForHttp([string]$url, [int]$timeoutSeconds) {
  $deadline = (Get-Date).AddSeconds($timeoutSeconds)
  do {
    try {
      $response = Invoke-WebRequest -Uri $url -TimeoutSec 3 -UseBasicParsing
      if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300) { return $response }
    } catch { }
    Start-Sleep -Seconds 1
  } while ((Get-Date) -lt $deadline)
  return $null
}

foreach ($service in $services) {
  if ($service.Name -eq 'api') {
    $response = Wait-ForHttp 'http://127.0.0.1:3001/api/health' 45
    if (-not $response) { throw 'API did not become healthy within 45 seconds. Check the open API terminal and .bridgesync-dev/logs/api.log. The API waits for Atlas connectivity before listening.' }
    Write-Host 'API is healthy at http://127.0.0.1:3001/api/health (MongoDB connection succeeded before listen).' -ForegroundColor Green
  } else {
    $response = Wait-ForHttp 'http://127.0.0.1:5181/' 25
    if (-not $response) { throw 'Frontend did not respond within 25 seconds. Check the open frontend terminal and .bridgesync-dev/logs/web.log.' }
    Write-Host 'Frontend is responding at http://127.0.0.1:5181/.' -ForegroundColor Green
  }
}

Write-Host 'Keep the service terminals open. Close a service terminal (or press Ctrl+C there) to stop that service; rerun npm run dev:all to restart both.' -ForegroundColor Cyan
