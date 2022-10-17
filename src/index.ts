interface Task {
  readonly id: string;
  title: string;
  completed: boolean;
  createdAt: Date
}


import { v4 as uuidv4 } from 'uuid';

const list = document.querySelector<HTMLUListElement>('#list')
const form = document.querySelector('#new-task-form') as HTMLFormElement;
const input = document.querySelector('#new-task-title') as HTMLInputElement;
const referenceLi = document.querySelector("#reference-li") as HTMLLIElement;


let tasksList: Task[] = JSON.parse(localStorage.getItem("tasksList")!)
if (tasksList === null) {
  tasksList = []
}

function saveTasks(task: Task): void {
  tasksList.unshift(task);
  localStorage.setItem("tasksList", JSON.stringify(tasksList));
}

function formSubmitHandler(event: Event): void {
  event.preventDefault();

  if (input?.value === "" || input?.value === null) return;

  const task: Task = {
    id: uuidv4(),
    title: input.value,
    completed: false,
    createdAt: new Date()
  }

  addListItem(task);
  saveTasks(task);
  input.value = ""
}

function addListItem(task: Task): void {
  const item = document.createElement("li");
  const label = document.createElement("label");
  const checkbox = document.createElement("input")
  checkbox.type = "checkbox";
  //append works for node objects and DOMStirngs unlike appendChild which only works for node objects
  checkbox.checked = task.completed;
  checkbox.name = `${task.id}`
  checkbox.id = `${task.id}`
  label.htmlFor = `${task.id}`;
  label.textContent = task.title;
  item.appendChild(checkbox);
  item.appendChild(label)
  //  render li elemets inside ul in reverse order

  referenceLi?.insertAdjacentElement("afterend", item);

  checkbox.addEventListener("change", checkBoxHandler);
}

function checkBoxHandler(e: Event): void {
  const elem = e.target as HTMLInputElement;
  const id = elem.id;
  if (id) {
    completeTask(id);
  }
}

function completeTask(id: string): void {
  console.log("working");
  const tempList = [...tasksList];
  const index = tempList.findIndex((item) => item.id === id);
  tempList[index].completed = !tempList[index].completed;
  localStorage.setItem("tasksList", JSON.stringify(tempList));
}


form?.addEventListener("submit", formSubmitHandler);

//hydrate list when page loaded first
(function () {
  tasksList.forEach(addListItem)
})()