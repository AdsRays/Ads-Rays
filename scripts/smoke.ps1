$ErrorActionPreference="Stop"
$base = $env:VITE_API_BASE
if (-not $base) { $base = "http://localhost:4050" }

# Health (не во всех билдах есть, поэтому мягко)
try { Invoke-RestMethod "$base/healthz" -Method Get | Out-Null } catch {}

# GET
Invoke-WebRequest "$base/api/report/pdf" -OutFile "$PSScriptRoot\smoke-get.pdf" -UseBasicParsing | Out-Null
$h = Get-Content "$PSScriptRoot\smoke-get.pdf" -Encoding Byte -TotalCount 4
if (!($h[0]-eq0x25 -and $h[1]-eq0x50 -and $h[2]-eq0x44 -and $h[3]-eq0x46)) { throw "GET: not %PDF" }

# POST
Invoke-WebRequest "$base/api/report/pdf" -Method Post -OutFile "$PSScriptRoot\smoke-post.pdf" -UseBasicParsing | Out-Null
$h = Get-Content "$PSScriptRoot\smoke-post.pdf" -Encoding Byte -TotalCount 4
if (!($h[0]-eq0x25 -and $h[1]-eq0x50 -and $h[2]-eq0x44 -and $h[3]-eq0x46)) { throw "POST: not %PDF" }

"OK: smoke passed on $base"
