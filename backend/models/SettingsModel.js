import { supabase } from "../config/db.js";

const toDomainSettings = (record) => {
  if (!record) return null;
  const security = record.default_item_usage?.security || {};
  return {
    id: record.id,
    dark_mode: record.darkmode,
    notifications_enabled: record.notifications,
    bundle_size: record.bundlekg,
    bundle_price: record.bundleprice,
    excess_price: record.excesskgprice,
    addon_price: record.addonprice,
    washing_minutes: record.etawash,
    drying_minutes: record.etadrying,
    folding_minutes: record.etafolding,
    washing_capacity: record.capacitywash,
    drying_capacity: record.capacitydrying,
    folding_capacity: record.capacityfolding,
    require_strong_password: security.require_strong_password ?? true,
    session_timeout_minutes: security.session_timeout_minutes ?? 30,
    updated_at: record.updated_at,
  };
};

const getRawSettings = async () => {
  const { data, error } = await supabase.from("settings").select("*").limit(1).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
};

export const getSettings = async () => toDomainSettings(await getRawSettings());

export const saveSettings = async (settings) => {
  const current = await getRawSettings();
  const payload = { updated_at: new Date().toISOString() };
  const columns = {
    dark_mode: "darkmode",
    notifications_enabled: "notifications",
    bundle_size: "bundlekg",
    bundle_price: "bundleprice",
    excess_price: "excesskgprice",
    addon_price: "addonprice",
    washing_minutes: "etawash",
    drying_minutes: "etadrying",
    folding_minutes: "etafolding",
  };
  Object.entries(columns).forEach(([domainField, databaseField]) => {
    if (Object.hasOwn(settings, domainField)) payload[databaseField] = settings[domainField];
  });
  if (Object.hasOwn(settings, "require_strong_password") || Object.hasOwn(settings, "session_timeout_minutes")) {
    const usage = current?.default_item_usage && typeof current.default_item_usage === "object" ? current.default_item_usage : {};
    payload.default_item_usage = {
      ...usage,
      security: {
        ...(usage.security || {}),
        ...(Object.hasOwn(settings, "require_strong_password") ? { require_strong_password: settings.require_strong_password } : {}),
        ...(Object.hasOwn(settings, "session_timeout_minutes") ? { session_timeout_minutes: settings.session_timeout_minutes } : {}),
      },
    };
  }

  const query = current
    ? supabase.from("settings").update(payload).eq("id", current.id)
    : supabase.from("settings").insert(payload);
  const { data, error } = await query.select("*").single();
  if (error) throw new Error(error.message);
  return toDomainSettings(data);
};

export default { getSettings, saveSettings };
