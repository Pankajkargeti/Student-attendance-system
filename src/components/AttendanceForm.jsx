function AttendanceForm(){
    return (
        <>
            <div className="date-section">
                <label htmlFor="attendanceDate">Attendance date</label>
                <input
                    id="attendanceDate"
                    type="date"
                    defaultValue={new Date().toISOString().slice(0, 10)}
                />
            </div>

            <form className="top-section">
                <label className="visually-hidden" htmlFor="studentInput">
                    Student name
                </label>
                <input
                    id="studentInput"
                    type="text"
                    placeholder="Enter student name"
                />
                <button className="add-btn" type="button" disabled>
                    Add Student
                </button>
                <button className="save-btn" type="button" disabled>
                    Save Attendance
                </button>
            </form>

            <div className="search-section">
                <label className="visually-hidden" htmlFor="searchInput">
                    Search students
                </label>
                <input
                    id="searchInput"
                    type="search"
                    placeholder="Search students by name"
                />
            </div>
        </>
    );
}

export default AttendanceForm;
