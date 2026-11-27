param(
  [Parameter(Mandatory = $true)]
  [ValidateSet('api', 'web')]
  [string]$Service
)

$ErrorActionPreference = 'Continue'
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$logDirectory = Join-Path $repoRoot '.bridgesync-dev\logs'
New-Item -ItemType Directory -Path $logDirectory -Force | Out-Null
Set-Location -LiteralPath $repoRoot

if ($Service -eq 'api') {
  $serviceLabel = 'BridgeSync API (127.0.0.1:3001)'
  $logPath = Join-Path $logDirectory 'api.log'
  $command = 'dev:api'
} else {
  $serviceLabel = 'BridgeSync frontend (127.0.0.1:5181)'
  $logPath = Join-Path $logDirectory 'web.log'
  $command = 'dev:web'
}

$Host.UI.RawUI.WindowTitle = $serviceLabel
Write-Host "Starting $serviceLabel" -ForegroundColor Cyan
Write-Host "Repository: $repoRoot"
Write-Host "Log file: $logPath"

try {
  & npm.cmd run $command 2>&1 | Tee-Object -FilePath $logPath -Append
  $exitCode = $LASTEXITCODE
  if ($null -eq $exitCode) { $exitCode = 1 }
  Write-Host "$serviceLabel exited with code $exitCode." -ForegroundColor Red
} catch {
  Write-Host "$serviceLabel failed to start: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host 'This terminal is left open so startup output remains visible. Close it after reviewing the failure or stopping the service.' -ForegroundColor Yellow
Read-Host 'Press Enter to close this service terminal'
