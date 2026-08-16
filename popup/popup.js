"use strict";

const STORAGE_KEY = "chatshadeSettings";
const SAVE_DELAY_MS = 500;

const PRESETS = [
  {
    id: "soft-ivory",
    nameMessage: "presetSoftIvory",
    fallbackName: "Soft ivory",
    colors: {
      pageBackground: "#f7f1e8",
      surfaceBackground: "#fbf5eb",
      textColor: "#2f2a24"
    }
  },
  {
    id: "warm-gray",
    nameMessage: "presetWarmGray",
    fallbackName: "Warm gray",
    colors: {
      pageBackground: "#ebe7df",
      surfaceBackground: "#f1ede5",
      textColor: "#302e2a"
    }
  },
  {
    id: "eye-green",
    nameMessage: "presetEyeGreen",
    fallbackName: "Restful green",
    colors: {
      pageBackground: "#eaf3e6",
      surfaceBackground: "#eef6ea",
      textColor: "#263528"
    }
  },
  {
    id: "mist-blue",
    nameMessage: "presetMistBlue",
    fallbackName: "Mist blue",
    colors: {
      pageBackground: "#e7edf0",
      surfaceBackground: "#f1f5f5",
      textColor: "#243139"
    }
  }
];

const LEGACY_PRESET_MIGRATIONS = {
  "low-contrast-dark": "mist-blue"
};

const DEFAULT_SETTINGS = {
  enabled: true,
  presetId: PRESETS[0].id,
  colors: { ...PRESETS[0].colors }
};

const elements = {
  enabledToggle: document.querySelector("#enabledToggle"),
  presetGrid: document.querySelector("#presetGrid"),
  pageBackground: document.querySelector("#pageBackground"),
  surfaceBackground: document.querySelector("#surfaceBackground"),
  textColor: document.querySelector("#textColor"),
  resetButton: document.querySelector("#resetButton"),
  saveStatus: document.querySelector("#saveStatus")
};

let currentSettings = { ...DEFAULT_SETTINGS, colors: { ...DEFAULT_SETTINGS.colors } };
let pendingSaveTimer = null;
let pendingSettings = null;
let latestSaveRequestId = 0;

function getMessage(messageName, fallback = "") {
  return chrome.i18n.getMessage(messageName) || fallback;
}

function localizePopup() {
  document.documentElement.lang = chrome.i18n.getUILanguage() || "en";
  document.documentElement.dir = getMessage("@@bidi_dir", "ltr");

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = getMessage(element.dataset.i18n, element.textContent);
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", getMessage(element.dataset.i18nAriaLabel, element.getAttribute("aria-label")));
  });
}

function cloneSettings(settings) {
  return {
    enabled: settings.enabled,
    presetId: settings.presetId,
    colors: { ...settings.colors }
  };
}

function sanitizeColor(value, fallback) {
  return /^#[0-9a-f]{6}$/i.test(value || "") ? value : fallback;
}

