# API

Base URL: `/api`

## GET /api/demo/overview
Returns aggregates for traffic light cards.

## GET /api/demo/recommendations
Returns 3 present actions to apply.

## POST /api/demo/forecast
Body:
```json
{ "budget": 1000, "audience": "retarget", "time": "08:00-20:00", "bid": 50, "format": "reels" }
```
Response:
```json
{ "revenue": 320, "orders": 12, "roi": 0.2, "ci": { "low": 270, "high": 380 } }
```

## GET /api/demo/creatives
Returns creative previews with tags and metrics.

## POST /api/audit/upload-csv
Multipart `file` field with CSV. Returns 3 problems and 3 actions plus summary.

## POST /api/report/pdf
Body contains `summary`, `top`, `flop`, `recommendations`. Returns a PDF.


