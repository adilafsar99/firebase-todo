// To control main loader

firebase.database().ref("todos").once("value", (res) => {
  let loader = document.getElementById("main-loader");
  loader.style.display = "none";
});

//Todo app functions

const inputBox = document.getElementById("task-input-box");
const delAllBtn = document.getElementById("delete-all-btn");
delAllBtn.disabled = true;
delAllBtn.classList.add("disabled");

//Function to add task(s) to the list.

function addTask() {
  let isEmpty = true;
  let isNumber = true;

  if (inputBox.value.length !== 0) {
    for (var i = 0; i <= inputBox.value.length; i++) {
      if (inputBox.value[i] !== " ") {
        isEmpty = false;
        break;
      }
    }
    if (inputBox.value != Number(inputBox.value)) {
      isNumber = false;
    }
  }
  if (isEmpty) {
    inputBox.setAttribute("placeholder", "You entered nothing!");
  } else if (isNumber) {
    inputBox.setAttribute("placeholder", "Invalid task!");
    inputBox.value = "";
  } else {
    inputBox.setAttribute("placeholder", "");
    let loader = document.getElementById("add-loader");
    let addText = document.getElementById("add-loader-text");
    addText.style.display = "none";
    loader.style.display = "block";
    firebase.database().ref("todos").push({
      task: inputBox.value
    });
    loader.style.display = "none";
    addText.style.display = "block";
    inputBox.value = "";
    delAllBtn.disabled = false;
    delAllBtn.classList.remove("disabled");
  }
}

//Function to edit the task name

function editTask(key) {
  const task = document.getElementById(key);
  const taskText = task.innerText;
  let subDiv1 = task.parentNode;
  let editBtn = document.getElementById(key+"edit");
  task.remove();
  subDiv1.innerHTML = `<input id="${key}" class="task-update-box" type="text" value="${taskText}" maxlength="40">`;
  let inputBox = document.getElementById(key);
  inputBox.focus();
  inputBox.select();
  editBtn.innerHTML = `<div id="update-loader-text">
  Update
  </div>
  <div class="loader" style="display:none" id="update-loader"></div>`;
  editBtn.setAttribute("onclick", `updateTask('${key}')`);
}

//Function to update task

function updateTask(key) {
  const inputBox = document.getElementById(key);
  let subDiv1 = inputBox.parentNode;
  let updateBtn = document.getElementById(key+"edit");
  let isEmpty = true;
  let isNumber = true;
  if (inputBox.value.length !== 0) {
    for (var i = 0; i <= inputBox.value.length; i++) {
      if (inputBox.value[i] !== " ") {
        isEmpty = false;
      }
      if (inputBox.value != Number(inputBox.value)) {
        isNumber = false;
      }
    }
  }
  if (isEmpty) {
    inputBox.setAttribute("placeholder", "You entered nothing!");
  } else if (isNumber) {
    inputBox.setAttribute("placeholder", "Invalid task!");
    inputBox.value = "";
  } else {
    let loader = document.getElementById("update-loader");
    let updateText = document.getElementById("update-loader-text");
    updateText.style.display = "none";
    loader.style.display = "block";
    firebase.database().ref(`todos/${key}`).set({
      task: inputBox.value
    });
    loader.style.display = "none";
    updateText.style.display = "block";
    subDiv1.innerHTML = `<p id="${key}">${inputBox.value}</p>`;
    updateBtn.innerHTML = `<div id="edit-loader-text">
    Edit
    </div>
    <div class="loader" style="display:none" id="edit-loader"></div>`;
    updateBtn.setAttribute("onclick", `editTask('${key}')`);
  }
}

//Function to remove task(s) from the list

function removeTask(key) {
  let loader = document.getElementById("del-loader");
  loader.style.display = "block";
  let deleteText = document.getElementById("del-loader-text");
  deleteText.style.display = "none";
  loader.style.display = "block";
  firebase.database().ref(`todos/${key}`).remove();
  let taskList = document.getElementById("task-list");
  firebase.database().ref("todos").once("value", (todos) => {
    loader.style.display = "none";
    deleteText.style.display = "block";
    const mainDiv = document.getElementById(key).parentNode.parentNode;
    mainDiv.remove();
    if (!todos.val()) {
      delAllBtn.disabled = true;
      delAllBtn.classList.add("disabled");
    }
  });
}

//Function to delete all tasks

function delAllTasks() {
  let loader = document.getElementById("del-all-loader");
  loader.style.display = "block";
  firebase.database().ref("todos").remove();
  loader.style.display = "none";
  document.getElementById("task-list").innerHTML = "";
  delAllBtn.disabled = true;
  delAllBtn.classList.add("disabled");
}

// To add tasks in realtime

firebase.database().ref("todos").on("child_added", (todo) => {
  let taskList = document.getElementById("task-list");
  let key = todo.key;
  taskList.innerHTML += `<li>
  <div class="main-div">
  <div class="sub-div1">
  <p id="${key}">${todo.val().task}</p>
  </div>
  <div class="sub-div2">
  <button onclick="editTask('${key}')" id="${key}edit" class="edit-btn"><div id="edit-loader-text">
  Edit
  </div>
  <div class="loader" style="display:none" id="edit-loader"></div></button>
  <button onclick="removeTask('${key}')" id="${key}del" class="delete-btn"><div id="del-loader-text">
  Delete
  </div>
  <div class="loader" style="display:none" id="del-loader"></div></button>
  </div>
  </div>
  </li>`;
  delAllBtn.disabled = false;
  delAllBtn.classList.remove("disabled");
});