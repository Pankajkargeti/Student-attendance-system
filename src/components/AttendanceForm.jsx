function AttendanceForm({
  selectedDate,
  savedDates,
  studentName,
  studentRollNo,
  searchText,
  formMessage,
  onDateChange,
  onStudentNameChange,
  onStudentRollNoChange,
  onSearchTextChange,
  onAddStudent,
  onSaveAttendance,
}) {
  return (
    <>
      <div className="date-section">
        <label htmlFor="attendanceDate">Attendance date</label>
        <input
          id="attendanceDate"
          type="date"
          value={selectedDate}
          onChange={(event) => {
            onDateChange(event.target.value);
          }}
        />

        {savedDates.length > 0 && (
          <div className="saved-dates">
            <label className="visually-hidden" htmlFor="savedDateSelect">
              Browse saved attendance dates
            </label>
            <select
              id="savedDateSelect"
              value={selectedDate}
              onChange={(event) => {
                onDateChange(event.target.value);
              }}
            >
              <option value={selectedDate} disabled hidden>
                Browse saved dates ({savedDates.length})
              </option>
              {savedDates.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <form className="top-section" onSubmit={onAddStudent}>
        <label className="visually-hidden" htmlFor="rollNoInput">
          Student ID
        </label>
        <input
          id="rollNoInput"
          type="text"
          placeholder="Student ID / Roll No."
          value={studentRollNo}
          onChange={(event) => {
            onStudentRollNoChange(event.target.value);
          }}
        />
        <label className="visually-hidden" htmlFor="studentInput">
          Student name
        </label>
        <input
          id="studentInput"
          type="text"
          placeholder="Enter student name"
          value={studentName}
          onChange={(event) => {
            onStudentNameChange(event.target.value);
          }}
        />
        <button className="add-btn" type="submit">
          Add Student
        </button>
        <button className="save-btn" type="button" onClick={onSaveAttendance}>
          Save Attendance
        </button>
      </form>

      <p className="form-message" aria-live="polite">
        {formMessage}
      </p>

      <div className="search-section">
        <label className="visually-hidden" htmlFor="searchInput">
          Search students
        </label>
        <input
          id="searchInput"
          type="search"
          placeholder="Search students by name"
          value={searchText}
          onChange={(event) => {
            onSearchTextChange(event.target.value);
          }}
        />
      </div>
    </>
  );
}

export default AttendanceForm;
