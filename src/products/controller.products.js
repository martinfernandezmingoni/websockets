const {Router} = require('express')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')


const router = Router()

router.get('/', async (req,res) => {
  try {
    
    const data = await fs.promises.readFile('./files/products.json', 'utf8')
    const products = JSON.parse(data)
    res.json(products)
    
  } catch (error) {
    console.log(error)
    res.json({error})
  }

})

router.get('/:pid', async (req,res) =>{
  try {
    const productId = req.params.pid

    const data = await fs.promises.readFile('./files/products.json', 'utf8')
    const products = JSON.parse(data)

    const product = products.find((p) => p.id === productId)

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }
    res.json({message:product})
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error al obtener el producto' })
    
  }
})


router.post('/', async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } = req.body

    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' })
    }

    const data = await fs.promises.readFile('./files/products.json', 'utf8')
    const productos = JSON.parse(data)
    const productId = uuidv4()

    const newProduct = {
      id:productId ,
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails: thumbnails || []
    }

    productos.push(newProduct)

    await fs.promises.writeFile('./files/products.json', JSON.stringify(productos, null, 2), 'utf8')

    res.json(newProduct)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al agregar el producto' })
  }
})

router.patch('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid
    const { title, description, code, price, stock, category, thumbnails } = req.body

    const data = await fs.promises.readFile('./files/products.json', 'utf8')
    const productos = JSON.parse(data)

    const product = productos.find((p) => p.id === productId)

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }
    product.title = title || product.title
    product.description = description || product.description
    product.code = code || product.code
    product.price = price || product.price
    product.stock = stock || product.stock
    product.category = category || product.category
    product.thumbnails = thumbnails || product.thumbnails

    await fs.promises.writeFile('./files/products.json', JSON.stringify(productos, null, 2), 'utf8')

    res.json(product)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al actualizar el producto' })
  }
})


router.delete('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid

    const data = await fs.promises.readFile('./files/products.json', 'utf8')
    const products = JSON.parse(data)

    const index = products.findIndex((product) => product.id === productId)

    if (index === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }

    products.splice(index, 1)

    await fs.promises.writeFile('./files/products.json', JSON.stringify(products, null, 2), 'utf8')

    res.json({ message: 'Producto eliminado correctamente' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al eliminar el producto' })
  }
})


module.exports = router