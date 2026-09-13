# Known Issues

## New Or Short Conversations

`v0.2.0` adds more targeted rules for ChatGPT surface token classes to reduce the wide lighter strip that could appear in the empty area below the first assistant response. Keep this area on the regression list because ChatGPT's dynamic layout changes over time.

## Composer Surface

`v0.2.0` makes the editable field inside the ChatGPT composer transparent over the ChatShade composer surface, which should reduce the lighter inner-box effect seen in some layouts.

The composer frame now uses a theme-aware border and shadow instead of ChatGPT's black translucent outline. Its styling is limited to the real input surface so ChatGPT's square positioning and dock containers remain transparent. Recheck it after major ChatGPT composer layout changes.

## Signed-Out Header Buttons

`v0.2.0` leaves signed-out authentication button contrast to ChatGPT so those controls can follow the system light/dark appearance.

Because ChatGPT's DOM changes over time, future fixes should continue to prefer inspected semantic attributes and narrowly scoped token/class fragments over broad selectors that could interfere with page behavior.

## Distribution Follow-Ups

- Add Chrome Web Store and Microsoft Edge Add-ons links to future release notes.
- Watch early Chrome and Edge feedback before making broader visual changes.
- Consider Opera as a low-cost Chromium distribution follow-up.
- Treat Firefox as a separate compatibility project, because its extension APIs and review flow may require more deliberate testing.

## Possible Next Tasks

- Regression-test the new `Night Moss` preset in Chrome and Edge before store upload.
- Recheck the new-conversation empty area after the next visible ChatGPT UI change.
- Recheck composer/input surface harmony across light and dark browser modes.
- Recheck disclaimer/footer styling after future ChatGPT UI updates.
- Add a short manual regression checklist for Chrome and Edge before each store upload.
