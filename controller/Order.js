const  Order  = require("../model/Order");
const Product  = require("../model/Product");
const  User  = require("../model/User");
const sequelize = require("../sequelizeConnection");
const { sendMail, invoiceTemplate } = require("../services/common");
// const { sendMail, invoiceTemplate } = require("../services/common");

exports.fetchOrdersByUser = async (req, res) => {
  const { id } = req.user;
  // const id = 3;
  try {
    const orders = await sequelize.models.Order.findAll({
      where: { user_id: id }
    });

    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
};

exports.createOrder = async (req, res) => {
  const { items, ...orderData } = req.body;

  const t = await sequelize.transaction();

  try {
    const order = await Order.create(orderData, { transaction: t });

    for (let item of items) {
      const product = await Product.findByPk(item.product.id, { transaction: t });
      product.stock -= item.quantity;
      await product.save({ transaction: t });
    }

    await t.commit();

    const user = await User.findByPk(order.user_id);
    sendMail({ to: user.email, html: invoiceTemplate(order), subject: 'Order Received' });

    res.status(201).json(order);
  } catch (err) {
    await t.rollback();
    res.status(400).json(err);
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.destroy({ where: { id } });
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.update(req.body, { where: { id }, returning: true });
    res.status(200).json(order[1][0]);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchAllOrders = async (req, res) => {
  let query = {
    where: { deleted: { [sequelize.Op.ne]: true } },
    include: [{ model: Product, as: 'items', include: 'Product' }]
  };
  let totalOrdersQuery = { where: { deleted: { [sequelize.Op.ne]: true } } };

  if (req.query._sort && req.query._order) {
    query.order = [[req.query._sort, req.query._order]];
  }

  const totalDocs = await Order.count(totalOrdersQuery);

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query.offset = pageSize * (page - 1);
    query.limit = pageSize;
  }

  try {
    const docs = await Order.findAll(query);
    res.set('X-Total-Count', totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};
  