import { Banknote, Save } from "lucide-react";
import { useEffect, useState } from "react";
const defaults = { bundle_size: 9, bundle_price: 200, excess_price: 30, addon_price: 9 };

export default function PricingSection({ values = defaults, onSave, saving = false }) {
  const [form, setForm] = useState({ ...defaults, ...values });
  useEffect(() => setForm({ ...defaults, ...values }), [values]);
  const field = (name) => ({ value: form[name], onChange: (event) => setForm((current) => ({ ...current, [name]: Number(event.target.value) })) });
  return <section className="settings-panel" aria-labelledby="pricing-title">
    <header className="settings-panel-header"><span><Banknote size={19} /></span><div><h2 id="pricing-title">Pricing</h2><p>Set laundry bundle pricing and add-on costs</p></div></header>
    <div className="settings-panel-body"><h3>Laundry Bundle</h3><div className="settings-input-grid"><label>Bundle Size (kg)<input aria-label="Bundle Size (kg)" type="number" min="1" {...field("bundle_size")} /></label><label>Price per Bundle (₱)<input aria-label="Price per Bundle (₱)" type="number" min="0" {...field("bundle_price")} /></label></div><label>Excess Price per Kg (₱)<input aria-label="Excess Price per Kg (₱)" type="number" min="0" {...field("excess_price")} /></label><p className="settings-help">₱{form.bundle_price} minimum for {form.bundle_size}kg + ₱{form.excess_price} per excess kg</p><h3>Add-ons (Soap / Detergent)</h3><label>Price per Add-on Item (₱)<input aria-label="Price per Add-on Item (₱)" type="number" min="0" {...field("addon_price")} /></label><p className="settings-help">₱{form.addon_price} per soap / detergent add-on</p></div>
    <footer className="settings-panel-footer"><button type="button" className="btn btn-primary" disabled={saving} onClick={() => onSave?.(form)}><Save size={16} /> Save Pricing</button></footer>
  </section>;
}
