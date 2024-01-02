const Cart  = require('../model/Cart');

exports.fetchCartByUser = async (req, res) => {
  const { id } = req.user;
  // const id = 5;
  try {
    const cartItems = await Cart.findAll({ 
      where: { user_id: id },
      include: 'Product' // Assuming the association is named 'Product'
    });

    res.status(200).json(cartItems);
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
};

exports.addToCart = async (req, res) => {
  const {id} = req.user;
  const { product_id, quantity, size, color } = req.body;
  try {
    const cart = await Cart.create({ product_id, user_id: id, quantity, size, color });
    const result = await cart.reload({ include: 'Product' });
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.deleteFromCart = async (req, res) => {
    const { id } = req.params;
    try {
    const doc = await Cart.destroy({ where: { product_id: id, user_id: req.user.id } });
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateCart = async (req, res) => {
  const { id } = req.params;
  try {
    await Cart.update(req.body, { where: { product_id: id, user_id: req.user.id } });
    const updatedCart = await Cart.findOne({ where: { product_id: id, user_id: req.user.id },include:'Product' });
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(400).json(err);
  }
};