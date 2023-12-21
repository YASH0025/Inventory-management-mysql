import { DataTypes } from 'sequelize';
import sequelize from '../../../connectDB/db.js';
import Products from './Products.js';
import User from '../../User-Models/User-Sql/Users.js';

const Orders = sequelize.define('Orders', {
    quantity: {
        type: DataTypes.INTEGER, 
        allowNull: false,
    },
});

Orders.belongsTo(User, { foreignKey: 'userId' });
// Orders.belongsTo(Products, { foreignKey: 'productId' });

export default Orders;
