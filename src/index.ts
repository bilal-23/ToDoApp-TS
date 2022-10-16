interface Task {
  readonly id: string;
  title: string;
  completed: boolean;
  createdAt: Date
}


import { v4 as uuidv4 } from 'uuid';

const list = document.querySelector<HTMLUListElement>('#list')
const form = document.querySelector('#new-task-form') as HTMLFormElement;
const input = document.querySelector('#new-task-title') as HTMLInputElement


let tasksList: Task[] = JSON.parse(localStorage.getItem("tasksList")!)
if (tasksList === null) {
  tasksList = []
}

function saveTasks(task: Task): void {
  tasksList.push(task);
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
  label.append(checkbox, task.title);
  item.appendChild(label);
  item?.setAttribute("id", task.id);
  list?.appendChild(item);
}

function checkBoxHandler(event: Event): void {
  const elem = event.target as HTMLElement;
  let liElement: HTMLLIElement
  liElement = elem.closest("li") as HTMLLIElement;
  const id = liElement.getAttribute("id");
  if (id) {
    completeTask(id);
  }
}

function completeTask(id: string): void {
  const tempList = [...tasksList];
  const index = tempList.findIndex((item) => item.id === id);
  tempList[index].completed = true;
  localStorage.setItem("tasksList", JSON.stringify(tempList));
}

list?.addEventListener("click", checkBoxHandler);

form?.addEventListener("submit", formSubmitHandler);

//hydrate list when page loaded first
(function () {
  tasksList.forEach(addListItem)
})()