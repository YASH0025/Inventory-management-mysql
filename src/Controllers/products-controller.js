
import adminHelper from '../Helper/admin-controller.helper.js';
const { getTokenDataFromHeader, handleStatusCode, generateToken } = adminHelper
import Inventorys from "../Models/Admin-Models/Admin-Sql/Inventorys.js";
import Products from "../Models/Admin-Models/Admin-Sql/Products.js";
import Categorys from "../Models/Admin-Models/Admin-Sql/Category.js";
import Orders from "../Models/Admin-Models/Admin-Sql/Orders.js";
import Tokens from 'jsonwebtoken';
const { verify } = Tokens


const products = async (req, res) => {
    try {
        const allProducts = await Products.findAll();
        const allInventorys = await Inventorys.findAll();

        const simplifiedProducts = allInventorys.map(inventory => {
            const matchingProduct = allProducts.find(product => product.id === inventory.productId);
            return {
                name: matchingProduct.name,
                price: matchingProduct.price,
                quantity: inventory.quantity,
            };
        });

        res.json(simplifiedProducts);
    } catch (error) {
        console.error(error);
        handleStatusCode(res, 500, 'Internal Server Error');
    }
};


// const removeProducts = async (req, res) => {
//     try {
//         const categoryId = req.body.category;

//         if (!categoryId) {
//             return handleStatusCode(res, 400, 'Category ID is required in the request body');
//         }

//         // Step 1: Find all products in the specified category
//         const products = await Products.findAll({
//             where: {
//                 categoryId: categoryId,
//             },
//         });
      
//         for (let product of products) {
//             await Inventorys.destroy({
//                 where: {
//                     productId: product.id,
//                 },
//             });
//         }

//         // Step 3: Delete the products in the specified category
//         await Products.destroy({
//             where: {
//                 categoryId: categoryId,
//             },
//         });

//         // Step 4: Delete the category itself
//         const deletedCategoryCount = await Categorys.destroy({
//             where: {
//                 id: categoryId,
//             },
//         });

//         // Check if the category was found and deleted
//         if (deletedCategoryCount === 0) {
//             return handleStatusCode(res, 404, 'Category not found');
//         }

//         res.json({ message: 'Category and associated products deleted successfully' });
//     } catch (error) {
//         console.error(error);
//         handleStatusCode(res, 500, 'Internal Server Error');
//     }
// };


const removeProducts = async (req, res) => {
    try {
        const  categoryId  = req.body.category;

        const products = await Products.findAll({ where: { categoryId: categoryId } });

        for (let product of products) {
            await Inventorys.destroy({ where: { productId: product.id } });
        }

        await Products.destroy({ where: { categoryId: categoryId } });


        const deletedCategory = await Categorys.destroy({ where: { id: categoryId } });

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({ message: 'Category and associated products deleted successfully' });
    } catch (error) {
        console.error(error);
        handleStatusCode(res, 500, 'Internal Server Error');
    }
};
const removeSingleProduct = async (req, res) => {
    try {
      const { productId } = req.body;
  
      // Delete the associated inventory first
      const deletedInventory = await Inventorys.destroy({
        where: {
          productId: productId,
        },
      });
  
 
  
      // Delete the product
      const deletedProduct = await Products.destroy({
        where: {
          id: productId,
        },
        include: [Inventorys], // Include the associated Inventory model
      });
  
      if (deletedProduct === 0) {
        return handleStatusCode(res, 404, 'No product with that ID was found.');
      }
  
      res.status(200).json({ message: 'Product and associated inventory deleted successfully' });
    } catch (error) {
      console.log('Error in delete Single Product', error);
      handleStatusCode(res, 500, 'Server Error');
    }
  };
  

// const removeSingleProduct = async (req, res) => {
//     try {
//         const { productId } = req.body;


//         await Inventorys.destroy({
//             where: {
//                 productId: productId,
//             },
//         });
 
