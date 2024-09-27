const socket = io('ws://localhost:3000', {
  transports: ['websocket']
})

//Client 1 File.....

const ServerRef = 'Server'
const ClientRef = 'C1'

function sendMessage (e) {
  e.preventDefault()
  const input = document.querySelector('input')
  if (input.value) {
    socket.emit(
      ServerRef,
      {
        Mess: `M from ${ClientRef} - ${input.value}`,
        To: 'C2'
      },
      res => {
        console.log(res)
      }
    )
    input.value = ''
  }
  input.focus()
}

document.querySelector('form').addEventListener('submit', sendMessage)

// Listen for messages
socket.on(ClientRef, data => {
  const li = document.createElement('li')
  li.textContent = data
  document.querySelector('ul').appendChild(li)
})
