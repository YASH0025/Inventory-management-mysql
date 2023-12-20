import { DataTypes } from 'sequelize';

import Category from './Category.js'; 
import sequelize from '../../../connectDB/db.js';
import Categorys from './Category.js';

const Products = sequelize.define('Products', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.INTEGER, 
    references: {
        model: 'Categorys', 
        key: 'id',
    },
    allowNull: false,
},
});

Products.belongsTo(Categorys);

export default Products;
