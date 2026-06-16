function AttendanceForm({
    selectedDate,
    studentName,
    searchText,
    formMessage,
    onDateChange,
    onStudentNameChange,
    onSearchTextChange,
    onAddStudent
}){
    return (
        <>
            <div className="date-section">
                <label htmlFor="attendanceDate">Attendance date</label>
                <input
                    id="attendanceDate"
                    type="date"
                    value={selectedDate}
                    onChange={event=>{
                        onDateChange(event.target.value);
                    }}
                />
            </div>

            <form className="top-section" onSubmit={onAddStudent}>
                <label className="visually-hidden" htmlFor="studentInput">
                    Student name
                </label>
                <input
                    id="studentInput"
                    type="text"
                    placeholder="Enter student name"
                    value={studentName}
                    onChange={event=>{
                        onStudentNameChange(event.target.value);
                    }}
                />
                <button className="add-btn" type="submit">
                    Add Student
                </button>
                <button className="save-btn" type="button" disabled>
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
                    onChange={event=>{
                        onSearchTextChange(event.target.value);
                    }}
                />
            </div>
        </>
    );
}

export default AttendanceForm;
