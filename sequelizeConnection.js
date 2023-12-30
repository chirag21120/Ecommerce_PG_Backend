const { Sequelize } = require('sequelize');

// Replace these values with your PostgreSQL connection details
const sequelize = new Sequelize('ecommerce', 'postgres', 'root', {
  host: 'localhost', // Change to your PostgreSQL host
  dialect: 'postgres', // Use the PostgreSQL dialect
});


module.exports = sequelize;
