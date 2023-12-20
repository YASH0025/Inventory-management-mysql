import { Router } from 'express';
const router = Router();
import auth from '../../Middlewares/cheak-role-auth-middleware.js';
import adminControlls from '../../Controllers/admin-controller.js';
const  { addProductController, assignRoleByEmailController, productsController, inventoryController, updateInventoryController, removeCategory } = adminControlls


router.post('/add-products',auth, addProductController)
router.put('/assign-role',auth,assignRoleByEmailController );
router.post('/remove', removeCategory);


export default router;
