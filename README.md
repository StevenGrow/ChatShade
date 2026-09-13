# ChatShade

中文名称：柔光对话

> A calmer space for longer conversations.
>
> 让每一次长谈，都不再刺眼。

ChatShade is a lightweight browser extension for Chrome and Microsoft Edge that softens the ChatGPT web interface with calmer background, conversation surface, and text colors. It is built as a small Manifest V3 extension with native HTML, CSS, and JavaScript.

ChatShade is an independent third-party browser extension and is not affiliated with or endorsed by OpenAI.

## Install

- [Install from the Chrome Web Store](https://chromewebstore.google.com/detail/chatshade/gnbjdekebgnifnnohilgefdikifdgbh)
- [Install from Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/npknldohcppjbmiealoaelfahhpaokjb)

The first public release was `v0.1.0`. The current source version is `v0.2.0`.

## Features

- Runs only on `https://chatgpt.com/*`.
- One switch to enable or disable ChatShade.
- English and Simplified Chinese UI that follows the browser interface language.
- Six built-in presets:
  - Soft Ivory / 柔和米白
  - Warm Gray / 暖灰
  - Restful Green / 护眼绿
  - Mist Blue / 雾蓝灰
  - Blush Pink / 柔粉
  - Night Moss / 墨绿夜读
- Custom color pickers for:
  - Page background
  - Conversation/content surface
  - Primary text
- Reset to default settings.
- Settings persist through `chrome.storage.sync` and may follow the user through browser profile sync.
- Current ChatGPT tabs update quickly through storage change listeners.
- No chat content is read, saved, uploaded, or analyzed.

## Project Structure

```text
ChatShade/
├── _locales/
│   ├── en/messages.json
│   └── zh_CN/messages.json
├── manifest.json
├── content/
│   ├── content.js
│   └── content.css
├── brand/
│   └── chatshade-icon-master.svg
├── popup/
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── icons/
│   ├── icon-16.png
│   ├── icon-32.png
│   ├── icon-48.png
│   └── icon-128.png
├── LICENSE
├── TRADEMARKS.md
├── KNOWN_ISSUES.md
├── CHANGELOG.md
├── RELEASE_CHECKLIST.md
├── README.md
├── PRIVACY-EDGE.md
├── PRIVACY.md
└── PRIVACY.zh-CN.md
```

## Language Support

ChatShade uses the extension `chrome.i18n` API supported by Chromium-based browsers. English is the default locale, Simplified Chinese is provided through `zh_CN`, and unsupported browser interface languages fall back to English. The extension does not download translations or other remote resources.

## Key Design Notes

The main implementation tension is that ChatGPT is a dynamic web app, while the extension should avoid fragile selectors and should not interfere with product behavior.

This MVP therefore uses a conservative styling model:

- `content/content.js` reads `chrome.storage.sync`, sets a `data-chatshade-enabled` attribute on `html`, and writes CSS custom variables.
- `content/content.css` applies colors from those variables to broad, relatively stable page areas such as `html`, `body`, `main`, `nav`, `aside`, `header`, textboxes, and semantic message attributes.
- The popup writes settings only to extension storage. It does not inspect the active tab or request the `tabs` permission.
- The content script listens to `chrome.storage.onChanged`, so open ChatGPT pages update without a manual refresh in most cases.
- `v0.2.0` keeps the same permissions while adding a dark reading preset and more targeted compatibility rules for ChatGPT's composer and empty conversation areas.

Selectors that may need real-page tuning later are intentionally kept in `content/content.css`, especially those involving `data-testid`, `data-message-author-role`, and class fragments such as `composer`, `prompt`, `thread`, or `conversation`.

## Local Installation

Chrome:

1. Open Chrome.
2. Go to `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select this `ChatShade` folder.
6. Open or refresh `https://chatgpt.com/`.
7. Click the ChatShade extension icon.
8. Test the enable switch, preset themes, custom colors, and reset button.

Microsoft Edge:

1. Open Edge.
2. Go to `edge://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select this `ChatShade` folder.
6. Open or refresh `https://chatgpt.com/`.
7. Click the ChatShade extension icon.
8. Test the same core flows as Chrome.

## Debugging

Popup console:

1. Go to `chrome://extensions` or `edge://extensions`.
2. Find ChatShade.
3. Click **Inspect views** for the popup, or right-click the open popup and choose **Inspect** if available.

Content script console:

1. Open `https://chatgpt.com/`.
2. Open DevTools.
3. Use the page Console. Content script errors usually appear there with extension source links.

Extension errors:

1. Go to `chrome://extensions` or `edge://extensions`.
2. Find ChatShade.
3. Check whether the browser shows an **Errors** button.

After code changes:

- Click **Reload** on the extension card after changing `manifest.json`, popup files, content scripts, CSS, or icons.
- Refresh the ChatGPT tab after changing content scripts or content CSS.
- Popup-only changes usually need the extension reload plus reopening the popup.

## Areas To Verify On ChatGPT

- Main page background.
- Conversation message area.
- Assistant and user message readability.
- Code blocks and inline code.
- Left sidebar.
- Top header.
- Composer/input area.
- Buttons, menus, and hover states.
- Scrolling behavior.
- Message typing and sending.

## Roadmap And Known Issues

Tracked compatibility notes and next-version ideas live in [KNOWN_ISSUES.md](KNOWN_ISSUES.md).

Current priorities:

- Keep Chrome and Edge compatibility stable as ChatGPT changes its page structure.
- Monitor the `v0.2.0` composer and new-conversation surface tuning against future ChatGPT UI updates.
- Consider Opera distribution after Chrome and Edge have a little more usage feedback.
- Consider Firefox as a later dedicated compatibility project.
- Keep the permission set minimal: `storage` plus `https://chatgpt.com/*`.
- Do not add remote scripts, analytics, telemetry, or network requests.

## Support

Report bugs and compatibility issues through [GitHub Issues](https://github.com/StevenGrow/ChatShade/issues). Do not include private conversations, account information, or other personal data in issue reports.

## License

The software source code is available under the [MIT License](LICENSE). The ChatShade name, logo, icons, tagline, and other brand assets are excluded from that license; see [TRADEMARKS.md](TRADEMARKS.md).
