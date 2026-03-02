const todoList = [{
  name: 'review course',
  dueDate: '2025-09-29'
}];

renderTodoList();

function renderTodoList() {
  let todoListHTML = '';

  for (let i = 0; i < todoList.length; i++) {
    const todoObject = todoList[i];
    const name = todoObject.name; 
    const dueDate = todoObject.dueDate;
    const html =  `<div>${name}</div>
                  <div><strong>${dueDate}</strong></div> 
                  <button class="js-delete-button">Delete</button>`;
    todoListHTML += html;
  }

  // Loop over every toDo object and append it to "todoListHTML"
  // Show the objects inside the class "js-todo-list"
  // Loop over evey delete button and add an eventListener that deletes the toDo and rerender the Tasks

  document.querySelector('.js-todo-list').innerHTML = todoListHTML;

  document.querySelectorAll('.js-delete-button')
  .forEach((deleteButton, index) => {
    deleteButton.addEventListener('click', () => {
      todoList.splice(index, 1);
      renderTodoList();
    });
  });
  
}

document.querySelector('.js-add-todo-button')
  .addEventListener('click', () => {
    addTodo();
  });

function addTodo() {
  const inputElement = document.querySelector('.js-name-input');
  const name = inputElement.value;

  const dateInputElement = document.querySelector('.js-due-date-input');
  const dueDate = dateInputElement.value;

  // Add these values to the variable "todoList"
  todoList.push({name: name,dueDate: dueDate})
  

  inputElement.value = '';

  renderTodoList();
}

