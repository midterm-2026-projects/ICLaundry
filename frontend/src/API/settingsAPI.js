const BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/settings`;
const request = async (options) => { const response = await fetch(BASE_URL, options); const result = await response.json().catch(() => ({})); if (!response.ok) throw new Error(result.message || "Settings request failed."); return result.data; };
export const getSettings = () => request();
export const saveSettings = (settings) => request({ method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
export default { getSettings, saveSettings };
