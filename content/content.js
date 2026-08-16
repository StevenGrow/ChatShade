(function initChatShade() {
  "use strict";

  const STORAGE_KEY = "chatshadeSettings";
  const DEFAULT_SETTINGS = {
    enabled: true,
    presetId: "soft-ivory",
    colors: {
      pageBackground: "#f7f1e8",
      surfaceBackground: "#fbf5eb",
      textColor: "#2f2a24"
    }
  };
  const PRESET_MIGRATIONS = {
    "low-contrast-dark": {
      presetId: "mist-blue",
      colors: {
        pageBackground: "#e7edf0",
        surfaceBackground: "#f1f5f5",
        textColor: "#243139"
      }
    }
  };

  function sanitizeColor(value, fallback) {
    return /^#[0-9a-f]{6}$/i.test(value || "") ? value : fallback;
  }

  function isDarkColor(hexColor) {
    const value = hexColor.replace("#", "");
    const red = parseInt(value.slice(0, 2), 16);
    const green = parseInt(value.slice(2, 4), 16);
    const blue = parseInt(value.slice(4, 6), 16);
    const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;

    return luminance < 0.45;
  }

  function normalizeSettings(settings) {
    const source = settings && typeof settings === "object" ? settings : {};
    const colors = source.colors && typeof source.colors === "object" ? source.colors : {};
    const presetId = typeof source.presetId === "string" ? source.presetId : DEFAULT_SETTINGS.presetId;
    const migration = PRESET_MIGRATIONS[presetId];

    if (migration) {
      return {
        enabled: typeof source.enabled === "boolean" ? source.enabled : DEFAULT_SETTINGS.enabled,
        presetId: migration.presetId,
        colors: { ...migration.colors }
      };
    }

    return {
      enabled: typeof source.enabled === "boolean" ? source.enabled : DEFAULT_SETTINGS.enabled,
      presetId,
      colors: {
        pageBackground: sanitizeColor(colors.pageBackground, DEFAULT_SETTINGS.colors.pageBackground),
        surfaceBackground: sanitizeColor(colors.surfaceBackground, DEFAULT_SETTINGS.colors.surfaceBackground),
        textColor: sanitizeColor(colors.textColor, DEFAULT_SETTINGS.colors.textColor)
      }
    };
  }

  function applySettings(rawSettings) {
    const settings = normalizeSettings(rawSettings);
    const root = document.documentElement;

    if (!settings.enabled) {
      root.removeAttribute("data-chatshade-enabled");
      root.removeAttribute("data-chatshade-scheme");
      root.style.removeProperty("--chatshade-page-bg");
      root.style.removeProperty("--chatshade-surface-bg");
      root.style.removeProperty("--chatshade-text-color");
      return;
    }

    root.setAttribute("data-chatshade-enabled", "true");
    root.setAttribute("data-chatshade-scheme", isDarkColor(settings.colors.pageBackground) ? "dark" : "light");
    root.style.setProperty("--chatshade-page-bg", settings.colors.pageBackground);
    root.style.setProperty("--chatshade-surface-bg", settings.colors.surfaceBackground);
    root.style.setProperty("--chatshade-text-color", settings.colors.textColor);
  }

  chrome.storage.sync.get({ [STORAGE_KEY]: DEFAULT_SETTINGS }, (result) => {
    if (chrome.runtime.lastError) {
      applySettings(DEFAULT_SETTINGS);
      return;
    }

    applySettings(result[STORAGE_KEY]);
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "sync" || !changes[STORAGE_KEY]) {
      return;
    }

    applySettings(changes[STORAGE_KEY].newValue);
  });
})();
