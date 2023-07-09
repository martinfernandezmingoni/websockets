const socket = io()

socket.on('mensajeServidor', message => {
  console.log(message)
})


socket.emit('mesnageCliente', 'Hola desde el cliente')

