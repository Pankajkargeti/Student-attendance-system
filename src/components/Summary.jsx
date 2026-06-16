function Summary({ students }){
    let presentCount =
    students.filter(student=>student.status === "Present").length;

    let absentCount =
    students.filter(student=>student.status === "Absent").length;

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
        </section>
    );
}

export default Summary;
