const {Product} = require("../model/Product")
const {sequelize} = require('../sequelizeConnection');

exports.createProduct = async (req, res) => {
  const { id } = req.user;
  try {
      const product = await Product.create({ ...req.body, admin: id });
      res.status(201).json(product);
  } catch (err) {
      res.status(400).json(err);
  }
};


exports.fetchAllProduct = async (req, res) => {
  const query = {
      where: { deleted: false },
  };

  if (req.query.category) {
      query.where.category = req.query.category.split(',');
  }

  if (req.query.brands) {
      query.where.brand = req.query.brands.split(',');
  }

  if (req.query._sort && req.query._order) {
      query.order = [[req.query._sort, req.query._order]];
  }

  const page = req.query._page ? parseInt(req.query._page, 10) : 1;
  const pageSize = req.query._limit ? parseInt(req.query._limit, 10) : 10;
  const offset = (page - 1) * pageSize;

  try {
      const { rows, count } = await Product.findAndCountAll({
          where: query.where,
          order: query.order,
          limit: pageSize,
          offset,
      });

      res.set('X-Total-Count', count);
      res.status(200).json(rows);
  } catch (err) {
      res.status(400).json(err);
  }
};


exports.fetchProductById = async (req, res) => {
  const { id } = req.params;
  try {
      const product = await Product.findByPk(id);
      res.status(200).json(product);
  } catch (err) {
      res.status(400).json(err);
  }
};


exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
      const [updatedCount, updatedProduct] = await Product.update(req.body, {
          where: { id },
          returning: true,
      });
      if (updatedCount === 0) {
          return res.status(404).json({ error: 'Product not found' });
      }
      res.status(200).json(updatedProduct[0]);
  } catch (err) {
      res.status(400).json(err);
  }
};


exports.fetchAdminProducts = async (req, res) => {
  const { id } = req.user;
  const query = {
      where: { admin: id },
  };

  if (req.query.category) {
      query.where.category = req.query.category.split(',');
  }

  if (req.query.brands) {
      query.where.brand = req.query.brands.split(',');
  }

  if (req.query._sort && req.query._order) {
      query.order = [[req.query._sort, req.query._order]];
  }

  const page = req.query._page ? parseInt(req.query._page, 10) : 1;
  const pageSize = req.query._limit ? parseInt(req.query._limit, 10) : 10;
  const offset = (page - 1) * pageSize;

  try {
      const { rows, count } = await Product.findAndCountAll({
          where: query.where,
          order: query.order,
          limit: pageSize,
          offset,
      });

      res.set('X-Total-Count', count);
      res.status(200).json(rows);
  } catch (err) {
      res.status(400).json(err);
  }
};
