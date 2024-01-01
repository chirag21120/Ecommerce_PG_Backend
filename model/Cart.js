const { DataTypes } = require('sequelize');
const sequelize = require('../sequelizeConnection'); // Import your PostgreSQL connection
const Product = require('./Product');
const User = require('./User');

// Define the Cart model
const Cart = sequelize.define('Cart', {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    // Reference the Product and User models
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'products', // Assuming your Product model is named 'Product'
            key: 'id', // Assuming 'id' is the primary key of the Product model
        },
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // Assuming your User model is named 'User'
            key: 'id', // Assuming 'id' is the primary key of the User model
        },
    },
    size: {
        type: DataTypes.JSONB, // Store size as JSONB
    },
    color: {
        type: DataTypes.JSONB, // Store color as JSONB
    },
}, {
    timestamps: false,
    tableName: 'carts', // Specify the table name
    underscored: true, // Use underscores for column names
});

// Define the associations between models
Cart.belongsTo(Product, { foreignKey: 'product_id' });
Cart.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Cart;
