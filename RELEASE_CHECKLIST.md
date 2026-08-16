# ChatShade v0.1.0 Release Checklist

This checklist separates Chrome Web Store requirements from the additional launch standards chosen for ChatShade.

## 1. Extension Code And Privacy

- [x] Use Manifest V3.
- [x] Match only `https://chatgpt.com/*`.
- [x] Request only `storage` and ChatGPT site access.
- [x] Use no remote scripts, CDN resources, analytics, or network requests.
- [x] Do not read, save, analyze, or upload chat content.
- [x] Persist settings with `chrome.storage.sync`.
- [x] Debounce color-picker writes to stay within Chrome Sync write limits.
- [x] Show an accessible error message when settings cannot be saved.
- [x] Explain accurately that Chrome may sync settings through Chrome Sync.
- [ ] Decide whether the current icon is final and remove the placeholder note from `README.md` if accepted.
- [x] Record the lighter composer input surface and new-conversation strip as known `v0.1.x` visual improvements.

## 2. Final Chrome Testing

This is required before submission. Test in the current Chrome Stable release, not only in Brave or another Chromium browser.

- [x] Load the unpacked extension in a clean Chrome profile.
- [x] Confirm the extension installs without Manifest or runtime errors.
- [x] Test a new chat and a long existing conversation.
- [x] Test paragraphs, headings, lists, blockquotes, tables, inline code, and code blocks.
- [x] Test all four presets.
- [x] Test all three custom color controls.
- [x] Confirm color changes appear quickly while the picker is being used.
- [x] Confirm the final color is saved after closing and reopening the Popup.
- [x] Confirm settings persist after refreshing ChatGPT and restarting Chrome.
- [x] Confirm Reset restores the default ChatShade theme.
- [x] Confirm disabling ChatShade removes all ChatShade styling.
- [x] Test the sidebar expanded and collapsed.
- [x] Test browser zoom at 100% and 125%.
- [x] Confirm typing, sending, scrolling, copying, and sidebar navigation still work.
- [x] Confirm the ChatGPT page console and Popup console contain no extension errors.

## 3. Public GitHub Repository

Chrome Web Store does not require a GitHub repository. ChatShade has chosen to use one as a trust, privacy, support, and source-transparency asset.

Repository: <https://github.com/StevenGrow/ChatShade>

- [x] Choose a long-term GitHub account or organization to own the project.
- [x] Create a public repository named `ChatShade`.
- [x] Exclude `.idea/`, `.DS_Store`, and local ZIP packages through `.gitignore`.
- [x] Do not upload screenshots containing real names, avatars, chat titles, or conversation content.
- [x] Add an open-source `LICENSE` file. MIT is the recommended default.
- [x] State that the ChatShade name, logo, and brand assets are not granted as trademarks.
- [x] Enable GitHub Issues.
- [ ] Add repository topics such as `chrome-extension`, `manifest-v3`, `chatgpt`, and `accessibility`.
- [x] Push the release-candidate source to the public repository.
- [x] Confirm `PRIVACY.md` has a stable public URL.
- [ ] Use the repository URL as the project website in the Chrome Web Store.
- [ ] Use GitHub Issues as the initial support URL.
- [ ] Create the `v0.1.0` tag from the exact source uploaded to the store.

Suggested first-push commands after creating an empty GitHub repository:

```bash
git init
git add .gitignore manifest.json content popup icons README.md PRIVACY.md RELEASE_CHECKLIST.md LICENSE TRADEMARKS.md
git commit -m "Initial ChatShade release candidate"
git branch -M main
git remote add origin <GITHUB_REPOSITORY_URL>
git push -u origin main
```

Create the release tag only after final Chrome testing and store package verification:

```bash
git tag v0.1.0
git push origin v0.1.0
```

## 4. Chrome Web Store Developer Account

These steps are required to publish.

- [ ] Choose a long-term Google account for publishing. Avoid an account that may later be lost or retired.
- [ ] Enable 2-Step Verification on that Google account.
- [ ] Open the Chrome Web Store Developer Dashboard.
- [ ] Accept the developer agreement.
- [ ] Pay the one-time developer registration fee shown for the account and region.
- [ ] Choose the permanent publisher name.
- [ ] Add and verify the developer contact email.
- [ ] Declare Trader or Non-Trader status after reviewing the dashboard guidance.
- [ ] Enable important policy and review email notifications.

Developer Dashboard:

<https://chrome.google.com/webstore/devconsole>

## 5. Launch Languages