//         const deletedProduct = await Products.destroy({
//             where: {
//                 id: productId,
//             },
//         });

//         if (deletedProduct === 0) {
//             return handleStatusCode(res, 404, 'No product with that ID was found.');
//         }

//         res.status(201).json({ message: 'Product deleted successfully' });
//     } catch (error) {
//         console.log('Error in delete Single Product', error);
//         handleStatusCode(res, 500, 'Server Error');
//     }
// };

// const filteredProducts = async (req, res) => {
//     try {
//         const { categoryId } = req.body;

//         // Use a transaction to ensure atomicity
//         await sequelize.transaction(async (t) => {
//             // Find the category and delete it along with associated products, orders, and inventory
//             await Categorys.destroy({
//                 where: {
//                     id: categoryId,
//                 },
//                 include: [
//                     {
//                         model: Products,
//                         as: 'products',
//                         include: [
//                             {
//                                 model: Orders,
//                                 as: 'orders',
//                                 attributes: ['id'], // Add any other attributes you want to retrieve
//                                 required: false,
//                             },
//                             {
//                                 model: Inventorys,
//                                 as: 'inventory',
//                                 attributes: ['id', 'quantity'], // Add any other attributes you want to retrieve
//                                 required: false,
//                             },
//                         ],
//                         attributes: ['id'], // Add any other attributes you want to retrieve
//                         required: false,
//                     },
//                 ],
//                 transaction: t,
//             });

//             // Fetch remaining products after deletion
//             const remainingProducts = await Products.findAll({
//                 where: {
//                     categoryId: {
//                         [Op.not]: null, // Filter only products with categoryId not null
//                     },
//                 },
//                 include: [
//                     {
//                         model: Inventorys,
//                         as: 'inventory',
//                         attributes: ['quantity'],
//                     },
//                 ],
//             });

//             const allProducts = remainingProducts.map(product => {
//                 const productDetails = {
//                     id: product.id,
//                     name: product.name,
//                     price: product.price,
//                     quantity: product.inventory ? product.inventory.quantity : 0,
//                 };
//                 return productDetails;
//             });

//             res.status(200).json(allProducts);
//         });
//     } catch (error) {
//         console.error(error);
//         handleStatusCode(res, 500, 'Internal Server Error');
//     }
// };


const filteredProducts = async (req, res) => {
    try {
        const { categoryId } = req.body;

        const categoryProducts = await Products.findAll({
            where: {
                categoryId: categoryId,
            },
          include: [
    {
        model: Inventorys,
        as: 'inventory',
        attributes: ['quantity'],
    },
],

        });

        if (categoryProducts.length === 0) {
            return handleStatusCode(res, 404, 'No products found in the specified category.');
        }

        const allProducts = categoryProducts.map(product => {
            const productDetails = {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: product.inventory ? product.inventory.quantity : 0,
            };
            return productDetails;
        });

        res.status(200).json(allProducts);
    } catch (error) {
        console.error(error);
        handleStatusCode(res, 500, 'Internal Server Error');
    }
};



const orderProduct = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = verify(token, 'your-secret-key');

        const userId = decodedToken.userId;

        const inventory = await Inventorys.findOne({ where: { productId } });

        if (!inventory) {
            return handleStatusCode(res, 404, 'Inventory not found for the specified product');
        }

        if (inventory.quantity < quantity) {
            return handleStatusCode(res, 400, 'Insufficient quantity in the inventory.');
        }

        inventory.quantity -= quantity;
        await inventory.save();

        const newOrder = await Orders.create({
            productId,
            userId,
            quantity,
        });

        res.status(200).json({ details: newOrder });
    } catch (error) {
        console.error("Error at ordering a Product", error);
        handleStatusCode(res, 500, 'Server Error');
    }
};


export default {
    products,
    removeProducts,
    removeSingleProduct,
    filteredProducts,
    orderProduct
}

