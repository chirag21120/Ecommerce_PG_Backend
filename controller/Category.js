const Category  = require('../model/Category');
const sequelize = require("../sequelizeConnection")

exports.fetchCategories = async (req, res) => {
  try {
    const categories = await sequelize.models.Category.findAll();
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.createCategory = async (req, res) => {
  try {
    const {label,value} = req.body;
    const doc = await Category.create({label,value});
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};