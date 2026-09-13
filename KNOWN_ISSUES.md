# Known Issues

## New Or Short Conversations

`v0.2.0` adds more targeted rules for ChatGPT surface token classes to reduce the wide lighter strip that could appear in the empty area below the first assistant response. Keep this area on the regression list because ChatGPT's dynamic layout changes over time.

## Composer Surface

`v0.2.0` makes the editable field inside the ChatGPT composer transparent over the ChatShade composer surface, which should reduce the lighter inner-box effect seen in some layouts.

The composer frame now uses a theme-aware border and shadow instead of ChatGPT's black translucent outline. Its styling is limited to the real input surface so ChatGPT's square positioning and dock containers remain transparent. Recheck it after major ChatGPT composer layout changes.

## Signed-Out Header Buttons

`v0.2.0` leaves signed-out authentication button contrast to ChatGPT so those controls can follow the system light/dark appearance.

Because ChatGPT's DOM changes over time, future fixes should continue to prefer inspected semantic attributes and narrowly scoped token/class fragments over broad selectors that could interfere with page behavior.

## Markdown Code Blocks: Verified Debugging Notes

The white header/right-hand strip and rectangular background behind rounded code blocks were fixed after inspecting the actual affected conversation in Brave. The user confirmed the result across all presets.

The inspected structure was an outer `pre`, several layout wrappers, a rounded surface using `--code-block-surface`, and a CodeMirror viewer containing `.cm-scroller > pre > code`. The surface declared its own variable from `--bg-elevated-secondary` (or `--composer-surface-primary` in dark mode). Changing unrelated surface variables on an ancestor did not override that local declaration.

The fix in `content/content.css` overrides `--code-block-surface` on the elements that declare/use it, within Markdown `pre` blocks. The outer `pre` containing this surface, nested `pre`, and block `code` stay transparent. Native containers retain ownership of corners, clipping, spacing, and scrolling. Simple standalone `pre` and inline code still receive a theme background.

Avoid restoring `div:has(> pre)` background rules: they also match the entire Markdown response and the internal scroll container. Avoid `:not(pre) > code` for inline code: a nested block code element can have a non-`pre` immediate parent. Use `code:not(pre code)` to exclude all code under a `pre`.

For future visual regressions:

1. Locate the user's actual browser, conversation, and extension build. A screenshot alone cannot establish DOM nesting or the winning CSS rule.
2. Inspect computed backgrounds, local CSS variables, and border radii at each layer. Check whether an apparently single block contains nested `pre` elements.
3. Remove failed overlapping rules rather than accumulating broader selectors. Theme the native painted surface and leave layout wrappers transparent.
4. Reload the unpacked extension and the affected page. Check both computed styles and screenshots of plain-text and language-labelled code blocks. Include inline code, ordinary paragraphs, and native rounded corners in the regression check.
5. Verify light and dark presets, restore temporary preview settings, and distinguish live-browser verification from syntax checks. `node --check content/content.js` does not validate CSS rendering.

These selectors reflect the inspected ChatGPT UI, not a permanent DOM contract. Reinspect after structural changes instead of guessing new class names or adding fixed parent-depth assumptions.

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
