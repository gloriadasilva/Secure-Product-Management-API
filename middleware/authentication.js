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
        req.user = {_id:decoded.userId, name:decoded.name, role:decoded.role}
        next();
    } catch (error) {
        if(error.name === 'TokenExpiredError'){
            return res.status(401).json({success:false, msg:"Token expired."})
        }
        throw new BadRequest ("Token is invalid")

    }

}

