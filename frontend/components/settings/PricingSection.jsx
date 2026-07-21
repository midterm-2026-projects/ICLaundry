export default function PricingSection() {
  return (
    <div className="settings-card">
      <div className="card-header">
        <span className="card-icon">💰</span>
        <div>
          <h3 className="card-title">Pricing</h3>
          <p className="card-desc">Set laundry bundle pricing and add-on costs</p>
        </div>
      </div>

      <h4 className="section-subtitle">Laundry Bundle</h4>
      <div className="input-row">
        <div className="form-group">
          <label className="form-label">Bundle Size (kg)</label>
          <input type="number" className="form-input" defaultValue={9} />
        </div>
        <div className="form-group">
          <label className="form-label">Price per Bundle (₱)</label>
          <input type="number" className="form-input" defaultValue={200} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Excess Price per Kg (₱)</label>
        <input type="number" className="form-input" defaultValue={30} />
        <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem' }}>
          ₱200 minimum for 9kg + ₱30 per excess kg
        </p>
      </div>

      <h4 className="section-subtitle">Add-ons (Soap / Detergent)</h4>
      <div className="form-group">
        <label className="form-label">Price per Add-on Item (₱)</label>
        <input type="number" className="form-input" defaultValue={9} />
        <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem' }}>
          ₱9 per soap / detergent add-on
        </p>
      </div>

      <button className="btn btn-primary">Save Pricing</button>
    </div>
  )
}