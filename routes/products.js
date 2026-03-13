
import express from 'express'
import { auth } from '../middleware/authentication.js';
import {getAllProducts, createProduct, editProduct, deleteProduct, getProductByName, filter} from "../controllers/products.js";

const routes = express.Router();

routes.get('/products', getAllProducts)
routes.post('/product', auth, createProduct)
routes.patch('/product/edit/:id', auth, editProduct)
routes.delete('/product/delete/:id', auth, deleteProduct)
routes.get('/product/search', filter)
routes.get('/product/:name', getProductByName)

export default routes;

