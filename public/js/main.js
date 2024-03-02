document.addEventListener('DOMContentLoaded', () => {
    // Get exercise form
    const exerciseForm = document.getElementById('exercise-form');

    console.log(exerciseForm);

    // Attach userId to form action
    exerciseForm.addEventListener('submit', (e) => {
        const userId = exerciseForm.querySelector('#userId').value;
        exerciseForm.action = `/api/users/${userId}/exercises`;
        exerciseForm.submit();
    });
});