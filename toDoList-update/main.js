// Get the add button and the task box for "Not Started" tasks
const addBtn = document.querySelector("#add");
const taskBox = document.querySelector("#task-box-start");
const boxs = document.querySelectorAll(".task_box");
// Create a counter to keep track of the number of tasks added
let drag = null;
let taskCounter = 0;
const inputValues = [];
const inputValuesJson='';
// Load tasks from local storage if they exist
const savedTasks = localStorage.getItem("tasks");
if (savedTasks) {
  taskBox.innerHTML = savedTasks;
  
}
//load task postion from local storage
const taskPositions = JSON.parse(localStorage.getItem("taskPositions"));
//console.log(taskPositions);
if (taskPositions) {
  taskPositions.forEach((taskPosition) => {
    const task = document.getElementById(taskPosition.id);
    //console.log(task);
    const taskBox = document.getElementById(taskPosition.position);
    //console.log(taskBox)
    taskBox.appendChild(task);
  });
}


///load input value from local storage
getStoredValueFromLocalStorage();



// Add an event listener to the add button
addBtn.addEventListener("click", create);
/////create function to create innerhtml//////

function create(){
   // Get all input elements
   const inputs = document.querySelectorAll(".input");

   // Check if all input elements are empty
   let allInputsEmpty = true;
   inputs.forEach((input) => {
     if (input != null && input.value == "") {
       allInputsEmpty = false;
       alert("Fill the field before adding new one");
     }
   });
 
   // If any input is not empty, do not add another input
   if (!allInputsEmpty) {
     return;
   }
 
   // Increment the task counter
   taskCounter++;
 
   // Create a new task element with input, edit and delete buttons
   const taskEl = document.createElement("div");
   taskEl.classList.add("task");
   taskEl.classList.add("drag");
   taskEl.setAttribute("draggable", "true");
   taskEl.setAttribute("id", `task-${taskCounter}`);
   taskEl.innerHTML = `
     <div class="input-container">
       <input type="text" placeholder="Add a new task" class="input" id="input-${taskCounter}" />
       <a href="#" class="fa fa-edit" id="edit-${taskCounter}" ></a>
       <a href="#" class="fa fa-trash" id="delete-${taskCounter}"></a>
     </div>
   `;
 
   // Append the task element to the task box
   taskBox.appendChild(taskEl);
 
   // Add an event listener to the edit button if it exists
   const editBtn = document.querySelector(`#edit-${taskCounter}`);
   const inputEl = document.querySelector(`#input-${taskCounter}`);
   inputEl.addEventListener('blur', function() {
    // Update the value in Local Storage whenever the value changes
    
const idExists = inputValues.some(item => item.id === inputEl.id);

if (!idExists) {
    inputValues.push({
      id: `input-${taskCounter}`,
      val: inputEl.value,
    });
    // inputValues[taskCounter - 1] = inputEl.value;
    const inputValuesJson = JSON.stringify(inputValues);
    // Store the JSON string in Local Storage
     localStorage.setItem('my-input-values', inputValuesJson);
  }
   
   });  
   if (editBtn) {
     editBtn.addEventListener("click", function (event) {
       event.stopPropagation();
       if (inputEl.disabled) {
         inputEl.disabled = false;
         inputEl.classList.add("enableInput");
         inputEl.classList.remove("disableInput");
         inputEl.select();
         inputEl.addEventListener('blur',function(){
          if(localStorage.getItem('my-input-values')){
          const inputValuesJson = JSON.parse(localStorage.getItem('my-input-values'));
          console.log(inputValuesJson);
          const indexToUpdate = inputValuesJson.findIndex(item => item.id === inputEl.id);
           console.log(indexToUpdate);
            if (indexToUpdate !== -1) {
              
              inputValuesJson[indexToUpdate].val=inputEl.value;
                 console.log(inputValuesJson[indexToUpdate]);
                 const inputValuesJsonString = JSON.stringify(inputValuesJson);
            // store the updated array in local storage
            localStorage.setItem('my-input-values', inputValuesJsonString);
            
              }
        } });
        }else {
         inputEl.disabled = true;
         inputEl.classList.add("disableInput");
         inputEl.classList.remove("enableInput");
       }
     });
   }
 
   // Add an event listener to the delete button if it exists
   const deleteBtn = document.querySelector(`#delete-${taskCounter}`);
   if (deleteBtn) {
     deleteBtn.addEventListener("click", function (event) {
       event.stopPropagation();
       taskEl.remove();
       // Save tasks to local storage after deleting a task
       localStorage.setItem("tasks", taskBox.innerHTML);
     });
   }
 
   ////add an event listener for taskEl for drag and drop
   const task = document.querySelector(`#task-${taskCounter}`);
   if (task) {
     task.addEventListener("click", function () {
      dragTask(taskCounter);
    });
   }
 }

///////////////// click at document or enter key disable input fields
function disableInput(Event) {
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    if (input !== null && input.value != "") {
      // Input element exists
      if (Event.target !== input) {
        input.disabled = true;
        input.classList.remove("enableInput");
        input.classList.add("disableInput");
      } else {
        // Input element does not exist
        input.disabled = false;
      }
    }
    localStorage.setItem("tasks", taskBox.innerHTML);
  });

  //////////////click enter button disable input field//////////
  inputs.forEach((input) => {
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        input.disabled = true;
        input.classList.remove("enableInput");
        input.classList.add("disableInput");
      }
      localStorage.setItem("tasks", taskBox.innerHTML);
    });
  });
  
}

document.addEventListener("click", disableInput);

/////////////drag and drop function
function dragTask(taskCounter) {
  //const containersTask = document.querySelectorAll(".input-container");
  const task = document.querySelector(`#task-${taskCounter}`);

  task.addEventListener("dragstart", (e) => {
    drag = task;
  });
  task.addEventListener("dragend", (e) => {
    e.preventDefault();
    drag = null;
  });

  boxs.forEach((box) => {
    box.addEventListener("dragover", (e) => {
      e.preventDefault();
      box.style.backgroundColor = "#032e26";
    });

    box.addEventListener("dragleave", () => {
      console.log(box);
      box.style.backgroundColor = "transparent";
    });
    box.addEventListener("drop", () => {
      box.append(drag);
      box.style.backgroundColor = "transparent";
      updateLocalStorage();
    });
  });
}

// Update the local storage with the current task positions
function updateLocalStorage() {
  const tasks = document.querySelectorAll(".task");
  const taskPositions = [];
  tasks.forEach((task) => {
    console.log(task);
    const taskId = task.getAttribute("id");
    const taskPosition = task.parentElement.getAttribute("id");
    taskPositions.push({
      id: taskId,
      position: taskPosition,
    });
  });
  localStorage.setItem("taskPositions", JSON.stringify(taskPositions));
}

// store input value at local storage

function getStoredValueFromLocalStorage(){
  const allInputs=document.querySelectorAll(".input");
  const inputValuesJson = JSON.parse(localStorage.getItem('my-input-values'));
  //console.log(inputValuesJson);
  if(inputValuesJson){
     inputValuesJson.forEach((inputVal)=>{
     // console.log(inputVal.val);
      const taskInputId=document.getElementById(inputVal.id).id;
      //console.log(taskInputId);
      let taskInputValue=inputVal.val;
      //console.log(taskInputValue);
      //console.log(taskInputValue);
      allInputs.forEach((input)=>{
        const inputId=input.getAttribute("id");
        //console.log(inputId)
        //let inputCon=input.setAttribute("value",taskInputValue);
        if(taskInputId===inputId){
          input.setAttribute("value",taskInputValue);
        }
           
      });
     });}
}