import { DataTypes } from 'sequelize';
import sequelize from '../../../connectDB/db.js';


const Categorys = sequelize.define('Categorys', {
    name: {
        type: DataTypes.STRING,
    },
    createdBy: {
        type: DataTypes.INTEGER, 
        references: {
            model: 'User', 
            key: 'id',
        },
        allowNull: false,
    },
});

export default Categorys;
