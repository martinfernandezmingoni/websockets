const { Router } = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const router = Router();


router.post('/', (req, res) => {
  try {
    const newCart = {
      id: uuidv4(),
      products: [],
    };

    const carts = JSON.parse(fs.readFileSync('./files/carts.json', 'utf8'));
    carts.push(newCart);

    fs.writeFileSync('./files/carts.json', JSON.stringify(carts, null, 2), 'utf8');

    res.json(newCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
});

router.get('/', async (req,res) => {
  try {
    const data = await fs.promises.readFile('./files/carts.json', 'utf8')
    const carts = JSON.parse(data)
    res.json(carts)

  } catch (error) {
    console.log(error)
    res.json(error)
  }
})

router.get('/:cid', (req, res) => {
  try {
    const cartId = req.params.cid;

    const carts = JSON.parse(fs.readFileSync('./files/carts.json', 'utf8'));
    const cart = carts.find((c) => c.id === cartId);

    if (!cart) {
      res.status(404).json({ error: 'Carrito no encontrado' });
    } else {
      res.json(cart.products);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los productos del carrito' });
  }
});

router.post('/:cid/product/:pid', (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const carts = JSON.parse(fs.readFileSync('./files/carts.json', 'utf8'));
    const cart = carts.find((c) => c.id === cartId);

    if (!cart) {
      res.status(404).json({ error: 'Carrito no encontrado' });
    } else {
      const existingProduct = cart.products.find((p) => p.product === productId);

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }

      fs.writeFileSync('./files/carts.json', JSON.stringify(carts, null, 2), 'utf8');

      res.json(cart.products);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar el producto al carrito' });
  }
});

module.exports = router;