- [x] Choose an international English and Simplified Chinese launch.
- [x] Localize the Manifest and Popup through Chrome's native `chrome.i18n` API.
- [x] Localize visible labels, preset names, error feedback, and accessibility attributes.
- [x] Publish English and Simplified Chinese privacy policies.
- [ ] Test the Popup with Chrome's interface language set to English.
- [ ] Test the Popup with Chrome's interface language set to Simplified Chinese.
- [ ] Prepare localized English and Simplified Chinese store descriptions.
- [ ] Prepare screenshots that accurately match each store language.

## 6. Store Graphic Assets

Required assets:

- [ ] Final 128 x 128 PNG store icon.
- [ ] At least one 1280 x 800 screenshot. Three focused screenshots are recommended.
- [ ] One 440 x 280 PNG or JPEG small promotional tile.

Recommended screenshot set:

- [ ] Main ChatGPT reading view with ChatShade enabled.
- [ ] Popup showing the four preset themes.
- [ ] Custom color controls with the resulting page appearance.

Optional asset:

- [ ] One 1400 x 560 marquee promotional image.

Asset quality checks:

- [ ] Use only demo conversations and anonymous account information.
- [ ] Do not use the OpenAI logo or imply OpenAI endorsement.
- [ ] Keep the ChatShade icon and colors consistent across all assets.
- [ ] Avoid unsupported claims such as "official", "best", or "number one".

## 7. Store Listing Content

- [ ] Product name: `ChatShade`.
- [ ] Summary no longer than 132 characters.
- [ ] Detailed description with one overview paragraph and a short feature list.
- [ ] State that ChatShade is an independent third-party extension and is not affiliated with or endorsed by OpenAI.
- [ ] Select the most accurate category available in the dashboard.
- [ ] Add the public GitHub repository as the website URL.
- [ ] Add GitHub Issues as the support URL.
- [ ] Add the public `PRIVACY.md` URL as the privacy policy URL.

Suggested single-purpose description:

> ChatShade adjusts the background, conversation surface, and primary text colors on chatgpt.com to provide a calmer long-form reading experience.

Suggested `storage` permission justification:

> The storage permission saves the enabled state, selected theme, and three custom color values in Chrome extension storage so the user's preferences persist.

Suggested ChatGPT site-access justification:

> Access to https://chatgpt.com/* is required to inject the packaged content script and local CSS that apply the user-selected colors. ChatShade does not read or transmit conversation content.

- [ ] Declare that the extension does not use remote code.
- [ ] Complete the data-use questions consistently with `PRIVACY.md` and actual code behavior.
- [ ] Explain that theme preferences use `chrome.storage.sync` and may be synced by Chrome Sync.
- [ ] Review every permission and privacy answer before submission.

## 8. Build The Upload Package

- [ ] Keep `manifest.json` at the root of the ZIP archive.
- [ ] Exclude private screenshots, development notes, `.DS_Store`, and store artwork that is not used by the extension.
- [ ] Name the archive `ChatShade-v0.1.0.zip`.
- [ ] Inspect the ZIP contents before upload.
- [ ] Confirm the package contains the same source as the GitHub `v0.1.0` tag.

Suggested packaging command from the project root:

```bash
zip -r ChatShade-v0.1.0.zip manifest.json _locales content popup icons README.md PRIVACY.md PRIVACY.zh-CN.md KNOWN_ISSUES.md LICENSE TRADEMARKS.md
```

## 9. Submit For Review

- [ ] Create a new item in the Developer Dashboard.
- [ ] Upload `ChatShade-v0.1.0.zip`.
- [ ] Complete the Store Listing tab.
- [ ] Complete the Privacy practices tab.
- [ ] Select public visibility and the intended regions in Distribution.
- [ ] Preview the complete listing at desktop and narrow widths.
- [ ] Submit the item for review.
- [ ] Monitor the verified contact email and respond promptly to reviewer questions.

## 10. After Approval

- [ ] Add the Chrome Web Store URL to `README.md`.
- [ ] Publish the matching GitHub `v0.1.0` release.
- [ ] Test installation from the public store listing.
- [ ] Monitor crashes, reviews, support issues, and uninstall feedback.
- [ ] Track the composer input surface as a candidate for `v0.1.1`.
- [ ] Increase the Manifest version before uploading any update.

## Official References

- Publish overview: <https://developer.chrome.com/docs/webstore>
- Prepare the ZIP package: <https://developer.chrome.com/docs/webstore/prepare>
- Store image requirements: <https://developer.chrome.com/docs/webstore/images>
- Privacy fields: <https://developer.chrome.com/docs/webstore/cws-dashboard-privacy/>
- Developer registration: <https://developer.chrome.com/docs/webstore/register>
- Developer account setup: <https://developer.chrome.com/docs/webstore/set-up-account/>
- Program policies: <https://developer.chrome.com/docs/webstore/program-policies/policies>
