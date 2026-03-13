
import express from 'express'
import { userProfile } from '../controllers/userProfile.js';
import { auth } from '../middleware/authentication.js';
const profileRoute = express.Router();

profileRoute.get('/user/profile',auth, userProfile)

export default profileRoute