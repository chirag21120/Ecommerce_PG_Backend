
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelizeConnection'); // Import your PostgreSQL connection

// Define the Category model
const Category = sequelize.define('Category', {
    label: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    timestamps: false,
    tableName: 'categories', // Specify the table name
    underscored: true, // Use underscores for column names
});

module.exports = Category;
