import { readSettings, updateSettings } from "../services/SettingsService.js";

const statusFor = (error) => /(relation .* does not exist|could not find the table)/i.test(error.message) ? 503 : 400;
export const getSettingsController = async (_req, res) => {
  try { return res.json({ success: true, data: await readSettings() }); }
  catch (error) { return res.status(statusFor(error)).json({ success: false, message: error.message }); }
};
export const updateSettingsController = async (req, res) => {
  try { return res.json({ success: true, message: "Settings saved successfully", data: await updateSettings(req.body) }); }
  catch (error) { return res.status(statusFor(error)).json({ success: false, message: error.message }); }
};
