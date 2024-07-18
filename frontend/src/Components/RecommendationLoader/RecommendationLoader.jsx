import "./RecommendationLoader.css";

function RecommendationLoader() {
  return (
    <div className="recommendation-table-container">
      <div className="project-details-header">
        <div className="overview">
          <i className="fa-solid fa-list"></i>
          <h3>AI Recommended Tasks</h3>
        </div>
      </div>
      <div className="project-details">
        <div className="detail-row">
          <div className="detail skeleton skeleton-text"></div>
        </div>
        <div className="detail-row">
          <div className="detail skeleton skeleton-text"></div>
          <div className="detail skeleton skeleton-text"></div>
        </div>
        <div className="detail-row">
          <div className="detail skeleton skeleton-text"></div>
          <div className="detail skeleton skeleton-text"></div>
        </div>
        <div className="detail-row">
          <div className="detail skeleton skeleton-text"></div>
          <div className="detail skeleton skeleton-text"></div>
        </div>
        <div className="detail-row">
          <div className="detail skeleton skeleton-text"></div>
        </div>

        <table className="tasks-table">
          <thead>
            <tr>
              <th className="skeleton skeleton-text"></th>
              <th className="skeleton skeleton-text"></th>
              <th className="skeleton skeleton-text"></th>
              <th className="skeleton skeleton-text"></th>
              <th className="skeleton skeleton-text"></th>
              <th className="skeleton skeleton-text"></th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr key={index}>
                <td className="skeleton skeleton-text"></td>
                <td className="skeleton skeleton-text"></td>
                <td className="skeleton skeleton-text"></td>
                <td className="skeleton skeleton-text"></td>
                <td className="skeleton skeleton-text"></td>
                <td className="skeleton skeleton-text"></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="buttons">
          <div className="skeleton skeleton-button"></div>
          <div className="skeleton skeleton-button"></div>
        </div>
      </div>
    </div>
  );
}

export default RecommendationLoader;
