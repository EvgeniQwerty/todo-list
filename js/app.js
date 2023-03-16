// Globals
const ul = document.querySelector("#todo-list");
const slct = document.querySelector("#user-todo");
const button = document.querySelector(".add");
const form = document.querySelector("form");
let users = [];
let todos = [];

// Attach logic
document.addEventListener("DOMContentLoaded", init);
form.addEventListener("submit", handleSubmit);

// Event logic
function init() {
  Promise.all([getData("users"), getData("todos")]).then((values) => {
    [users, todos] = values;

    users.forEach((user) => addUserToSelect(user));
    todos.forEach((todo) => {
      printTodo(todo);
    });
  });
}

function handleSubmit(event) {
  event.preventDefault();

  if (!form.todo.value) {
    alert("Fill the todo input!");
    return;
  }

  if (!Number(form.user.value)) {
    alert("Select the user!");
    return;
  }

  const todo = {
    userId: Number(form.user.value),
    title: form.todo.value,
    completed: false,
  };

  postNewTodo(todo);
}

function handleChange(event) {
  const li = event.target.parentElement.parentElement;
  const id = Number(li.getAttribute("data-id"));
  const completed = event.target.checked;

  changeTodo(id, completed);
}

function handleDelete(event) {
  const li = event.target.parentElement.parentElement;
  const id = Number(li.getAttribute("data-id"));

  deleteTodo(id);
}

// Basic logic
function printTodo({ userId, id, title, completed }) {
  const li = document.createElement("li");
  const div = document.createElement("div");
  const checkbox = document.createElement("input");
  const button = document.createElement("button");
  const task = document.createElement("p");
  const user = document.createElement("p");

  li.classList.toggle("todo-item");
  li.dataset.id = id;

  task.innerText = title;
  task.classList.toggle("todo-text");

  const name = getUserNameById(userId);

  user.innerText = name;
  user.classList.toggle("username");

  checkbox.setAttribute("type", "checkbox");
  checkbox.classList.toggle("completed");
  checkbox.addEventListener("change", handleChange);
  if (completed) checkbox.checked = true;

  button.innerHTML = "&times;";
  button.type = "button";
  button.addEventListener("click", handleDelete);

  div.classList.toggle("todo-wrapper");
  div.appendChild(checkbox);
  div.appendChild(user);
  div.appendChild(task);
  div.appendChild(button);

  li.appendChild(div);

  ul.prepend(li);
}

function getUserNameById(id) {
  const user = users.find((user) => user.id === id);

  if (user) return user.name;
  else return undefined;
}

function addUserToSelect(user) {
  const option = document.createElement("option");

  option.value = user.id;
  option.innerText = user.name;

  slct.appendChild(option);
}

function removeTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);

  const li = ul.querySelector(`[data-id="${id}"]`);
  li.querySelector("input").removeEventListener("change", handleChange);
  li.querySelector("button").removeEventListener("click", handleDelete);

  li.remove();
}

function alertError(error) {
  alert(error.message);
}

// Async logic
async function getData(dataName) {
  try {
    const fetchedData = await fetch(
      `https://jsonplaceholder.typicode.com/${dataName}?_limit=15`
    );
    
    if (!fetchedData.ok)
      throw Error("Error was occured while getting the data! Server Error, please try later");
    
    const data = await fetchedData.json();

    return data;

  } catch (error) {
    alertError(error);
  }
}

async function postNewTodo(todo) {
  try {
    const fetchedData = await fetch(
      "https://jsonplaceholder.typicode.com/todos",
      {
        method: "POST",
        body: JSON.stringify(todo),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );

    if (fetchedData.ok) {
      const newTodo = await fetchedData.json();
      printTodo(newTodo);
    }
    else {
      throw Error("Error was occured while posting new todo! Server Error, please try later");
    }
  } catch (error) {
    alertError(error);
  }
}

async function deleteTodo(id) {
  try {
    const fetchedData = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${id}`,
      {
        method: "DELETE",
      }
    );

    if (fetchedData.ok) {
      removeTodo(id);
    }
    else {
      throw Error("Error was occured while deleting todo! Server Error, please try later");
    }
  } catch (error) {
    alertError(error);
  }
}

async function changeTodo(id, completed) {
  try {
    const fetchedData = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          completed: completed,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );

    if (!fetchedData.ok) {
      throw Error("Error was occured while changing the data! Server Error, please try later");  
    }

  } catch (error) {
    alertError(error);
  }
}
