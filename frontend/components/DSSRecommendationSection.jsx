const DSSRecommendationSection = ({ recommendations = [] }) => (
  <section className="analytics-dss-card" aria-labelledby="dss-recommendations-title">
    <header><div><h2 id="dss-recommendations-title">DSS Recommendations</h2><p>Suggested actions based on current trends</p></div><span>{recommendations.length}</span></header>
    <div className="analytics-dss-list">
      {recommendations.length ? recommendations.map((item, index) => (
        <article key={`${item.title}-${index}`} className={`analytics-dss-item priority-${String(item.priority).toLowerCase()}`}>
          <div><strong>{item.title}</strong><span>{item.category} · {item.priority} priority</span></div><p>{item.description}</p>
        </article>
      )) : <p className="analytics-dss-empty">No recommendations for the selected filters.</p>}
    </div>
  </section>
);
export default DSSRecommendationSection;
