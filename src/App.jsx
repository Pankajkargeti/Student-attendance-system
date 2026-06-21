import { useEffect, useState } from "react";
import AttendanceForm from "./components/AttendanceForm";
import Header from "./components/Header";
import StudentTable from "./components/StudentTable";
import Summary from "./components/Summary";
import StudentHistory from "./components/StudentHistory";
import Footer from "./components/Footer";

const STUDENT_STORAGE_KEY = "attendanceStudents";
const RECORD_STORAGE_KEY = "attendanceRecords";

const defaultStudents = [
  {
    id: 1,
    rollNo: "101",
    name: "Anurag Kumar",
    status: "Present",
  },
  {
    id: 2,
    rollNo: "102",
    name: "Simran Sharma",
    status: "Absent",
  },
];

function getToday() {
  let date = new Date();
  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function loadStudents() {
  let savedStudents = localStorage.getItem(STUDENT_STORAGE_KEY);

  if (savedStudents === null) {
    return defaultStudents;
  }

  try {
    let parsedStudents = JSON.parse(savedStudents);

    return Array.isArray(parsedStudents) ? parsedStudents : defaultStudents;
  } catch (error) {
    return defaultStudents;
  }
}

function loadAttendanceRecords(students, today) {
  let savedRecords = localStorage.getItem(RECORD_STORAGE_KEY);

  if (savedRecords === null) {
    let firstRecord = {};

    students.forEach((student) => {
      firstRecord[student.id] = student.status || "Present";
    });

    return {
      [today]: firstRecord,
    };
  }

  try {
    let parsedRecords = JSON.parse(savedRecords);

    return typeof parsedRecords === "object" && parsedRecords !== null
      ? parsedRecords
      : {};
  } catch (error) {
    return {};
  }
}

function App() {
  const [selectedDate, setSelectedDate] = useState(getToday());

  const [students, setStudents] = useState(loadStudents);

  const [attendanceRecords, setAttendanceRecords] = useState(() =>
    loadAttendanceRecords(students, selectedDate),
  );

  const [studentName, setStudentName] = useState("");

  const [studentRollNo, setStudentRollNo] = useState("");

  const [searchText, setSearchText] = useState("");

  const [formMessage, setFormMessage] = useState("");

  const [historyStudentId, setHistoryStudentId] = useState(null);

  useEffect(() => {
    localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(RECORD_STORAGE_KEY, JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  function getAttendanceStatus(id) {
    return attendanceRecords[selectedDate]?.[id] || "Present";
  }

  function addStudent(event) {
    event.preventDefault();

    let name = studentName.trim();
    let rollNo = studentRollNo.trim();

    if (name === "") {
      setFormMessage("Please enter a student name.");
      return;
    }

    if (rollNo === "") {
      setFormMessage("Please enter a student ID / roll number.");
      return;
    }

    let isDuplicateRollNo = students.some(
      (student) => student.rollNo === rollNo,
    );

    if (isDuplicateRollNo) {
      setFormMessage(
        `Student ID "${rollNo}" is already in use. Please enter a unique ID.`,
      );
      return;
    }

    setStudents((currentStudents) => {
      let nextId =
        Math.max(...currentStudents.map((student) => student.id), 0) + 1;

      return [
        ...currentStudents,
        {
          id: nextId,
          rollNo: rollNo,
          name: name,
        },
      ];
    });

    setStudentName("");
    setStudentRollNo("");
    setFormMessage("");
  }

  function updateStudentName(name) {
    setStudentName(name);
    setFormMessage("");
  }

  function updateStudentRollNo(rollNo) {
    setStudentRollNo(rollNo);
    setFormMessage("");
  }

  function editStudentName(id, newName) {
    let trimmedName = newName.trim();

    if (trimmedName === "") {
      return;
    }

    setStudents((currentStudents) =>
      currentStudents.map((student) =>
        student.id === id ? { ...student, name: trimmedName } : student,
      ),
    );
  }

  function resetSelectedDate() {
    let shouldReset = window.confirm(
      `Reset attendance for ${selectedDate}? Everyone will be set back to unmarked for this date only.`,
    );

    if (!shouldReset) {
      return;
    }

    setAttendanceRecords((currentRecords) => {
      let updatedRecords = { ...currentRecords };
      delete updatedRecords[selectedDate];
      return updatedRecords;
    });
  }

  function toggleAttendance(id) {
    let currentStatus = getAttendanceStatus(id);

    setAttendanceRecords((currentRecords) => ({
      ...currentRecords,
      [selectedDate]: {
        ...currentRecords[selectedDate],
        [id]: currentStatus === "Present" ? "Absent" : "Present",
      },
    }));
  }

  function markAllPresent() {
    setAttendanceRecords((currentRecords) => {
      let updatedDateRecord = {
        ...currentRecords[selectedDate],
      };

      students.forEach((student) => {
        updatedDateRecord[student.id] = "Present";
      });

      return {
        ...currentRecords,
        [selectedDate]: updatedDateRecord,
      };
    });
  }

  function deleteStudent(id) {
    let student = students.find((student) => student.id === id);
    let studentName = student?.name || "this student";
    let shouldDelete = window.confirm(
      `Delete ${studentName}? This will also remove their attendance records.`,
    );

    if (!shouldDelete) {
      return;
    }

    setStudents((currentStudents) =>
      currentStudents.filter((student) => student.id !== id),
    );

    setAttendanceRecords((currentRecords) => {
      let updatedRecords = {};

      Object.keys(currentRecords).forEach((date) => {
        updatedRecords[date] = {
          ...currentRecords[date],
        };

        delete updatedRecords[date][id];
      });

      return updatedRecords;
    });
  }

  function saveAttendance() {
    let data = JSON.stringify(
      {
        date: selectedDate,
        students: studentsWithAttendance.map((student) => ({
          id: student.id,
          rollNo: student.rollNo,
          name: student.name,
          status: student.status,
        })),
      },
      null,
      2,
    );

    let blob = new Blob([data], {
      type: "application/json",
    });

    let fileUrl = URL.createObjectURL(blob);
    let link = document.createElement("a");

    link.href = fileUrl;
    link.download = `attendance-${selectedDate}.json`;
    link.click();

    setTimeout(() => {
      URL.revokeObjectURL(fileUrl);
    }, 0);
  }

  let studentsWithAttendance = students.map((student) => ({
    ...student,
    status: getAttendanceStatus(student.id),
  }));

  let visibleStudents = studentsWithAttendance.filter((student) =>
    student.name.toLowerCase().includes(searchText.trim().toLowerCase()),
  );

  let savedDates = Object.keys(attendanceRecords).sort().reverse();

  let historyStudent =
    historyStudentId === null
      ? null
      : students.find((student) => student.id === historyStudentId) || null;

  let historyEntries =
    historyStudent === null
      ? []
      : Object.keys(attendanceRecords)
          .filter(
            (date) => attendanceRecords[date]?.[historyStudentId] !== undefined,
          )
          .sort()
          .reverse()
          .map((date) => ({
            date,
            status: attendanceRecords[date][historyStudentId],
          }));

  let historyPresentPercent =
    historyEntries.length === 0
      ? 0
      : Math.round(
          (historyEntries.filter((entry) => entry.status === "Present").length /
            historyEntries.length) *
            100,
        );

  return (
    <main className="container">
      <Header />
      <AttendanceForm
        selectedDate={selectedDate}
        savedDates={savedDates}
        studentName={studentName}
        studentRollNo={studentRollNo}
        searchText={searchText}
        formMessage={formMessage}
        onDateChange={setSelectedDate}
        onStudentNameChange={updateStudentName}
        onStudentRollNoChange={updateStudentRollNo}
        onSearchTextChange={setSearchText}
        onAddStudent={addStudent}
        onSaveAttendance={saveAttendance}
        onMarkAllPresent={markAllPresent}
        onResetDate={resetSelectedDate}
        hasStudents={students.length > 0}
        hasRecordForDate={
          !!attendanceRecords[selectedDate] &&
          Object.keys(attendanceRecords[selectedDate]).length > 0
        }
      />
      <StudentTable
        students={visibleStudents}
        hasStudents={students.length > 0}
        onToggleAttendance={toggleAttendance}
        onDeleteStudent={deleteStudent}
        onEditName={editStudentName}
        onViewHistory={setHistoryStudentId}
      />
      <Summary students={studentsWithAttendance} />
      {historyStudent !== null && (
        <StudentHistory
          student={historyStudent}
          entries={historyEntries}
          presentPercent={historyPresentPercent}
          onClose={() => setHistoryStudentId(null)}
        />
      )}
      <Footer />
    </main>
  );
}

export default App;
