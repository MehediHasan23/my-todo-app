(function () {

  function $(id) {
    return document.getElementById(id)
  }

  let form = $('form');
  let date = $('date');
  let tbody = $('tbody');
  let today = new Date().toISOString().slice(0, 10)
  date.value = today;

  /* ================ 
  form data
  =======================*/
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let inputElements = [...this.elements]
    let task = {};
    let isValid = true;
    inputElements.forEach((el, i) => {
      if (el.type !== 'submit') {
        if (el.value === '') {
          alert('please give a valid data')
          isValid = false;
          return
        }
        task[el.name] = el.value;

      }
    })
    if (isValid) {

      task['id'] = uuidv4()
      task['status'] = 'incomplete';
      let tasks = getDataFromLocalStorage()
      tasks.push(task)
      setDataLocalStorage(tasks)
      displayToUi(task, tasks.length);
    }
    this.reset();
  })


  /* ===============
  onload event
  ============== */


  window.onload = reload

  function reload() {
    tbody.innerHTML = '';
    let tasks = getDataFromLocalStorage()

    tasks.forEach((task, i) => {
      displayToUi(task, i + 1)
    })
  }

  /* =====================
  * display data on ui
  ======================== */

  function displayToUi({ name, priority, date, status, id }, index) {
    let tr = document.createElement('tr')
    tr.innerHTML = `
      <td id="index">${index}</td>
        <td id="name">${name}</td>
        <td id="priority">${priority}</td>
        <td id="status">${status}</td>
        <td id="date">${date}</td>
        <td id="action">
          <button id="edit">
            <i class="fas fa-pen"></i>
          </button>
          <button id="check">
            <i class="fas fa-check"></i>
          </button>
          <button id="delete">
            <i class="fas fa-trash"></i>
          </button>
      </td>
    
    `
    tr.dataset.id = id
    tbody.appendChild(tr);
  }


  /*==================
   button event 
  ===================*/

  tbody.addEventListener('click', function (e) {
    if (e.target.id === 'delete') {
      deleteData(e);
    }
    else if (e.target.id === 'check') {
      complete(e);
    }
    else if (e.target.id === 'edit') {
      edit(e)
    }
  })


  /*==================
   delete function
  ================= */
  function deleteData(e) {
    let data = e.target.parentElement.parentElement
    data.remove()

    let id = data.dataset.id
    let tasks = getDataFromLocalStorage()

    let deleteTask = tasks.filter(task => {
      return (task.id !== id)
    })

    setDataLocalStorage(deleteTask)
    reload()

  }


  /* =============
  complete event
  ================*/

  function complete(e) {
    let tdList = e.target.parentElement.parentElement.children
    let item = e.target.parentElement.parentElement
    let id = item.dataset.id

    let td = [...tdList]
    let tasks = getDataFromLocalStorage()
    td.forEach(td => {
      if (td.id === 'status') {
        tasks.filter(task => {
          if (task.id === id) {
            if (task.status === 'incomplete') {
              task.status = 'complete'
              td.innerHTML = 'complete'
            } else {
              task.status = 'incomplete'
              td.innerHTML = 'incomplete'
            }
          }
        })
      }
    })

    setDataLocalStorage(tasks)
  }


  /* ==============
  edit event
  ================= */
  function edit(e) {
    let data = e.target.parentElement.parentElement
    let id = data.dataset.id
    let allTd = data.children;

    //name
    let nameTd;
    let nameInput;

    //priority

    let priorityTd;
    let priorityInput;

    //date
    let dateTd;
    let dateInput;

    //action

    let actionTd;
    let preAction;


    [...allTd].forEach(td => {
      if (td.id === 'name') {
        nameTd = td;
        let preName = td.textContent;
        td.innerHTML = ''
        nameInput = document.createElement('input')
        nameInput.type = 'text'
        nameInput.value = preName;
        td.appendChild(nameInput)

      }
      else if (td.id === 'priority') {
        priorityTd = td;
        let preText = td.textContent;
        td.innerHTML = ''
        priorityInput = document.createElement('select')
        priorityInput.innerHTML = `
        <option disabled>Select One</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>  
        `
        if (preText === 'high') {
          priorityInput.selectedIndex = 1
        }
        else if (preText === 'medium') {
          priorityInput.selectedIndex = 2
        } else if (preText === 'low') {
          priorityInput.selectedIndex = 3
        }

        td.appendChild(priorityInput)

      }
      else if (td.id === 'date') {
        dateTd = td;
        let preDate = td.textContent;
        td.innerHTML = '';
        dateInput = document.createElement('input')
        dateInput.type = 'date';
        dateInput.value = preDate
        td.appendChild(dateInput)


      }
      else if (td.id === 'action') {
        actionTd = td;
        preAction = td.innerHTML;
        td.innerHTML = ''
        let btn = document.createElement('button')
        btn.innerHTML = "<i class ='fas fa-sd-card'></i>"

        btn.addEventListener('click', function (e) {
          let newName = nameInput.value;
          nameTd.innerHTML = newName;

          let newPriority = priorityInput.value;
          priorityTd.innerHTML = newPriority;

          let newDate = dateInput.value;
          dateTd.innerHTML = newDate;

          actionTd.innerHTML = preAction

          let tasks = getDataFromLocalStorage()
          tasks.forEach(task => {
            if (task.id === id) {
              task.name = newName;
              task.priority = newPriority;
              task.date = newDate;
            } else {
              return task;
            }
          })
          setDataLocalStorage(tasks);


        })

        td.appendChild(btn)

      }

    })



  }



















  /* ===========================
  * get data from local storage
  ==============================*/

  function getDataFromLocalStorage() {
    let tasks = []
    let data = localStorage.getItem('tasks')
    if (data) {
      tasks = JSON.parse(data)
    }

    return tasks
  }

  /* ==========================
  set data on local storage
  =============================== */

  function setDataLocalStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }

})()