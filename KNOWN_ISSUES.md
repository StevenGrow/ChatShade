# Known Issues

## New Or Short Conversations

In some new or very short ChatGPT conversations, a wide lighter strip can appear in the empty area below the first assistant response. This is a cosmetic compatibility issue caused by ChatGPT's dynamic page layout. It does not affect reading, typing, sending messages, scrolling, theme persistence, or sidebar operation.

## Composer Surface

The editable area inside the ChatGPT composer can appear slightly lighter than the surrounding ChatShade theme surface in some layouts.

Both issues are candidates for a `v0.1.x` compatibility update. Because ChatGPT's DOM changes over time, future fixes will use inspected semantic attributes where possible and avoid broad selectors that could interfere with page behavior.

## Distribution Follow-Ups

- Add Chrome Web Store and Microsoft Edge Add-ons links to future release notes.
- Watch early Chrome and Edge feedback before making broader visual changes.
- Consider Opera as a low-cost Chromium distribution follow-up.
- Treat Firefox as a separate compatibility project, because its extension APIs and review flow may require more deliberate testing.

## Possible `v0.1.x` Tasks

- Tune the new-conversation empty area once there is a stable inspected selector.
- Improve composer/input surface harmony across light and dark browser modes.
- Recheck disclaimer/footer styling after future ChatGPT UI updates.
- Add a short manual regression checklist for Chrome and Edge before each store upload.
