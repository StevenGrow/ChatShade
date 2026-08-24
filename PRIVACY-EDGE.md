# ChatShade Privacy Policy for Microsoft Edge

ChatShade is designed to be privacy-friendly and local-first on Microsoft Edge.

## What ChatShade Does Not Collect

ChatShade does not collect personal information.

ChatShade does not read, save, analyze, transmit, or upload your ChatGPT conversations or message content.

ChatShade does not track browsing history.

ChatShade does not use analytics, telemetry, cookies, remote scripts, or network requests.

## What ChatShade Stores

ChatShade stores only theme settings, including:

- Whether the extension is enabled.
- The selected preset theme.
- Custom page background color.
- Custom conversation/content surface color.
- Custom primary text color.

These settings are saved with the browser extension storage API, `chrome.storage.sync`, which is supported by Microsoft Edge for extensions. If sync is enabled for the user's browser profile, the browser may sync these settings between installations signed in to that profile.

ChatShade does not operate a data server and does not independently transmit these settings to the developer or to third parties.

## Where ChatShade Runs

ChatShade runs only on pages matching:

```text
https://chatgpt.com/*
```

It modifies local page styles on ChatGPT by applying CSS variables and local CSS rules. It does not modify ChatGPT's business logic, intercept network requests, or send data to any server.

## Third-Party Status

ChatShade is an independent third-party browser extension and is not affiliated with or endorsed by OpenAI.
