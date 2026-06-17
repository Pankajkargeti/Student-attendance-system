import { useEffect, useState } from "react";
import AttendanceForm from "./components/AttendanceForm";
import Header from "./components/Header";
import StudentTable from "./components/StudentTable";
import Summary from "./components/Summary";

const STUDENT_STORAGE_KEY = "attendanceStudents";
const RECORD_STORAGE_KEY = "attendanceRecords";

const defaultStudents = [
    {
        id:1,
        name:"Anurag Kumar",
        status:"Present"
    },
    {
        id:2,
        name:"Simran Sharma",
        status:"Absent"
    }
];

function getToday(){
    let date = new Date();
    let year = date.getFullYear();
    let month = String(date.getMonth()+1).padStart(2, "0");
    let day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function loadStudents(){
    let savedStudents =
    localStorage.getItem(STUDENT_STORAGE_KEY);

    if(savedStudents === null){
        return defaultStudents;
    }

    try{
        let parsedStudents = JSON.parse(savedStudents);

        return Array.isArray(parsedStudents)
        ?parsedStudents
        :defaultStudents;
    }
    catch(error){
        return defaultStudents;
    }
}

function loadAttendanceRecords(students, today){
    let savedRecords =
    localStorage.getItem(RECORD_STORAGE_KEY);

    if(savedRecords === null){
        let firstRecord = {};

        students.forEach(student=>{
            firstRecord[student.id] =
            student.status || "Present";
        });

        return {
            [today]:firstRecord
        };
    }

    try{
        let parsedRecords = JSON.parse(savedRecords);

        return typeof parsedRecords === "object"
        && parsedRecords !== null
        ?parsedRecords
        :{};
    }
    catch(error){
        return {};
    }
}

function App(){
    const [selectedDate, setSelectedDate] =
    useState(getToday());

    const [students, setStudents] =
    useState(loadStudents);

    const [attendanceRecords, setAttendanceRecords] =
    useState(()=>loadAttendanceRecords(students, selectedDate));

    const [studentName, setStudentName] =
    useState("");

    const [searchText, setSearchText] =
    useState("");

    const [formMessage, setFormMessage] =
    useState("");

    useEffect(()=>{
        localStorage.setItem(
            STUDENT_STORAGE_KEY,
            JSON.stringify(students)
        );
    }, [students]);

    useEffect(()=>{
        localStorage.setItem(
            RECORD_STORAGE_KEY,
            JSON.stringify(attendanceRecords)
        );
    }, [attendanceRecords]);

    function getAttendanceStatus(id){
        return attendanceRecords[selectedDate]?.[id]
        || "Present";
    }

    function addStudent(event){
        event.preventDefault();

        let name = studentName.trim();

        if(name === ""){
            setFormMessage("Please enter a student name.");
            return;
        }

        setStudents(currentStudents=>{
            let nextId =
            Math.max(...currentStudents.map(student=>student.id), 0) + 1;

            return [
                ...currentStudents,
                {
                    id:nextId,
                    name:name
                }
            ];
        });

        setStudentName("");
        setFormMessage("");
    }

    function updateStudentName(name){
        setStudentName(name);
        setFormMessage("");
    }

    function toggleAttendance(id){
        let currentStatus = getAttendanceStatus(id);

        setAttendanceRecords(currentRecords=>({
            ...currentRecords,
            [selectedDate]:{
                ...currentRecords[selectedDate],
                [id]:currentStatus === "Present"
                ?"Absent"
                :"Present"
            }
        }));
    }

    function deleteStudent(id){
        setStudents(currentStudents=>
            currentStudents.filter(student=>student.id !== id)
        );

        setAttendanceRecords(currentRecords=>{
            let updatedRecords = {};

            Object.keys(currentRecords).forEach(date=>{
                updatedRecords[date] = {
                    ...currentRecords[date]
                };

                delete updatedRecords[date][id];
            });

            return updatedRecords;
        });
    }

    function saveAttendance(){
        let data = JSON.stringify(
            {
                date:selectedDate,
                students:studentsWithAttendance.map(student=>({
                    id:student.id,
                    name:student.name,
                    status:student.status
                }))
            },
            null,
            2
        );

        let blob = new Blob([data], {
            type:"application/json"
        });

        let fileUrl = URL.createObjectURL(blob);
        let link = document.createElement("a");

        link.href = fileUrl;
        link.download = `attendance-${selectedDate}.json`;
        link.click();

        setTimeout(()=>{
            URL.revokeObjectURL(fileUrl);
        }, 0);
    }

    let studentsWithAttendance = students.map(student=>({
        ...student,
        status:getAttendanceStatus(student.id)
    }));

    let visibleStudents = studentsWithAttendance.filter(student=>
        student.name.toLowerCase().includes(
            searchText.trim().toLowerCase()
        )
    );

    return (
        <main className="container">
            <Header />
            <AttendanceForm
                selectedDate={selectedDate}
                studentName={studentName}
                searchText={searchText}
                formMessage={formMessage}
                onDateChange={setSelectedDate}
                onStudentNameChange={updateStudentName}
                onSearchTextChange={setSearchText}
                onAddStudent={addStudent}
                onSaveAttendance={saveAttendance}
            />
            <StudentTable
                students={visibleStudents}
                onToggleAttendance={toggleAttendance}
                onDeleteStudent={deleteStudent}
            />
            <Summary students={studentsWithAttendance} />
        </main>
    );
}

export default App;
