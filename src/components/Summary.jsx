function Summary({ students }) {
  let presentCount = students.filter(
    (student) => student.status === "Present",
  ).length;

  let absentCount = students.filter(
    (student) => student.status === "Absent",
  ).length;

  let attendancePercent =
    students.length === 0
      ? 0
      : Math.round((presentCount / students.length) * 100);

  return (
    <section className="summary" aria-label="Attendance summary">
      <div>
        Total Students: <span>{students.length}</span>
      </div>
      <div>
        Present: <span>{presentCount}</span>
      </div>
      <div>
        Absent: <span>{absentCount}</span>
      </div>
      <div className="summary-percent">
        Attendance: <span>{attendancePercent}%</span>
        <div
          className="progress-bar"
          role="progressbar"
          aria-valuenow={attendancePercent}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div
            className="progress-bar-fill"
            style={{ width: `${attendancePercent}%` }}
          />
        </div>
      </div>
    </section>
  );
}

export default Summary;
