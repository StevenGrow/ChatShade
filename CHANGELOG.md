# Changelog

## v0.2.0

- Added the Blush Pink / 柔粉 preset for a lighter warm-pink reading tone.
- Added the Night Moss / 墨绿夜读 preset for darker late-night reading.
- Tuned ChatGPT composer styling so the editable field blends better with the ChatShade surface.
- Replaced ChatGPT's black composer frame with a theme-aware border and shadow.
- Narrowed composer selectors so square positioning and dock containers stay transparent while the rounded input surface keeps its theme color.
- Kept logged-in composer editing and layout layers transparent so they do not draw square inner blocks.
- Restored contrast on the actual rounded composer surface and clipped its contents cleanly to that shape.
- Themed the native Markdown code-block surface, including its language header and copy area, while keeping nested code layers transparent and preserving native rounded corners.
- Tuned ChatGPT main-surface token handling to reduce light strips in new or short conversations.
- Preserved ChatGPT's native light/dark contrast for signed-out authentication buttons.
- Kept the permission set unchanged: `storage` plus `https://chatgpt.com/*`.

## v0.1.0

- First public release for Chrome Web Store and Microsoft Edge Add-ons.
- Added English and Simplified Chinese popup UI.
- Added four built-in gentle color presets and custom color controls.
- Stored only local extension theme settings with `chrome.storage.sync`.
