const { DataTypes } = require('sequelize');
const sequelize = require('../sequelizeConnection'); // Import your PostgreSQL connection
const User = require('./User');
const Product = require('./Product')
// Define the Order model
const Order = sequelize.define('Order', {
    items: {
        type: DataTypes.ARRAY(DataTypes.JSONB), // Store items as an array of JSON objects
        allowNull: false,
    },
    totalAmount: {
        type: DataTypes.FLOAT,
    },
    totalItems: {
        type: DataTypes.INTEGER,
    },
    // Reference the User model
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users', // Assuming your User model is named 'User'
            key: 'id', // Assuming 'id' is the primary key of the User model
        },
        allowNull: false,
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['card', 'cash']], // Enforce enum validation
        },
    },
    paymentStatus: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
    },
    selectedAddress: {
        type: DataTypes.JSONB, // Store the address as JSONB
        allowNull: false,
    },
}, {
    timestamps: true,
    tableName: 'orders', // Specify the table name
    underscored: true, // Use underscores for column names
});

// Define the associations between models
Order.belongsTo(User, { foreignKey: 'user_id' });
Order.hasMany(Product, { foreignKey: 'id', sourceKey: 'items', as: 'products' });


module.exports = Order;
