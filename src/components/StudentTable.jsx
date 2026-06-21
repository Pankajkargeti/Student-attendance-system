import { useState } from "react";

function StudentTable({
  students,
  hasStudents,
  onToggleAttendance,
  onDeleteStudent,
  onEditName,
  onViewHistory,
}) {
  const [editingId, setEditingId] = useState(null);

  const [editingValue, setEditingValue] = useState("");

  function startEditing(student) {
    setEditingId(student.id);
    setEditingValue(student.name);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditingValue("");
  }

  function saveEditing(id) {
    onEditName(id, editingValue);
    setEditingId(null);
    setEditingValue("");
  }

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
              {hasStudents
                ? "No students match your search."
                : "No students added yet. Add your first student above."}
            </td>
          </tr>
        )}
        {students.map((student) => {
          let attendanceButton =
            student.status === "Present" ? "Mark Absent" : "Mark Present";

          let isEditing = editingId === student.id;

          return (
            <tr key={student.id}>
              <td>{student.rollNo}</td>
              <td>
                {isEditing ? (
                  <div className="name-edit">
                    <label
                      className="visually-hidden"
                      htmlFor={`editName-${student.id}`}
                    >
                      Edit name for {student.name}
                    </label>
                    <input
                      id={`editName-${student.id}`}
                      type="text"
                      value={editingValue}
                      onChange={(event) => {
                        setEditingValue(event.target.value);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          saveEditing(student.id);
                        }
                        if (event.key === "Escape") {
                          cancelEditing();
                        }
                      }}
                      autoFocus
                    />
                    <button
                      className="save-name-btn"
                      type="button"
                      onClick={() => saveEditing(student.id)}
                    >
                      Save
                    </button>
                    <button
                      className="cancel-name-btn"
                      type="button"
                      onClick={cancelEditing}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  student.name
                )}
              </td>
              <td>
                <span
                  className={
                    student.status === "Present"
                      ? "status-badge status-present"
                      : "status-badge status-absent"
                  }
                >
                  {student.status}
                </span>
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
                <div className="row-actions">
                  {!isEditing && (
                    <button
                      className="edit-btn"
                      type="button"
                      onClick={() => startEditing(student)}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className="history-btn"
                    type="button"
                    onClick={() => onViewHistory(student.id)}
                  >
                    History
                  </button>
                  <button
                    className="delete-btn"
                    type="button"
                    onClick={() => {
                      onDeleteStudent(student.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default StudentTable;
