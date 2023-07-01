const express = require('express')
const router = require('./router')

const port = 8080

const app = express()

app.use(express.json())
app.unsubscribe(express.urlencoded({extended : true}))

router(app)

app.listen(port, () =>{
  console.log(`Server is running in port ${port}`)
})