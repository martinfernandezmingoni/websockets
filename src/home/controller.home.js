const fs = require('fs')
const {Router} = require('express')

const router = Router()

router.get('/', async (req,res) =>{
  const data = await fs.promises.readFile('./src/files/products.json', 'utf8')
  const products = JSON.parse(data)

  res.render('home', {products})
})

module.exports = router