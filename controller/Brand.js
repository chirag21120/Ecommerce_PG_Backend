const Brand  = require('../model/Brand');
const sequelize = require("../sequelizeConnection")
exports.fetchBrands = async (req, res) => {
  try {
    const brands = await sequelize.models.Brand.findAll();
    res.status(200).json(brands);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.createBrand = async (req, res) => {
  try {
    const {label,value} = req.body;
    const doc = await Brand.create({label, value});
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};