function normalizeSettings(settings) {
  const source = settings && typeof settings === "object" ? settings : {};
  const colors = source.colors && typeof source.colors === "object" ? source.colors : {};
  const presetId = typeof source.presetId === "string" ? source.presetId : DEFAULT_SETTINGS.presetId;
  const migratedPresetId = LEGACY_PRESET_MIGRATIONS[presetId];

  if (migratedPresetId) {
    const preset = PRESETS.find((item) => item.id === migratedPresetId);

    return {
      enabled: typeof source.enabled === "boolean" ? source.enabled : DEFAULT_SETTINGS.enabled,
      presetId: preset.id,
      colors: { ...preset.colors }
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

function colorsMatch(a, b) {
  return a.pageBackground.toLowerCase() === b.pageBackground.toLowerCase()
    && a.surfaceBackground.toLowerCase() === b.surfaceBackground.toLowerCase()
    && a.textColor.toLowerCase() === b.textColor.toLowerCase();
}

function findPresetIdByColors(colors) {
  const match = PRESETS.find((preset) => colorsMatch(preset.colors, colors));
  return match ? match.id : "custom";
}

function selectPreset(preset) {
  updateSettings({
    ...currentSettings,
    presetId: preset.id,
    colors: { ...preset.colors }
  });
}

function renderPresetCards() {
  elements.presetGrid.textContent = "";

  PRESETS.forEach((preset, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "preset-card";
    button.dataset.presetId = preset.id;
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", "false");
    button.tabIndex = index === 0 ? 0 : -1;

    const name = document.createElement("span");
    name.className = "preset-name";
    name.textContent = getMessage(preset.nameMessage, preset.fallbackName);

    const swatches = document.createElement("span");
    swatches.className = "swatches";
    swatches.setAttribute("aria-hidden", "true");

    Object.values(preset.colors).forEach((color) => {
      const swatch = document.createElement("span");
      swatch.className = "swatch";
      swatch.style.backgroundColor = color;
      swatches.append(swatch);
    });

    button.append(name, swatches);
    button.addEventListener("click", () => selectPreset(preset));

    elements.presetGrid.append(button);
  });
}

function renderSettings(settings) {
  const selectedPresetId = findPresetIdByColors(settings.colors);
  const focusablePresetId = selectedPresetId === "custom" ? PRESETS[0].id : selectedPresetId;

  elements.enabledToggle.checked = settings.enabled;
  elements.pageBackground.value = settings.colors.pageBackground;
  elements.surfaceBackground.value = settings.colors.surfaceBackground;
  elements.textColor.value = settings.colors.textColor;

  document.querySelectorAll(".preset-card").forEach((button) => {
    const isSelected = button.dataset.presetId === selectedPresetId;
    button.setAttribute("aria-checked", String(isSelected));
    button.tabIndex = button.dataset.presetId === focusablePresetId ? 0 : -1;
  });
}

function setSaveError(message) {
  elements.saveStatus.textContent = message;
  elements.saveStatus.hidden = !message;
}

function saveSettings(settings) {
  const requestId = ++latestSaveRequestId;
  const settingsSnapshot = cloneSettings(settings);

  return chrome.storage.sync.set({ [STORAGE_KEY]: settingsSnapshot })
    .then(() => {
      if (requestId === latestSaveRequestId) {
        setSaveError("");
      }
    })
    .catch((error) => {
      console.error("ChatShade could not save settings.", error);

      if (requestId === latestSaveRequestId) {
        setSaveError(getMessage("saveError", "Settings could not be saved. Try again."));
      }
    });
}

function saveSettingsImmediately(settings) {
  if (pendingSaveTimer !== null) {
    clearTimeout(pendingSaveTimer);
    pendingSaveTimer = null;
  }

  pendingSettings = null;
  return saveSettings(settings);
}

function scheduleSettingsSave(settings) {
  pendingSettings = cloneSettings(settings);

  if (pendingSaveTimer !== null) {
    clearTimeout(pendingSaveTimer);
  }

  pendingSaveTimer = setTimeout(() => {
    const settingsToSave = pendingSettings;
    pendingSaveTimer = null;
    pendingSettings = null;
    saveSettings(settingsToSave);
  }, SAVE_DELAY_MS);
}

function updateSettings(nextSettings, options = {}) {
  currentSettings = normalizeSettings(nextSettings);
  currentSettings.presetId = findPresetIdByColors(currentSettings.colors);
  renderSettings(currentSettings);

  if (options.deferSave) {
    scheduleSettingsSave(currentSettings);
    return;
  }

  saveSettingsImmediately(currentSettings);
}

function updateColorSetting(event, deferSave) {
  const fieldName = event.target.id;
  updateSettings({
    ...currentSettings,
    presetId: "custom",
    colors: {
      ...currentSettings.colors,
      [fieldName]: event.target.value
    }
  }, { deferSave });
}

function handleColorInput(event) {
  updateColorSetting(event, true);
}

function handleColorChange(event) {
  updateColorSetting(event, false);
}

function handlePresetKeydown(event) {
  const buttons = Array.from(elements.presetGrid.querySelectorAll(".preset-card"));
  const currentIndex = buttons.indexOf(document.activeElement);

  if (currentIndex === -1) {
    return;
  }

  let nextIndex;

  switch (event.key) {
    case "ArrowLeft":
      nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
      break;
    case "ArrowRight":
      nextIndex = (currentIndex + 1) % buttons.length;
      break;
    case "ArrowUp":
      nextIndex = (currentIndex - 2 + buttons.length) % buttons.length;
      break;
    case "ArrowDown":
      nextIndex = (currentIndex + 2) % buttons.length;
      break;
    case "Home":
      nextIndex = 0;
      break;
    case "End":
      nextIndex = buttons.length - 1;
      break;
    default:
      return;
  }

  event.preventDefault();
  buttons[nextIndex].focus();
  buttons[nextIndex].click();
}

function bindEvents() {
  elements.presetGrid.addEventListener("keydown", handlePresetKeydown);

  elements.enabledToggle.addEventListener("change", () => {
    updateSettings({
      ...currentSettings,
      enabled: elements.enabledToggle.checked
    });
  });

  elements.pageBackground.addEventListener("input", handleColorInput);
  elements.surfaceBackground.addEventListener("input", handleColorInput);
  elements.textColor.addEventListener("input", handleColorInput);
  elements.pageBackground.addEventListener("change", handleColorChange);
  elements.surfaceBackground.addEventListener("change", handleColorChange);
  elements.textColor.addEventListener("change", handleColorChange);

  elements.resetButton.addEventListener("click", () => {
    updateSettings(cloneSettings(DEFAULT_SETTINGS));
  });
}

function loadSettings() {
  chrome.storage.sync.get({ [STORAGE_KEY]: DEFAULT_SETTINGS }, (result) => {
    if (chrome.runtime.lastError) {
      currentSettings = cloneSettings(DEFAULT_SETTINGS);
      renderSettings(currentSettings);
      return;
    }

    const storedSettings = result[STORAGE_KEY];
    currentSettings = normalizeSettings(storedSettings);
    currentSettings.presetId = findPresetIdByColors(currentSettings.colors);
    renderSettings(currentSettings);

    if (JSON.stringify(currentSettings) !== JSON.stringify(storedSettings)) {
      saveSettingsImmediately(currentSettings);
    }
  });
}

localizePopup();
renderPresetCards();
bindEvents();
loadSettings();
