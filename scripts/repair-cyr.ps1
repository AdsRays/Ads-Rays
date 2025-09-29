# ==== SETTINGS ====
$ROOT = "C:\Users\Alex\Desktop\adsrays-demo"
$BACKEND = Join-Path $ROOT "apps\backend"
$INDEX = Join-Path $BACKEND "src\index.ts"
$BAK   = Join-Path $BACKEND "src\index.ts.bak"
$FONT_DIR = Join-Path $ROOT "data\fonts"
$FONT_PATH = Join-Path $FONT_DIR "NotoSans-Regular.ttf"
$FONT_URL = "https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSans/NotoSans-Regular.ttf"

# ==== KILL BUSY PORTS (без конфликта с $PID) ====
$ports = 4000,5174
foreach ($port in $ports) {
  $pids = (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
          Select-Object -ExpandProperty OwningProcess -Unique)
  foreach ($procId in $pids) { try { taskkill /PID $procId /F | Out-Null } catch {} }
}
Get-Process -Name node,tsx -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# ==== PREPARE FONT FILE ====
New-Item -ItemType Directory -Force -Path $FONT_DIR | Out-Null
if (-not (Test-Path $FONT_PATH)) {
  Invoke-WebRequest -Uri $FONT_URL -OutFile $FONT_PATH -UseBasicParsing
}

# ==== ENSURE pdf-lib INSTALLED ====
pnpm --filter @adsrays/backend add pdf-lib | Out-Null

# ==== BACKUP ONCE ====
if (-not (Test-Path $BAK)) { Copy-Item $INDEX $BAK -Force }

# ==== LOAD FILE ====
$code = Get-Content $INDEX -Raw

# ==== IMPORTS (добавим, если отсутствуют) ====
if ($code -notmatch "from ['""]pdf-lib['""]") { $code = "import { PDFDocument, rgb } from 'pdf-lib';`r`n" + $code }
if ($code -notmatch "from ['""]fs['""]")      { $code = "import fs from 'fs';`r`n" + $code }
if ($code -notmatch "from ['""]path['""]")    { $code = "import path from 'path';`r`n" + $code }

# ==== ТЬ С ТЫ ЪЯ ШТ ====
$code = [regex]::Replace($code, "^\s*const\s+CYR_FONT_PATH\s*=.*\r?\n", "", "Multiline")
$code = [regex]::Replace($code, "^\s*const\s+CYR_FONT_BYTES\s*=.*\r?\n", "", "Multiline")

# ==== СТТЬ Ы   ШТ С Т ====
$fontBoot = @"
const CYR_FONT_PATH = path.join(__dirname, '../../data/fonts/NotoSans-Regular.ttf');
const CYR_FONT_BYTES = fs.readFileSync(CYR_FONT_PATH);
"@
# найдём позицию последнего import; если шрифт ещё не объявлен - вставим
if ($code -notmatch "CYR_FONT_PATH") {
  $code = [regex]::Replace($code, "((?:^import.*\r?\n)+)", "`$1$fontBoot`r`n", 1)
}

# ==== СЯТЬ СТЫ Т /api/report/pdf ====
$code = [regex]::Replace($code,
  "app\.post\(\s*['""]\/api\/report\/pdf['""][\s\S]*?\}\);\s*",
  "",
  [System.Text.RegularExpressions.RegexOptions]::Singleline)

# ==== ТЬ СТЫ Т ====
$handler = @"
app.post('/api/report/pdf', async (req, res) => {
  try {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.setTitle('роверка кириллицы - ривет, мир!');
    pdfDoc.setAuthor('AdsRays'); pdfDoc.setCreator('AdsRays'); pdfDoc.setProducer('AdsRays pdf-lib');

    const page = pdfDoc.addPage([595, 842]); // A4
    const font = await pdfDoc.embedFont(CYR_FONT_BYTES);
    const { height } = page.getSize();

    page.drawText('Hello World (English OK)', { x: 50, y: height - 100, size: 14, font, color: rgb(0,0,0) });
    page.drawText('роверка кириллицы: ривет, мир!', { x: 50, y: height - 120, size: 14, font, color: rgb(0,0,0) });

    const pdfBytes = await pdfDoc.save({ useObjectStreams: false });
    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (e) {
    console.error(e);
    res.status(500).send('PDF generation error');
  }
});
"@
$code = $code + "`r`n" + $handler + "`r`n"

# ==== ТТЬ app.listen(4000) ====
if ($code -notmatch "app\.listen\s*\(") {
  $code += @"
app.listen(4000, () => { console.log('API running on http://localhost:4000'); });
"@
}

# ==== SAVE ====
Set-Content -Encoding UTF8 $INDEX $code

# ==== START DEV ====
Start-Process powershell -ArgumentList "cd $ROOT; pnpm --filter @adsrays/backend dev"
Start-Process powershell -ArgumentList "cd $ROOT; pnpm --filter @adsrays/frontend dev -- --port 5174 --host 127.0.0.1"

Start-Sleep -Seconds 12

# ==== SMOKE TEST PDF ====
$testOut = Join-Path $ROOT "test-cyr.pdf"
Invoke-RestMethod -Uri http://localhost:4000/api/report/pdf -Method Post -OutFile $testOut

$head = Get-Content $testOut -Encoding Byte -TotalCount 4
if (!($head[0] -eq 0x25 -and $head[1] -eq 0x50 -and $head[2] -eq 0x44 -and $head[3] -eq 0x46)) { throw "айл не PDF (%PDF нет)" }

$bytes  = [IO.File]::ReadAllBytes($testOut)
$needle = [Text.Encoding]::BigEndianUnicode.GetBytes("ривет")
function ContainsBytes([byte[]]$hay,[byte[]]$ndl){
  for($i=0;$i -le $hay.Length-$ndl.Length;$i++){
    $ok=$true; for($j=0;$j -lt $ndl.Length;$j++){ if($hay[$i+$j] -ne $ndl[$j]){ $ok=$false; break } }
    if($ok){ return $true }
  }; return $false
}
if (-not (ContainsBytes $bytes $needle)) { throw "ириллица не найдена (ищем 'ривет' в UTF-16BE)" }
Write-Host "OK: PDF создан и содержит кириллицу." -ForegroundColor Green
