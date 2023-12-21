import { DataTypes } from 'sequelize';
import sequelize from '../../../connectDB/db.js';
import User from '../../User-Models/User-Sql/Users.js';
// import User from './User.js'; // Import the User model

const Categorys = sequelize.define('Categorys', {
  name: {
    type: DataTypes.STRING,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Categorys.belongsTo(User, { foreignKey: 'createdBy' });

export default Categorys;
