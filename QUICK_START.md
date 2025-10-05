# Quick Start: Tilda Widget Integration

## For Tilda Users

Add this to your Tilda page to display campaigns:

```html
<div id="adsr-root"></div>
<script src="https://your-domain.com/tilda/embed.js" 
        data-root="adsr-root" 
        data-api="https://your-api-domain.com"></script>
```

That's it! The widget will automatically fetch campaigns from your API.

## For Developers

### Start the Backend

```bash
cd apps/backend
pnpm install
pnpm run build
pnpm run start
```

The API will be available at `http://localhost:4050`

### Test the API

```bash
curl http://localhost:4050/api/campaigns
```

Expected response:
```json
[
  {
    "id": "cmp-1",
    "name": "Тестовая кампания 1",
    "status": "ACTIVE",
    "creatives": 2
  },
  {
    "id": "cmp-2",
    "name": "Тестовая кампания 2",
    "status": "PAUSED",
    "creatives": 2
  }
]
```

### Run Tests

```bash
cd apps/backend
pnpm run test
```

### View Example

Open `tilda/example.html` in a browser (with backend running) to see both:
- Widget with API integration
- Widget with fallback data

## Troubleshooting

**Widget shows "Тестовая рекламная кампания" instead of real data?**
- Check that `data-api` attribute is set correctly
- Verify backend is running and accessible
- Check browser console for CORS or network errors

**Getting 404 on /api/campaigns?**
- Ensure backend is built: `pnpm run build`
- Check server is running on the correct port
- Verify the URL in `data-api` matches your backend URL

## Documentation

- **Full Documentation**: See `tilda/README.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **Example Code**: See `tilda/example.html`
