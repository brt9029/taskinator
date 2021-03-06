let formEl = document.querySelector("#task-form");
let tasksToDoEl = document.querySelector("#tasks-to-do");
let pageContentEl = document.querySelector("#page-content")
let tasksInProgressEl = document.querySelector("#tasks-in-progress");
let tasksCompletedEl = document.querySelector("#tasks-completed");
let taskIdCounter = 0;
let tasks = [];

let taskFormHandler = function() {
    event.preventDefault();
    let taskNameInput = document.querySelector("input[name='task-name']").value;
    let taskTypeInput = document.querySelector("select[name='task-type']").value;

    // check if input values are empty strings
    if (!taskNameInput || !taskTypeInput){
        alert("you need to fill out the task form!");
        return false;
    }

    formEl.reset();

    let isEdit = formEl.hasAttribute("data-task-id");
    
    // has data attribute, so get task id and call function to complete edit process
    if (isEdit) {
        let taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // no data attribute, so create object as normal and pass to createTaskEl function
    else {
        let taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };
        
        createTaskEl(taskDataObj);
    }

};

let createTaskEl = function(taskDataObj) {
        // create list item
        let listItemEl = document.createElement("li");
        listItemEl.className = "task-item";

        // add task id as custom attribute
        listItemEl.setAttribute("data-task-id", taskIdCounter);
    
        // create div to hold task info and add to list item
        let taskInfoEl = document.createElement("div");
        taskInfoEl.className = "task-info";
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
        listItemEl.appendChild(taskInfoEl);

        let taskActionsEl = createTaskActions(taskIdCounter);
        listItemEl.appendChild(taskActionsEl);

        switch (taskDataObj.status) {
            case "to do":
                taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 0;
                tasksToDoEl.append(listItemEl);
                break;
            case "in progress":
                taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
                tasksInProgressEl.append(listItemEl);
                break;
            case "completed":
                taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 2;
                tasksCompletedEl.append(listItemEl);
                break;
        }

        taskDataObj.id = taskIdCounter;
        
        tasks.push(taskDataObj);

        saveTasks();
        // incrase task counter for next unique id
        taskIdCounter++;
};

let createTaskActions = function(taskId) {
    let actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    let editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    let deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    let statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    let statusChoices = ["To Do", "In Progress", "Completed"];

    for (let i = 0; i < statusChoices.length; i++) {
        let statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};

formEl.addEventListener("submit", taskFormHandler);

let taskButtonHandler = function(event) {
    let targetEl = event.target;

    if(event.target.matches(".edit-btn")){
        let taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    } else if (event.target.matches(".delete-btn")) {
        let taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

let editTask = function(taskId){
    // get task list item element
    let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // get content from task name and type
    let taskName = taskSelected.querySelector("h3.task-name").textContent;
    let taskType = taskSelected.querySelector("span.task-type").textContent;
    
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";
    formEl.setAttribute("data-task-id", taskId);
};

let completeEditTask = function(taskName, taskType, taskId) {
    // find the matching task list item
    let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop through tasks array and task object with new content
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    }

    alert("Task Updated!");

    formEl.removeAttribute("data-task-id");
    formEl.querySelector("#save-task").textContent = "Add Task";
    saveTasks();
};

let deleteTask = function(taskId) {
    let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    // create new array to hold updated list of tasks
    var updatedTaskArr = [];

    // loop through current tasks
    for (let i = 0; i < tasks.length; i++) {
        // if tasks[i].id doesnt match the value of taskId, let's keep that task
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }
    // reasssign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;
    saveTasks();
};

let taskStatusChangeHandler = function(event) {
    // get the task item's id
    let taskId = event.target.getAttribute("data-task-id");

    // get the currently selected option's value and convert to lowercase
    let statusValue = event.target.value.toLowerCase();

    // find the parent task item element based on the id
    let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }

    // update tasks' in tasks array
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }
    saveTasks();
};

let saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

let loadTasks = function() {
    let savedTasks = localStorage.getItem("tasks");

    if (!savedTasks) {
        return false;
    }

    savedTasks = JSON.parse(savedTasks);
    
    for (let i = 0; i < savedTasks.length; i++) {
        createTaskEl(savedTasks[i]);
    }
};

formEl.addEventListener("submit", taskFormHandler);

pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);

loadTasks();