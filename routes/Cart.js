const express = require('express');
const { addToCart, fetchCartByUser, deleteFromCart, updateCart, resetCart } = require('../controller/Cart');

const router = express.Router();
//  /products is already added in base path
router.post('/', addToCart)
      .get('/', fetchCartByUser)
      .delete('/item/:id', deleteFromCart)
      .delete('/reset',resetCart)
      .patch('/:id', updateCart)


exports.router = router;