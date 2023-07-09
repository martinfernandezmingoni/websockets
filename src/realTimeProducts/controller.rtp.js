const { Router } = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { io } = require('socket.io');

const router = Router();

router.get('/', async (req, res) => {
  try {
    const data = await fs.promises.readFile('./src/files/products.json', 'utf8');
    const products = JSON.parse(data);

    res.render('realTimeProducts', { products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const data = await fs.promises.readFile('./src/files/products.json', 'utf8');
    const products = JSON.parse(data);

    const productId = uuidv4();

    const newProduct = {
      id: productId,
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails: thumbnails || []
    };

    products.push(newProduct);

    await fs.promises.writeFile('./src/files/products.json', JSON.stringify(products, null, 2), 'utf8');
    const {io} = req

    io.emit('newProduct', newProduct);
    io.emit('message', `Producto ${newProduct.id} creado con éxito`);

    res.status(201).json({ newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar el producto' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { params: {id}, io } = req;

    const data = await fs.promises.readFile('./src/files/products.json', 'utf8');
    const products = JSON.parse(data);

    const updatedProducts = products.filter(product => product.id !== id);

    await fs.promises.writeFile('./src/files/products.json', JSON.stringify(updatedProducts, null, 2), 'utf8');

    io.emit('deleteProduct', id);
    io.emit('message', `Producto ${id} eliminado con éxito`);

    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error("the error", error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

module.exports = router;
