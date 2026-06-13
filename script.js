const STORAGE_KEY = "attendanceStudents";

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

let idCounter =
Math.max(...students.map(student=>student.id), 0) + 1;

const input =
document.getElementById("studentInput");

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


// Save students in the browser
function saveStudents(){

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(students)
    );
}


// Display Students
function displayStudents(){

    tableBody.innerHTML = "";

    students.forEach(student => {

        let row =
        document.createElement("tr");

        row.innerHTML = `
        <td>${student.id}</td>

        <td>${student.name}</td>

        <td class="${
            student.status==="Present"
            ?"status-present"
            :"status-absent"
        }">
            ${student.status}
        </td>

        <td>
            <button
            class="attendance-btn"
            onclick="toggleAttendance(${student.id})">

            ${
                student.status==="Present"
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


// Toggle Attendance
function toggleAttendance(id){

    students.forEach(student=>{

        if(student.id===id){

            student.status =
            student.status==="Present"
            ?"Absent"
            :"Present";
        }
    });

    displayStudents();
    saveStudents();
}


// Delete Student
function deleteStudent(id){

    students =
    students.filter(student=>
        student.id!==id
    );

    displayStudents();
    saveStudents();
}


// Update Summary
function updateSummary(){

    total.textContent =
    students.length;

    let presentCount =
    students.filter(student=>
        student.status==="Present"
    ).length;

    let absentCount =
    students.filter(student=>
        student.status==="Absent"
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
        students,
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
displayStudents();
