import { DataTypes } from 'sequelize';
import Products from './Products.js';
import User from '../../User-Models/User-Sql/Users.js';
import sequelize from '../../../connectDB/db.js';

const Orders = sequelize.define('Orders', {
    userId: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    productId: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: Products,
            key: 'id',
        },
    },
    quantity: {
        type: DataTypes.INTEGER, 
        allowNull: false,
    },
});

export default Orders;
