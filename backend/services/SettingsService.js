import { getSettings, saveSettings } from "../models/SettingsModel.js";

export const DEFAULT_SETTINGS = {
  id: "global", dark_mode: false, notifications_enabled: true,
  bundle_size: 9, bundle_price: 200, excess_price: 30, addon_price: 9,
  washing_minutes: 30, drying_minutes: 45, folding_minutes: 15,
  require_strong_password: true, session_timeout_minutes: 30,
};

const numericFields = ["bundle_size", "bundle_price", "excess_price", "addon_price", "washing_minutes", "drying_minutes", "folding_minutes", "session_timeout_minutes"];
const allowedFields = [...numericFields, "dark_mode", "notifications_enabled", "require_strong_password"];

export const readSettings = async () => ({ ...DEFAULT_SETTINGS, ...(await getSettings()) });

export const updateSettings = async (input = {}) => {
  const updates = Object.fromEntries(Object.entries(input).filter(([key]) => allowedFields.includes(key)));
  if (!Object.keys(updates).length) throw new Error("At least one valid setting is required");
  numericFields.forEach((field) => {
    if (!(field in updates)) return;
    updates[field] = Number(updates[field]);
    if (!Number.isFinite(updates[field]) || updates[field] < 0) throw new Error(`${field} must be a valid non-negative number`);
  });
  ["washing_minutes", "drying_minutes", "folding_minutes"].forEach((field) => { if (field in updates && updates[field] < 1) throw new Error(`${field} must be at least 1 minute`); });
  if ("bundle_size" in updates && updates.bundle_size <= 0) throw new Error("bundle_size must be greater than zero");
  if ("session_timeout_minutes" in updates && updates.session_timeout_minutes < 5) throw new Error("session_timeout_minutes must be at least 5 minutes");
  return saveSettings(updates);
};

export default { readSettings, updateSettings };
