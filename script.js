const taskContainer = document.querySelector(".task-list"); /* [data-lists] */
const newTodoBtn = document.querySelector("[data-new-list-btn]");
const todoInput = document.querySelector("[data-new-list-input]");



const LOCAL_STORAGE_LIST_KEY = 'task'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];


document.addEventListener("keyup", e => {
    if(e.code === "Slash") {
        todoInput.focus();
    }
})

taskContainer.addEventListener("click", (e) => {

    const item = e.target;
    if (item.className === "delete-btn") {
        const todo = item.parentElement;
        lists = lists.filter(task => task.id !== todo.id)
        localStorage.removeItem(lists);
    }
    saveAndRender();
})


newTodoBtn.addEventListener("click", e => {
    e.preventDefault();
    const listName = todoInput.value
    if (listName == null || listName === '') return
    const list = createList(listName)
    todoInput.value = null
    lists.push(list)
    saveAndRender()

})


function createList(name) {
    return {id: Date.now().toString(), name: name, complete: false }
}


function saveAndRender() {
    save();
    renderLists();
}

function save() {
    localStorage.setItem( LOCAL_STORAGE_LIST_KEY ,JSON.stringify(lists))
}

function renderLists() {
    clearElement(taskContainer);

    lists.forEach(task => {

        const taskElement = document.createElement("li");
        taskElement.id = task.id;
        taskElement.classList.add("list-name");

        const taskInput = document.createElement("input")
        taskInput.id = task.id;
        taskInput.type = "checkbox";
        taskInput.checked = task.complete;
        taskInput.classList.add("list-checkbox");
        taskElement.appendChild(taskInput);
        taskInput.onclick = function (e) {
            const selectedList = lists.find(task => task.id === e.target.id)
            selectedList.complete = e.target.checked
            saveAndRender()
        }

        const taskSpan = document.createElement("span")
        taskSpan.id = task.id;
        taskSpan.classList.add("task");
        taskSpan.innerText = task.name;
        taskElement.appendChild(taskSpan);

        const taskButton = document.createElement("button")
        taskButton.id = task.id;
        taskButton.type = "button";
        taskButton.classList.add("delete-btn");
        taskButton.innerHTML = "&times;";
        taskElement.appendChild(taskButton);

        taskContainer.appendChild(taskElement);

    })

    if(taskContainer.children.length === 0) {
        const emptyListMsg = document.createElement("div");
        emptyListMsg.style.cssText = "text-align: center; color: #333; font-size: 2rem;"
        emptyListMsg.innerText = "Your list is Empty";
        emptyListMsg.id = "emptyMessage";
        taskContainer.appendChild(emptyListMsg);
    }

}



function clearElement(element) {
    while(element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

renderLists();