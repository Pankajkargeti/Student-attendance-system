import { useState } from "react";
import AttendanceForm from "./components/AttendanceForm";
import Header from "./components/Header";
import StudentTable from "./components/StudentTable";
import Summary from "./components/Summary";

const initialStudents = [
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

function App(){
    const [students, setStudents] =
    useState(initialStudents);

    const [studentName, setStudentName] =
    useState("");

    const [formMessage, setFormMessage] =
    useState("");

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
                    name:name,
                    status:"Present"
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
        setStudents(currentStudents=>
            currentStudents.map(student=>
                student.id === id
                ?{
                    ...student,
                    status:student.status === "Present"
                    ?"Absent"
                    :"Present"
                }
                :student
            )
        );
    }

    function deleteStudent(id){
        setStudents(currentStudents=>
            currentStudents.filter(student=>student.id !== id)
        );
    }

    return (
        <main className="container">
            <Header />
            <AttendanceForm
                studentName={studentName}
                formMessage={formMessage}
                onStudentNameChange={updateStudentName}
                onAddStudent={addStudent}
            />
            <StudentTable
                students={students}
                onToggleAttendance={toggleAttendance}
                onDeleteStudent={deleteStudent}
            />
            <Summary students={students} />
        </main>
    );
}

export default App;
