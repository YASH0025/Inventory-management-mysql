// address.js
import { DataTypes } from 'sequelize';
import sequelize from '../../../connectDB/db.js';
import User from './Users.js';

const Address = sequelize.define('Address', {
    city: {
        type: DataTypes.STRING,
    },
    state: {
        type: DataTypes.STRING,
    },
}, {
    freezeTableName: true,
});


export default Address;