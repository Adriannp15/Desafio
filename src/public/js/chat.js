let validate = false;

//Front Real Time Product
const socket = io();

const chatBox = document.querySelector('#chatBox');
const chatUser = document.querySelector('#chatUser');
const checkUser = document.querySelector('#checkUser');
const messageLogs = document.querySelector('#messageLogs');
const clearMessages = document.querySelector('#clearMessages')

chatBox.addEventListener('keyup', (e) => {
  if (!validate) {validateUser()}
  if (e.key === 'Enter') {
    if(chatBox.value.trim().length > 0){
        socket.emit('message', {user: chatUser.value ,message: chatBox.value})
        chatBox.value = ''
    }
}
})

// FIXME corregir el evento de cargado inicial
chatBox.addEventListener('load', () => {
  socket.emit('init', "dato")
})

socket.on('messageLogs', data => {
  let messageLog = '';
  data.forEach(elm => {
    messageLog += `
      <div class="log">
        <p class="user">${elm.user}</p>
        <p class="text">${elm.message}</p>
        <p class="date">${new Date(elm.atCreated).toLocaleString()}</p>
      </div>
    `
  });
  messageLogs.innerHTML = messageLog;
})

chatUser.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    if(validator.isEmail(chatUser.value)){
      changeValidate(true)
    } else {
      changeValidate(false)
    }
  } else {
    changeValidate(false)
  }
})

function validateUser () {
  Swal.fire({
    title: 'Indentifícate con tu email',
    input: 'email',
    text: 'Ingrese un e-mail para identificarse',
    allowOutsideClick: false,
    inputValidator: value => {
        if (!validator.isEmail(value)) {
          return 'Necesitas escribir un e-mail para continuar!!'
        } 
    }
  }).then(result => {
    changeValidate(true)
    chatUser.value = result.value
  })
}

function changeValidate (check) {
  if (check) {
    validate = true;
    checkUser.classList.remove('visibleOff')
  } else {
    validate = false;
    checkUser.classList.add('visibleOff')
  }
}

// FIXME: coregir evento que deberia borrar mongo mensajes
clearMessages.addEventListener('click', () => {
  messageLogs.innerHTML = '';
  socket.emit('clean', "dato")
})