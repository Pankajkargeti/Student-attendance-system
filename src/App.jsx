import AttendanceForm from "./components/AttendanceForm";
import Header from "./components/Header";
import StudentTable from "./components/StudentTable";
import Summary from "./components/Summary";

const students = [
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
    return (
        <main className="container">
            <Header />
            <AttendanceForm />
            <StudentTable students={students} />
            <Summary students={students} />
        </main>
    );
}

export default App;
