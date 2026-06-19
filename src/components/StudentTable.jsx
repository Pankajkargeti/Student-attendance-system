function StudentTable({ students, onToggleAttendance, onDeleteStudent }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Student ID</th>
          <th>Student Name</th>
          <th>Status</th>
          <th>Attendance</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {students.length === 0 && (
          <tr>
            <td className="empty-message" colSpan="5">
              No students match your search.
            </td>
          </tr>
        )}
        {students.map((student) => {
          let attendanceButton =
            student.status === "Present" ? "Mark Absent" : "Mark Present";

          return (
            <tr key={student.id}>
              <td>{student.rollNo}</td>
              <td>{student.name}</td>
              <td
                className={
                  student.status === "Present"
                    ? "status-present"
                    : "status-absent"
                }
              >
                {student.status}
              </td>
              <td>
                <button
                  className="attendance-btn"
                  type="button"
                  onClick={() => {
                    onToggleAttendance(student.id);
                  }}
                >
                  {attendanceButton}
                </button>
              </td>
              <td>
                <button
                  className="delete-btn"
                  type="button"
                  onClick={() => {
                    onDeleteStudent(student.id);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default StudentTable;
