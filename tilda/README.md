# Tilda Widget Integration

This directory contains the embed.js widget for integrating AdsRays campaigns into Tilda websites.

## Usage

### Basic Usage (with fallback data)

```html
<div id="adsr-root"></div>
<script src="https://your-domain.com/tilda/embed.js" data-root="adsr-root"></script>
```

### Usage with API Integration

```html
<div id="adsr-root"></div>
<script src="https://your-domain.com/tilda/embed.js" 
        data-root="adsr-root" 
        data-api="https://your-api-domain.com"></script>
```

## Attributes

- `data-root` (required): ID of the container element where the widget will be rendered
- `data-api` (optional): Base URL of the API server. If provided, campaigns will be fetched from `{data-api}/api/campaigns`

## API Endpoint

The widget expects the API to return campaigns in the following format:

```json
[
  {
    "id": "cmp-1",
    "name": "Campaign Name",
    "status": "ACTIVE",
    "creatives": 2
  }
]
```

### Required Fields

- `name` (string): Campaign name to display
- `creatives` (number): Number of creatives in the campaign

### Optional Fields

- `id` (string): Campaign identifier
- `status` (string): Campaign status (e.g., "ACTIVE", "PAUSED")

## Fallback Behavior

If the API is unavailable or `data-api` is not provided, the widget will use hardcoded test data:

- Тестовая рекламная кампания № 1 (2 creatives)
- Тестовая рекламная кампания № 2 (2 creatives)
- Тестовая рекламная кампания № 3 (2 creatives)

## Features

- Automatic CORS support (API should return appropriate CORS headers)
- Graceful degradation with fallback data
- Interactive expand/collapse functionality
- Keyboard accessible (Enter/Space keys)
- Responsive design
