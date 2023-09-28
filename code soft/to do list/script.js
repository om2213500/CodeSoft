document.addEventListener('DOMContentLoaded', function () {
    const taskList = document.getElementById('tasks');
    const taskInput = document.getElementById('task-input');
    const addTaskButton = document.getElementById('add-task');

    // Load tasks from local storage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Function to render tasks
    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <div class="task">
                    <span>${task}</span>
                    <span class="delete-task" data-index="${index}">Delete</span>
                </div>
            `;
            taskList.appendChild(listItem);
        });
    }

    // Initial rendering of tasks
    renderTasks();

    // Event listener for adding a new task
    addTaskButton.addEventListener('click', function () {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            tasks.push(taskText);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            taskInput.value = '';
            renderTasks();
        }
    });

    // Event listener for deleting a task
    taskList.addEventListener('click', function (e) {
        if (e.target.classList.contains('delete-task')) {
            const index = e.target.getAttribute('data-index');
            tasks.splice(index, 1);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
        }
    });
});

const apiBaseUrl = 'http://localhost:3000'; // Update with your server URL

// Event listener for adding a new task
addTaskButton.addEventListener('click', function () {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        // Make a POST request to the server
        fetch(`${apiBaseUrl}/api/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task: taskText }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                tasks.push(taskText);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                taskInput.value = '';
                renderTasks();
            }
        })
        .catch(error => console.error('Error:', error));
    }
});

// Event listener for deleting a task
taskList.addEventListener('click', function (e) {
    if (e.target.classList.contains('delete-task')) {
        const index = e.target.getAttribute('data-index');
        // Make a DELETE request to the server
        fetch(`${apiBaseUrl}/api/tasks`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ index }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                tasks.splice(index, 1);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                renderTasks();
            }
        })
        .catch(error => console.error('Error:', error));
    }
});
