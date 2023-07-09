const homeController = require('../home/controller.home')
const rtpController = require('../realTimeProducts/controller.rtp')
const productsController = require('../products/controller.products')

const router = app => {
  app.use('/home', homeController)
  app.use('/realTimeProducts', rtpController)
  app.use('/api/products', productsController)
  
}

module.exports = router