import "./SkeletonLoader.css";

function SkeletonLoader() {
  return (
    <div className="schedule-diff">
      <h3 className="skeleton skeleton-header" style={{ width: "200px" }}></h3>
      <div className="diff-tables">
        <div className="diff-table">
          <h4
            className="skeleton skeleton-header"
            style={{ width: "150px" }}
          ></h4>
          <table>
            <thead>
              <tr>
                {["Title", "Status", "Start Date", "Due Date", "Assignee"].map(
                  (heading, index) => (
                    <th
                      key={index}
                      className="skeleton skeleton-header"
                      style={{ width: `${100 / 5}%` }}
                    ></th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {Array(5)
                .fill()
                .map((_, index) => (
                  <tr key={index} className="diff-row">
                    {Array(5)
                      .fill()
                      .map((_, colIndex) => (
                        <td
                          key={colIndex}
                          className="skeleton skeleton-row"
                        ></td>
                      ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="diff-table">
          <h4
            className="skeleton skeleton-header"
            style={{ width: "200px" }}
          ></h4>
          <table>
            <thead>
              <tr>
                {["Title", "Status", "Start Date", "Due Date", "Assignee"].map(
                  (heading, index) => (
                    <th
                      key={index}
                      className="skeleton skeleton-header"
                      style={{ width: `${100 / 5}%` }}
                    ></th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {Array(5)
                .fill()
                .map((_, index) => (
                  <tr key={index} className="diff-row">
                    {Array(5)
                      .fill()
                      .map((_, colIndex) => (
                        <td
                          key={colIndex}
                          className="skeleton skeleton-row"
                        ></td>
                      ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="reasons">
        <h3
          className="skeleton skeleton-header"
          style={{ width: "200px" }}
        ></h3>
        <ul>
          {Array(3)
            .fill()
            .map((_, index) => (
              <li
                key={index}
                className="skeleton skeleton-row"
                style={{ width: "90%" }}
              ></li>
            ))}
        </ul>
      </div>
      <div className="ok-rollback-btn">
        <button className="skeleton skeleton-btn"></button>
        <button className="skeleton skeleton-btn"></button>
      </div>
    </div>
  );
}

export default SkeletonLoader;
