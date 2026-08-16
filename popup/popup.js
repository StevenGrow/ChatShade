"use strict";

const STORAGE_KEY = "chatshadeSettings";
const SAVE_DELAY_MS = 500;

const PRESETS = [
  {
    id: "soft-ivory",
    name: "柔和米白",
    colors: {
      pageBackground: "#f7f1e8",
      surfaceBackground: "#fbf5eb",
      textColor: "#2f2a24"
    }
  },
  {
    id: "warm-gray",
    name: "暖灰",
    colors: {
      pageBackground: "#ebe7df",
      surfaceBackground: "#f1ede5",
      textColor: "#302e2a"
    }
  },
  {
    id: "eye-green",
    name: "护眼绿",
    colors: {
      pageBackground: "#eaf3e6",
      surfaceBackground: "#eef6ea",
      textColor: "#263528"
    }
  },
  {
    id: "mist-blue",
    name: "雾蓝灰",
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

function renderPresetCards() {
  elements.presetGrid.textContent = "";

  PRESETS.forEach((preset) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "preset-card";
    button.dataset.presetId = preset.id;
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", "false");

    const name = document.createElement("span");
    name.className = "preset-name";
    name.textContent = preset.name;

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
    button.addEventListener("click", () => {
      updateSettings({
        ...currentSettings,
        presetId: preset.id,
        colors: { ...preset.colors }
      });
    });

    elements.presetGrid.append(button);
  });
}

function renderSettings(settings) {
  const selectedPresetId = findPresetIdByColors(settings.colors);

  elements.enabledToggle.checked = settings.enabled;
  elements.pageBackground.value = settings.colors.pageBackground;
  elements.surfaceBackground.value = settings.colors.surfaceBackground;
  elements.textColor.value = settings.colors.textColor;

  document.querySelectorAll(".preset-card").forEach((button) => {
    const isSelected = button.dataset.presetId === selectedPresetId;
    button.setAttribute("aria-checked", String(isSelected));
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
        setSaveError("设置保存失败，请重试。");
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

function bindEvents() {
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

renderPresetCards();
bindEvents();
loadSettings();
