import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import BadRequest from '../errors/badRequest.js';
dotenv.config();

export const auth = (req, res, next)=>{
    const tokenVal = req.headers.authorization
    if(!tokenVal || !tokenVal.startsWith('Bearer ')){
        throw new BadRequest ("Missing token value")
    }
    const token = tokenVal.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JSON_SECRET)
        const {name, role} = decoded;
        req.user = {name, role}
        next();
    } catch (error) {
        throw new BadRequest ("Token is invalid")

    }

}

