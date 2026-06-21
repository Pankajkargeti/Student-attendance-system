function StudentHistory({ student, entries, presentPercent, onClose }) {
  return (
    <div
      className="history-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="historyTitle"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="history-panel">
        <div className="history-header">
          <h2 id="historyTitle">{student.name}'s Attendance History</h2>
          <button className="history-close-btn" type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <p className="history-subtitle">Student ID: {student.rollNo}</p>

        <div className="history-percent">
          <span>{presentPercent}% present overall</span>
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuenow={presentPercent}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div
              className="progress-bar-fill"
              style={{ width: `${presentPercent}%` }}
            />
          </div>
        </div>

        {entries.length === 0 ? (
          <p className="empty-message">
            No saved attendance yet for this student.
          </p>
        ) : (
          <ul className="history-list">
            {entries.map((entry) => (
              <li key={entry.date} className="history-entry">
                <span className="history-date">{entry.date}</span>
                <span
                  className={
                    entry.status === "Present"
                      ? "status-badge status-present"
                      : "status-badge status-absent"
                  }
                >
                  {entry.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default StudentHistory;
