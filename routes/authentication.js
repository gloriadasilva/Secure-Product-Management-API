import express from 'express'
import {createUser, login, refresh, logOut} from '../controllers/auth.js';

const loginroutes = express.Router();

loginroutes.post('/user', createUser)
loginroutes.post('/user/login', login)
loginroutes.post('/auth/refresh', refresh)
loginroutes.post('/user/logout', logOut)
export default loginroutes;