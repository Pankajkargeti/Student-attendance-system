const STORAGE_KEY = "attendanceStudents";
const ATTENDANCE_STORAGE_KEY = "attendanceRecords";
const today = getToday();

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

let students = loadStudents();

let attendanceRecords =
loadAttendanceRecords();

let idCounter =
Math.max(...students.map(student=>student.id), 0) + 1;

const input =
document.getElementById("studentInput");

const attendanceDate =
document.getElementById("attendanceDate");

const studentForm =
document.getElementById("studentForm");

const formMessage =
document.getElementById("formMessage");

const saveBtn =
document.getElementById("saveBtn");

const tableBody =
document.getElementById("studentTable");

const total =
document.getElementById("total");

const present =
document.getElementById("present");

const absent =
document.getElementById("absent");


// Get today's date for the date selector
function getToday(){

    let date = new Date();

    let year = date.getFullYear();
    let month = String(date.getMonth()+1).padStart(2,"0");
    let day = String(date.getDate()).padStart(2,"0");

    return `${year}-${month}-${day}`;
}


// Load saved students
function loadStudents(){

    let savedStudents =
    localStorage.getItem(STORAGE_KEY);

    if(savedStudents===null){
        return defaultStudents;
    }

    try{
        let parsedStudents =
        JSON.parse(savedStudents);

        return Array.isArray(parsedStudents)
        ?parsedStudents
        :defaultStudents;
    }
    catch(error){
        return defaultStudents;
    }
}


// Load saved attendance records
function loadAttendanceRecords(){

    let savedRecords =
    localStorage.getItem(ATTENDANCE_STORAGE_KEY);

    if(savedRecords===null){
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
        let parsedRecords =
        JSON.parse(savedRecords);

        return typeof parsedRecords === "object"
        && parsedRecords !== null
        ?parsedRecords
        :{};
    }
    catch(error){
        return {};
    }
}


// Save students in the browser
function saveStudents(){

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(students)
    );
}


// Save attendance records in the browser
function saveAttendanceRecords(){

    localStorage.setItem(
        ATTENDANCE_STORAGE_KEY,
        JSON.stringify(attendanceRecords)
    );
}


// Get a student's attendance for the selected date
function getAttendanceStatus(id){

    let selectedDate = attendanceDate.value;

    if(attendanceRecords[selectedDate]===undefined){
        return "Present";
    }

    return attendanceRecords[selectedDate][id]
    || "Present";
}


// Display Students
function displayStudents(){

    tableBody.innerHTML = "";

    students.forEach(student => {

        let status =
        getAttendanceStatus(student.id);

        let row =
        document.createElement("tr");

        row.innerHTML = `
        <td>${student.id}</td>

        <td>${student.name}</td>

        <td class="${
            status==="Present"
            ?"status-present"
            :"status-absent"
        }">
            ${status}
        </td>

        <td>
            <button
            class="attendance-btn"
            onclick="toggleAttendance(${student.id})">

            ${
                status==="Present"
                ?"Mark Absent"
                :"Mark Present"
            }

            </button>
        </td>

        <td>
            <button
            class="delete-btn"
            onclick="deleteStudent(${student.id})">
            Delete
            </button>
        </td>
        `;

        tableBody.appendChild(row);
    });

    updateSummary();
}


// Add Student
studentForm.addEventListener("submit",(event)=>{

    event.preventDefault();

    let name =
    input.value.trim();

    if(name===""){
        formMessage.textContent =
        "Please enter a student name.";

        input.focus();
        return;
    }

    students.push({
        id:idCounter++,
        name:name,
        status:"Present"
    });

    input.value="";
    formMessage.textContent = "";

    displayStudents();
    saveStudents();
});


input.addEventListener("input",()=>{

    formMessage.textContent = "";
});


attendanceDate.addEventListener("change",()=>{

    displayStudents();
});


// Toggle Attendance
function toggleAttendance(id){

    let selectedDate =
    attendanceDate.value;

    if(attendanceRecords[selectedDate]===undefined){
        attendanceRecords[selectedDate] = {};
    }

    let status =
    getAttendanceStatus(id);

    attendanceRecords[selectedDate][id] =
    status==="Present"
    ?"Absent"
    :"Present";

    displayStudents();
    saveAttendanceRecords();
}


// Delete Student
function deleteStudent(id){

    students =
    students.filter(student=>
        student.id!==id
    );

    Object.keys(attendanceRecords).forEach(date=>{
        delete attendanceRecords[date][id];
    });

    displayStudents();
    saveStudents();
    saveAttendanceRecords();
}


// Update Summary
function updateSummary(){

    total.textContent =
    students.length;

    let presentCount =
    students.filter(student=>
        getAttendanceStatus(student.id)==="Present"
    ).length;

    let absentCount =
    students.filter(student=>
        getAttendanceStatus(student.id)==="Absent"
    ).length;

    present.textContent =
    presentCount;

    absent.textContent =
    absentCount;
}


// Save Attendance
saveBtn.addEventListener("click",()=>{

    let data =
    JSON.stringify(
        {
            date:attendanceDate.value,
            students:students.map(student=>({
                id:student.id,
                name:student.name,
                status:getAttendanceStatus(student.id)
            }))
        },
        null,
        2
    );

    let blob =
    new Blob([data],{
        type:"application/json"
    });

    let link =
    document.createElement("a");

    link.href =
    URL.createObjectURL(blob);

    link.download =
    "attendance.json";

    link.click();
});


// Initial Load
attendanceDate.value = today;
displayStudents();
