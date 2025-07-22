document.addEventListener('DOMContentLoaded', () => {
    const studentsSelect = document.getElementById('students');
    const meetingForm = document.getElementById('meeting-form');
    const upcomingMeetingsDiv = document.getElementById('upcoming-meetings');
    const teacherUpcomingMeetingsDiv = document.getElementById('teacher-upcoming-meetings');

    // Populate the students dropdown
    if (studentsSelect) {
        const students = [
            { id: 'student1', name: 'Student 1' },
            { id: 'student2', name: 'Student 2' },
            { id: 'student3', name: 'Student 3' },
        ];

        students.forEach(student => {
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = student.name;
            studentsSelect.appendChild(option);
        });
    }

    // Handle meeting creation
   
});
