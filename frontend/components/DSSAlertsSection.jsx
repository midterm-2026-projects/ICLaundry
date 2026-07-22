const DSSAlertsSection = ({ alerts = [] }) => (
  <section className="analytics-dss-card" aria-labelledby="dss-alerts-title">
    <header><div><h2 id="dss-alerts-title">DSS Alerts</h2><p>Conditions requiring attention</p></div><span>{alerts.length}</span></header>
    <div className="analytics-dss-list">
      {alerts.length ? alerts.map((item, index) => (
        <article key={`${item.title}-${index}`} className={`analytics-alert-item severity-${String(item.severity).toLowerCase()}`}>
          <div><strong>{item.title}</strong><span>{item.category} · {item.severity}</span></div><p>{item.description}</p>
        </article>
      )) : <p className="analytics-dss-empty">No active alerts for the selected filters.</p>}
    </div>
  </section>
);
export default DSSAlertsSection;
