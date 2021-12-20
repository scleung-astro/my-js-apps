const Task = class{
    constructor(toDoTask, dueDate, urgent){
        this.toDoTask = toDoTask;
        this.dueDate = dueDate;

        if (urgent){
            this.urgent = true;
        } else {
            this.urgent = false;
        }
        
        this.finished = false;
    };
}; 

const taskList = document.getElementById("taskList");

const inputToDoTask = document.getElementById("inputTask");
const inputTime = document.getElementById("inputTime");
const inputPriority = document.getElementById("inputPriority");

const tasks = [];

function addTask(){

    newTask = new Task(inputToDoTask.value, inputTime.value, inputPriority.checked);
    tasks.push(newTask);
    updateTaskList();

}

function updateTaskList(){

    row = "";



    for (let i in tasks){
        task = tasks[i];
        row += "<tr><td scope='col'>#</td><td scope='col-4'>" 

        console.log(task);

        if (task.finished == true){row += "<s>";}
        row += task.toDoTask 
        if (task.finished == true){row += "</s>";}

        row += "</td><td scope='col'>" + 
            task.dueDate + "</td><td scope='col'>" + 
            task.urgent + "</td><td scope='col'>" + 
            "<button class='btn btn-primary' onclick='finishTask(" + i + ")'> Check </button>" + "</td></tr>\n";
    };
    taskList.innerHTML = row;
}

function finishTask(i){

    tasks[i].finished = true;
    updateTaskList()
    //console.log("Change task ", i, " to True");
}