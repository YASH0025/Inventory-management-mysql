
import express from 'express';
import { json } from 'express';
import sequelize from './src/connectDB/db.js';
import User from './src/Models/User-Models/User-Sql/Users.js';
import router from './index.js';

const app = express();

app.use(json());
app.use('/', router);

const PORT = 5500;
const models = {
  User,
  
};

sequelize.sync().then(() => {
  console.log('Sequelize models synchronized with the database');

  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Error synchronizing Sequelize models:', error);
});
