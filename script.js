let students = JSON.parse(localStorage.getItem('students')) || [
    {
        code: "ST001",
        name: "أحمد محمد",
        image: "https://i.pravatar.cc/150?img=1",
        grade: "الصف الثالث الثانوي",
        attendanceRate: 95,
        grades: {
            "الرياضيات": 92,
            "اللغة العربية": 88,
            "العلوم": 95,
            "التاريخ": 85,
            "اللغة الإنجليزية": 90
        },
        achievements: [
            "الفوز بالمركز الأول في مسابقة الرياضيات",
            "المشاركة في معرض العلوم السنوي",
            "عضو في نادي اللغة العربية"
        ]
    },
    {
        code: "ST002",
        name: "فاطمة علي",
        image: "https://i.pravatar.cc/150?img=5",
        grade: "الصف الثاني الثانوي",
        attendanceRate: 98,
        grades: {
            "الرياضيات": 88,
            "اللغة العربية": 95,
            "العلوم": 90,
            "التاريخ": 92,
            "اللغة الإنجليزية": 87
        },
        achievements: [
            "الفوز بجائزة أفضل مقال أدبي",
            "قائدة فريق المناظرات المدرسية",
            "متطوعة في حملة التوعية البيئية"
        ]
    },
    {
        code: "ST003",
        name: "يوسف خالد",
        image: "https://i.pravatar.cc/150?img=8",
        grade: "الصف الأول الثانوي",
        attendanceRate: 92,
        grades: {
            "الرياضيات": 85,
            "اللغة العربية": 80,
            "العلوم": 98,
            "التاريخ": 88,
            "اللغة الإنجليزية": 92
        },
        achievements: [
            "الفوز بالمركز الأول في مسابقة العلوم",
            "عضو في فريق الروبوتات المدرسي",
            "مشارك في برنامج تبادل الطلاب الدولي"
        ]
    }
];

const subjectIcons = {
    "الرياضيات": "fas fa-calculator",
    "اللغة العربية": "fas fa-language",
    "العلوم": "fas fa-flask",
    "التاريخ": "fas fa-landmark",
    "اللغة الإنجليزية": "fas fa-globe"
};

function searchStudent() {
    const code = document.getElementById("studentCode").value;
    const student = students.find(s => s.code === code);
    const studentInfo = document.getElementById("studentInfo");
    
    if (student) {
        document.getElementById("studentImage").src = student.image;
        document.getElementById("studentName").textContent = student.name;
        document.getElementById("studentGrade").textContent = student.grade;
        
        const attendanceProgress = document.getElementById("attendanceProgress");
        attendanceProgress.style.width = `${student.attendanceRate}%`;
        document.getElementById("attendanceRate").textContent = `${student.attendanceRate}%`;
        
        const gradesList = document.getElementById("grades");
        gradesList.innerHTML = "";
        for (const [subject, grade] of Object.entries(student.grades)) {
            const li = document.createElement("li");
            li.innerHTML = `
                <i class="${subjectIcons[subject]}"></i>
                ${subject}: ${grade}
                <div class="grade-bar">
                    <div class="grade-progress" style="width: ${grade}%; background-color: ${getColorForGrade(grade)}"></div>
                </div>
            `;
            gradesList.appendChild(li);
        }
        
        const achievementsList = document.getElementById("achievements");
        achievementsList.innerHTML = "";
        student.achievements.forEach(achievement => {
            const li = document.createElement("li");
            li.textContent = achievement;
            achievementsList.appendChild(li);
        });
        
        studentInfo.classList.remove("hidden");
        studentInfo.classList.add("fade-in");
        animateProgressBars();
    } else {
        alert("لم يتم العثور على الطالب");
        studentInfo.classList.add("hidden");
    }
}

function getColorForGrade(grade) {
    if (grade >= 90) return "#2ecc71";
    if (grade >= 80) return "#3498db";
    if (grade >= 70) return "#f1c40f";
    if (grade >= 60) return "#e67e22";
    return "#e74c3c";
}

function animateProgressBars() {
    anime({
        targets: '.progress, .grade-progress',
        width: function(el) {
            return el.getAttribute('style').split(':')[1];
        },
        easing: 'easeInOutQuad',
        duration: 1000,
        delay: anime.stagger(200)
    });
}

function loadStudentList() {
    const select = document.getElementById("studentSelect");
    if (select) {
        select.innerHTML = "<option value=''>اختر طالبًا</option>";
        students.forEach(student => {
            const option = document.createElement("option");
            option.value = student.code;
            option.textContent = `${student.name} (${student.code})`;
            select.appendChild(option);
        });
    }
}

function loadStudentForEdit() {
    const code = document.getElementById("studentSelect").value;
    const student = students.find(s => s.code === code);
    if (student) {
        document.getElementById("editCode").value = student.code;
        document.getElementById("editName").value = student.name;
        document.getElementById("editGrade").value = student.grade;
        document.getElementById("editAttendance").value = student.attendanceRate;
        document.getElementById("editImage").value = student.image;
        document.getElementById("editGrades").value = Object.entries(student.grades).map(([subject, grade]) => `${subject}: ${grade}`).join(", ");
        document.getElementById("editAchievements").value = student.achievements.join(", ");
    }
}

function saveStudentChanges() {
    const code = document.getElementById("editCode").value;
    const existingStudentIndex = students.findIndex(s => s.code === code);
    
    const updatedStudent = {
        code: code,
        name: document.getElementById("editName").value,
        grade: document.getElementById("editGrade").value,
        attendanceRate: parseInt(document.getElementById("editAttendance").value),
        image: document.getElementById("editImage").value,
        grades: {},
        achievements: document.getElementById("editAchievements").value.split(", ")
    };
    
    const gradesText = document.getElementById("editGrades").value;
    gradesText.split(", ").forEach(gradeItem => {
        const [subject, grade] = gradeItem.split(": ");
        updatedStudent.grades[subject] = parseInt(grade);
    });
    
    if (existingStudentIndex !== -1) {
        students[existingStudentIndex] = updatedStudent;
        alert("تم تحديث بيانات الطالب بنجاح");
    } else {
        students.push(updatedStudent);
        alert("تم إضافة الطالب الجديد بنجاح");
    }
    
    localStorage.setItem('students', JSON.stringify(students));
    loadStudentList();
    clearEditForm();
}

function clearEditForm() {
    document.getElementById("editCode").value = "";
    document.getElementById("editName").value = "";
    document.getElementById("editGrade").value = "";
    document.getElementById("editAttendance").value = "";
    document.getElementById("editImage").value = "";
    document.getElementById("editGrades").value = "";
    document.getElementById("editAchievements").value = "";
}

if (document.getElementById("addNewStudentBtn")) {
    document.getElementById("addNewStudentBtn").addEventListener("click", function() {
        clearEditForm();
        document.getElementById("studentSelect").value = "";
    });
}

window.onload = function() {
    if (document.getElementById("studentSearch")) {
        anime({
            targets: '.search-container',
            translateY: [50, 0],
            opacity: [0, 1],
            easing: 'easeOutElastic(1, .8)',
            duration: 1500
        });
        
        anime({
            targets: '.btn, .search-input',
            scale: [0.9, 1],
            
            opacity: [0, 1],
            easing: 'easeOutElastic(1, .8)',
            duration: 1500,
            delay: anime.stagger(100)
        });
    }
    
    loadStudentList();
};