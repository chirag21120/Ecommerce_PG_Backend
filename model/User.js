const { DataTypes } = require('sequelize');
const sequelize = require('../sequelizeConnection'); // Import your PostgreSQL connection

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.BLOB, // You can use BLOB for binary data, adjust this based on your needs
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user',
  },
  addresses: {
    type: DataTypes.ARRAY(DataTypes.JSONB), // Array of JSONB objects
  },
  salt: {
    type: DataTypes.BLOB,
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
}, {
  timestamps: true,
  tableName: 'users', // You can specify the table name
  underscored: true, // Use underscores for column names
});

module.exports = User;
