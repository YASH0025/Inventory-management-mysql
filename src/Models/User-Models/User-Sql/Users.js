
import { DataTypes } from 'sequelize';
import sequelize from '../../../connectDB/db.js';
import Address from './Address.js';
import Roles from './Role.js';

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
    },
    phone: {
        type: DataTypes.STRING,
    },
    
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    address: {
        type: DataTypes.JSON, // Use DataTypes.JSON for JSON data
      },

}, {
    freezeTableName: true,
});

// User.hasOne(Address);
Address.belongsTo(User);


User.belongsTo(Roles, { foreignKey: 'roleId', as: 'Role' });


export default User;

