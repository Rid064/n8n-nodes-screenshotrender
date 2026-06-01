# n8n-nodes-screenshotrender

An [n8n](https://n8n.io) community node for [ScreenshotRender](https://screenshotrender.com).
Capture a screenshot of any web page from inside an n8n workflow. No headless
browser to host, no infrastructure to manage.

## Installation

In n8n: **Settings → Community Nodes → Install**, then enter:

```
n8n-nodes-screenshotrender
```

## Credentials

You need a ScreenshotRender API key (starts with `sr-`). Get one for free at
[screenshotrender.com/dashboard](https://screenshotrender.com/dashboard). The
free tier includes 100 screenshots.

Add it under **ScreenshotRender API** credentials in n8n.

## Node: ScreenshotRender

Operation: **Capture**.

| Field | Description |
|---|---|
| URL | The web page to capture (required) |
| Full Page | Capture the whole scrollable page instead of just the viewport |
| Wait (ms) | Wait after load before capturing, for late-rendering content |
| Timeout (ms) | Maximum time to wait for the page before failing |

The node returns the API JSON, including the `screenshot` URL, page `title`,
`description`, `favicon`, and `tokensUsed`.

## Example

Trigger → ScreenshotRender (URL: `https://example.com`, Full Page: on) →
save `{{$json.data.screenshot}}` to Google Drive, Slack, or a database.

## Development

```bash
npm install
npm run build      # tsc + copy icons to dist/
npm run lint       # n8n community lint rules
```

Local testing:

```bash
npm run build
npm link
# then in your n8n custom folder:
#   npm link n8n-nodes-screenshotrender
npx n8n start
```

## License

[MIT](LICENSE.md)
