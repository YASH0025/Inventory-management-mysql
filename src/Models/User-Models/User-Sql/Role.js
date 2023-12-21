import { DataTypes } from 'sequelize';
import sequelize from '../../../connectDB/db.js';


const Roles = sequelize.define('Roles', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    // await existingUser.setRoles([userRole.id]);
},
 {
    freezeTableName: true,
});
export default Roles;
