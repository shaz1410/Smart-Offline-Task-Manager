let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// ADD TASK
function addTask() {
    const text = document.getElementById("taskInput").value;
    const date = document.getElementById("taskDate").value;
    const priority = document.getElementById("priority").value;

    if (!text) return;

    tasks.push({
        id: Date.now(),
        text,
        date,
        priority,
        status: "todo"
    });

    saveTasks();
    renderTasks();
}

// SAVE
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// DELETE
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

// DRAG
function dragStart(e, id) {
    e.dataTransfer.setData("id", id);
}

function allowDrop(e) {
    e.preventDefault();
}

function drop(e, status) {
    const id = e.dataTransfer.getData("id");

    tasks = tasks.map(t => {
        if (t.id == id) t.status = status;
        return t;
    });

    saveTasks();
    renderTasks();
}

// RENDER
function renderTasks() {
    document.querySelectorAll(".column").forEach(col => col.innerHTML = `<h2>${col.id.toUpperCase()}</h2>`);

    const search = document.getElementById("search").value.toLowerCase();

    tasks
        .filter(t => t.text.toLowerCase().includes(search))
        .forEach(task => {
            const div = document.createElement("div");
            div.className = `task ${task.priority}`;
            div.draggable = true;

            div.innerHTML = `
                <strong>${task.text}</strong><br>
                <small>${task.date || ""}</small><br>
                <button onclick="deleteTask(${task.id})">Delete</button>
            `;

            div.ondragstart = (e) => dragStart(e, task.id);

            const column = document.getElementById(task.status);
            column.appendChild(div);
        });
}

// SETUP DROP ZONES
document.querySelectorAll(".column").forEach(col => {
    col.ondragover = allowDrop;
    col.ondrop = (e) => drop(e, col.id);
});

// THEME
document.getElementById("themeToggle").onclick = () => {
    document.body.classList.toggle("light");
};

// INIT
renderTasks();