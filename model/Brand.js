const { DataTypes } = require('sequelize');
const sequelize = require('../sequelizeConnection'); // Import your PostgreSQL connection

// Define the Brand model
const Brand = sequelize.define('Brand', {
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
    tableName: 'brands', // Specify the table name
    underscored: true, // Use underscores for column names
});

module.exports = Brand;
