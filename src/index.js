const express = require('express')
const handlebars = require('express-handlebars')
const { Server } = require('socket.io')
const router = require('./router')
const http = require('http')

const port = 8080
const app = express()

const httpServer = http.Server(app)
const io = new Server(httpServer);

app.use(express.json())
app.unsubscribe(express.urlencoded({extended : true}))
app.use(express.static(__dirname + '/public'))

app.use((req,res,next) => {
  req.io = io
  next()
})

router(app)

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



io.on('connection', socket => {
  console.log('Cliente conectado:', socket.id);

  
  socket.on('mensajeCliente', message => {
    console.log('Mensaje del cliente:', message);
  });
});