# Changelog

## v0.3.0

- Added the Starry Night / 星空夜读 preset with a bundled, offline night-sky background.
- Added a theme-specific star intensity slider with live preview and persisted settings.
- Kept existing solid-color presets unchanged and added no new permissions or network requests.

## v0.2.2

- Adapted ChatGPT page, sidebar, header, and composer theme rules for the latest site structure.
- Reduced native light/dark surface bleed-through by covering newer ChatGPT background, text, border, popover, and composer tokens.

## v0.2.1

- Fixed themed Markdown code blocks so their native surface, language header, copy area, and rounded corners remain visually unified across all presets.
- Kept nested Markdown code layers transparent so they do not create rectangular background artifacts around the native rounded container.

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
