import { DataTypes } from 'sequelize';
import sequelize from '../../../connectDB/db.js';
import Categorys from './Category.js';
import Inventorys from './Inventorys.js';
import Orders from './Orders.js';

const Products = sequelize.define('Products', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  // Remove the manual definition of categoryId
});
// In your Products model
Products.hasMany(Orders, { foreignKey: 'productId', onDelete: 'CASCADE' });


Products.belongsTo(Categorys,{ foreignKey: 'categoryId', as: 'category' });
// In your Products model
Products.hasOne(Inventorys, { foreignKey: 'productId', as: 'inventory' });

export default Products;
