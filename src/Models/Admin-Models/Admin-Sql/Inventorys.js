import { DataTypes } from 'sequelize';
import sequelize from '../../../connectDB/db.js';
import Products from './Products.js';
// import Products from './Products.js';

const Inventorys = sequelize.define(
  'Inventorys',
  {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
);

// Inventorys.belongsTo(Products, { foreignKey: 'productId' });

export default Inventorys;
