document.addEventListener('DOMContentLoaded', () => {
    const scheduleGrid = document.getElementById('schedule-grid');
    const todoList = document.getElementById('todo-list');

    const schedules = [
        { day: '8/22 화', tasks: [{ name: '보강 19', complete: true }, { name: '서술 01', complete: false }] },
        { day: '8/23 수', tasks: [{ name: '보강 23', complete: true }, { name: '서술 11', complete: false }] },
        { day: '8/24 목', tasks: [{ name: '서술 05', complete: true }] },
        { day: '8/25 금', tasks: [{ name: '서술 01', complete: false }, { name: '서술 11', complete: false }] },
    ];

    const todos = [
        { subject: '국어', task: '역할놀이하기 01' },
        { subject: '수학', task: '보강 23' },
        { subject: '과학', task: '서술 05' },
    ];

    function renderSchedules() {
        scheduleGrid.innerHTML = '';
        schedules.forEach(schedule => {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('schedule-day');
            const dayTitle = document.createElement('h3');
            dayTitle.textContent = schedule.day;
            dayDiv.appendChild(dayTitle);
            schedule.tasks.forEach(task => {
                const taskDiv = document.createElement('div');
                taskDiv.classList.add('task');
                if (task.complete) {
                    taskDiv.classList.add('complete');
                }
                taskDiv.textContent = task.name;
                dayDiv.appendChild(taskDiv);
            });
            scheduleGrid.appendChild(dayDiv);
        });
    }

    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach(todo => {
            const todoItem = document.createElement('li');
            todoItem.classList.add('todo-item', 'subject');
            todoItem.textContent = `${todo.subject}: ${todo.task}`;
            todoList.appendChild(todoItem);
        });
    }

    renderSchedules();
    renderTodos();
});
