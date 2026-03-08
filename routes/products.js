
import express from 'express'
import { auth } from '../middleware/authentication.js';

import {createUser, login, getAllProducts, createProduct, editProduct, deleteProduct, getProductByName, filter} from "../controllers/products.js";

const routes = express.Router();

routes.post('/user', createUser)
routes.post('/login', login)
routes.get('/all-products', getAllProducts)
routes.post('/product', auth, createProduct)
routes.patch('/product/edit/:id', auth, editProduct)
routes.delete('/product/delete/:id', auth, deleteProduct)
routes.get('/product/:name', getProductByName)
routes.get('/product/search', filter)

export default routes;

