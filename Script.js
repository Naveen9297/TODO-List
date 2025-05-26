// document.addEventListener("DOMContentLoaded", function () {
const mainDiv = document.getElementById("dispaly_data");
const subdiv = document.getElementById("accordionExample");
const input_text = document.getElementById("input_text");
const description = document.getElementById("description");
const dateandtime = document.getElementById("dateandtime");

// Format date/time min value - (Current date and time)
const now = new Date();
const pad = (num) => String(num).padStart(2, "0");
const datetime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
  now.getDate()
)}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
dateandtime.min = datetime;

// The value for creating newId for each accordians parts
let taskCount = 0;

// Coockie
function setSessionCookie(name, value) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/`;
}

function getCookie(name) {
  const cookies = document.cookie.split(";");
  for (let c of cookies) {
    const [key, val] = c.trim().split("=");
    if (key === name) return decodeURIComponent(val);
  }
  return null;
}

function saveTasksToCookie(tasks) {
  setSessionCookie("todo_tasks", JSON.stringify(tasks));
}

function loadTasksFromCookie() {
  const data = getCookie("todo_tasks"); 
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
  return [];
}

// function for the adding tasks to the List
function ToDoList() {
  // If the values are empty sweet alert
  if (
    input_text.value.trim() == "" ||
    description.value.trim() == "" ||
    dateandtime.value.trim() == ""
  ) {
    // Sweet alert for the No information
    $(document).ready(function () {
      Swal.fire({
        title: "OOPS!",
        text: "Please enter all the details...!",
        icon: "warning",
        confirmButtonText: "Try Again",
      });
    });
  } else {
    const task = {
      title: input_text.value,
      description: description.value,
      dateTime: dateandtime.value,
    };

    // Clearing the values from the inpouts
    input_text.value = "";
    description.value = "";
    dateandtime.value = "";

    const currentTasks = loadTasksFromCookie();
    currentTasks.push(task);
    saveTasksToCookie(currentTasks);
    addTodoTask(task.title, task.description, task.dateTime);
  }
}

// function for Processing and creating elements
function addTodoTask(title, description, dateTimeStr) {
  taskCount++;
  const itemId = `task-${taskCount}`;
  const headerId = `heading-${taskCount}`;
  const collapseId = `collapse-${taskCount}`;

  // Accordion Item
  const item = document.createElement("div");
  item.className = "accordion-item";

  // Accordion head
  const header = document.createElement("h2");
  header.className = "accordion-header";
  header.id = headerId;

  // Accordion Button
  const button = document.createElement("button");
  button.className = "accordion-button collapsed fw-bold fs-2";
  button.type = "button";
  button.setAttribute("data-bs-toggle", "collapse");
  button.setAttribute("data-bs-target", `#${collapseId}`);
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", collapseId);
  button.textContent = title;

  //  Appending button to head
  header.appendChild(button);

  // For dispalying the date and time
  const datePara = document.createElement("p");
  datePara.className = "text-light mt-2 fw-bold fs-6 p-2";

  // separate the date and time
  const dateTime = new Date(dateTimeStr);
  const day = String(dateTime.getDate()).padStart(2, "0");
  const month = String(dateTime.getMonth() + 1).padStart(2, "0");
  const year = dateTime.getFullYear();
  const hours = String(dateTime.getHours()).padStart(2, "0");
  const minutes = String(dateTime.getMinutes()).padStart(2, "0");

  datePara.textContent = `Due: ${day}-${month}-${year} T ${hours} : ${minutes}`;

  // Complete Button
  const completeBtn = document.createElement("button");
  completeBtn.className = "btn btn-sm btn-outline-success ms-2";
  completeBtn.textContent = "✔️ Done";
  completeBtn.onclick = () => {
    button.classList.toggle("text-decoration-line-through");

    if (button.classList.contains("text-decoration-line-through")) {
      // sweet alert for task Striked
      $(document).ready(function () {
        Swal.fire({
          title: "Successfully Task Completed!",
          // text: "Task is Completed",
          icon: "success",
          confirmButtonText: "OK",
        });
      });
    } else {
      // sweet alert for task again visiable
      $(document).ready(function () {
        Swal.fire({
          title: "Task Added to list",
          // text: "Task has to complete",
          icon: "info",
          confirmButtonText: "OK",
        });
      });
    }
  };

  // Delete Button
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-sm btn-outline-danger ms-2";
  deleteBtn.textContent = "🗑️ Delete";
  deleteBtn.onclick = () => {
    item.remove();
    datePara.remove();
    completeBtn.remove();
    deleteBtn.remove();

    // Remove from cookie
    let currentTasks = loadTasksFromCookie();
    currentTasks = currentTasks.filter(
      (t) => !(t.title === title && t.dateTime === dateTimeStr)
    );
    saveTasksToCookie(currentTasks);

    // Sweet alert for the delete option
    $(document).ready(function () {
      Swal.fire({
        title: "Deleted",
        text: "Successfully Task is Removed",
        icon: "warning",
        confirmButtonText: "Done",
      });
    });
  };

  // accordion - body collapse
  const collapse = document.createElement("div");
  collapse.className = "accordion-collapse collapse";
  collapse.id = collapseId;
  collapse.setAttribute("aria-labelledby", headerId);
  collapse.setAttribute("data-bs-parent", "#todoAccordion");

  // accordion - body
  const accordian_body = document.createElement("div");
  accordian_body.className = "accordion-body fs-4";
  accordian_body.textContent = description;

  // Appending the childs
  collapse.appendChild(accordian_body);
  item.appendChild(header);
  item.appendChild(collapse);

  subdiv.appendChild(item);
  subdiv.appendChild(datePara);
  subdiv.appendChild(completeBtn);
  subdiv.appendChild(deleteBtn);
  mainDiv.appendChild(subdiv);

  // Sweet alert for succfully adding the Task
  $(document).ready(function () {
    Swal.fire({
      title: "Success!",
      text: "Successfully Task is added",
      icon: "success",
      confirmButtonText: "Done",
    });
  });
}

// Load any existing tasks on page load
window.onload = () => {
  const existingTasks = loadTasksFromCookie();
  existingTasks.forEach((task) => {
    addTodoTask(task.title, task.description, task.dateTime);
  });

  //  Example 
  // addTodoTask("Read", "Complete the book", "2025-03-05T22:40");
};
