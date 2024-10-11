const express = require('express');
const router = express.Router();
const productsControllers = require('../controllers/productsControllers');


// Endpoints manuales.
router.get('/', productsControllers.getProducts);
router.post('/', productsControllers.postProducts);
// router.get('/:id', productControllers.getProductsById);
router.put('/:id', productsControllers.updateProducts);
router.delete('/:id', productsControllers.deleteProducts);


module.exports = router;