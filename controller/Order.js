const  Order  = require("../model/Order");
const Product  = require("../model/Product");
const  User  = require("../model/User");
const {Op, literal} = require("sequelize")
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
    const ordersWithProducts = await Promise.all(
      orders.map(async (order) => {
        try {
          // Extract productIds from the items array
          const productIds = order.items.map((item) => item.product_id);
    
          // Filter out undefined or null values
          const validProductIds = productIds.filter((productId) => productId);
    
          // Fetch products based on valid productIds
          const products = await Product.findAll({
            where: {
              id: validProductIds,
            },
          });
    
          // Map products to corresponding items in the order
          const itemsWithProducts = order.items.map((item) => {
            const product = products.find((product) => product.id === item.product_id);
            return {
              ...item,
              product, // Attach the product information to the item
            };
          });
    
          // Return the order with items enriched with product information
          return {
            ...order.toJSON(),
            items: itemsWithProducts,
          };
        } catch (error) {
          console.error('Error processing order:', error);
          return null; // Handle the error or log it as needed
        }
      })
    );
    
    // Remove null values from the result
    const filteredOrdersWithProducts = ordersWithProducts.filter((order) => order !== null);
    
    res.status(200).json(filteredOrdersWithProducts);
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
};

exports.createOrder = async (req, res) => {
  const { itemDetails, ...orderData } = req.body;

  const t = await sequelize.transaction();
  try {
    console.log(orderData);
    let order = await Order.create(orderData,{transaction:t});
    order = order.dataValues;
    for (let item of itemDetails) {
      const product = await Product.findByPk(item.product_id,{transaction:t});
      product.stock -= item.quantity;
      await product.save({transaction:t});
    }

    const user = await User.findByPk(order.user_id);
    // const invoice = {...order,itemDetails}
    // console.log(user);
    // sendMail({ to: user.dataValues.email, html: invoiceTemplate( invoice), subject: 'Order Received' });
    await t.commit();

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
  };

  if (req.query._sort && req.query._order) {
    query.order = [[req.query._sort, req.query._order]];
  }
  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query.offset = pageSize * (page - 1);
    query.limit = pageSize;
  }

  try {
    const orders = await Order.findAndCountAll(query);
    const ordersWithProducts = await Promise.all(
      orders.rows.map(async order => {
        const itemsWithProducts = await Promise.all(
          order.items.map(async (item) => {
            const product = await Product.findByPk(item.product_id);
            if(!product){
              console.error(item)
            }
            return {
              ...item,
              product, // Attach the product information to the item
            };
          })
        );
  
        // Return the order with items enriched with product information
        return {
          ...order.toJSON(),
          items: itemsWithProducts,
        };
      })
      );
    res.set('X-Total-Count', orders.count);
    res.status(200).json(ordersWithProducts);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
  