const { DataTypes } = require('sequelize');
const sequelize = require('../sequelizeConnection'); // Import your PostgreSQL connection

const Product = sequelize.define('Product', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT, // You can use FLOAT or DECIMAL based on your requirements
        allowNull: false,
        validate: {
            min: { args: [0], msg: 'Wrong min price' },
            max: { args: [1000000], msg: 'Wrong max price' },
        },
    },
    discountPercentage: {
        type: DataTypes.FLOAT, // FLOAT or DECIMAL for percentage
        allowNull: false,
        validate: {
            min: { args: [0], msg: 'Wrong min discount' },
            max: { args: [100], msg: 'Wrong max discount' },
        },
    },
    discountedPrice: {
        type: DataTypes.FLOAT, // FLOAT or DECIMAL based on your requirements
    },
    rating: {
        type: DataTypes.FLOAT, // FLOAT or DECIMAL for rating
        allowNull: false,
        validate: {
            min: { args: [0], msg: 'Wrong min rating' },
            max: { args: [5], msg: 'Wrong max rating' },
        },
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: { args: [0], msg: 'Wrong min stock' },
        },
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    thumbnail: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    images: {
        type: DataTypes.ARRAY(DataTypes.STRING), // Array of image links
        allowNull: false,
    },
    colors: {
        type: DataTypes.ARRAY(DataTypes.JSONB), // Array of JSON objects
    },
    sizes: {
        type: DataTypes.ARRAY(DataTypes.JSONB), // Array of JSON objects
    },
    highlights: {
        type: DataTypes.ARRAY(DataTypes.STRING), // Array of text
    },
    admin: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    timestamps: true,
    tableName: 'products', // Specify the table name
    underscored: true, // Use underscores for column names
});



module.exports = Product;
