import { beforeEach, describe, expect, it, vi } from "vitest";
import * as model from "../../models/SettingsModel.js";
import { readSettings, updateSettings } from "../../services/SettingsService.js";
vi.mock("../../models/SettingsModel.js", () => ({ getSettings: vi.fn(), saveSettings: vi.fn() }));
describe("Settings Service", () => {
  beforeEach(() => vi.clearAllMocks());
  it("returns defaults merged with saved settings", async () => { model.getSettings.mockResolvedValue({ washing_minutes: 40 }); const result = await readSettings(); expect(result.washing_minutes).toBe(40); expect(result.drying_minutes).toBe(45); });
  it("saves valid pricing and ETA values", async () => { model.saveSettings.mockImplementation(async value => value); const result = await updateSettings({ bundle_price: "250", washing_minutes: 35 }); expect(result).toMatchObject({ bundle_price: 250, washing_minutes: 35 }); });
  it("rejects empty and unknown payloads", async () => { await expect(updateSettings({ unknown: true })).rejects.toThrow("valid setting"); });
  it("rejects invalid ETA", async () => { await expect(updateSettings({ washing_minutes: 0 })).rejects.toThrow("at least 1 minute"); });
  it("rejects unsafe session timeout", async () => { await expect(updateSettings({ session_timeout_minutes: 2 })).rejects.toThrow("at least 5 minutes"); });
});
