import jwt from "jsonwebtoken"
import cookieParser from 'cookie-parser';

import { User } from "../model/userModel.js";
import BadRequest from "../errors/badRequest.js";
import unAuthorized from "../errors/unauthorized.js";


const createUser = async (req, res)=>{
    const {name, email, password, confirm} = req.body;
    
   const findUser = await User.exists({email:email});    
    if(findUser){
        throw new BadRequest ("Email already exist")
    }
    if (password !== confirm){
        throw new BadRequest("Password must match!")
    }    
    if(!name||!password || !email){
        throw new BadRequest("Fields cannot be empty")
    }
    const userCreated = await User.create({
        name:name,
        email: email,
        password: password,

     })    
    res.status(201).json({success:true, msg:"User created",'name':name, 'email':email})

}

const login = async (req, res)=>{
    const {email, password} = req.body;        
    
    if(!email || !password){
        throw new unAuthorized("Username or password cannot be empty")
    }    

    const user = await User.findOne({email}).select('+password')
    if(!user){
        throw new BadRequest("Invalid request!")
    }

    const isMatch = await user.comparePassword(String(password))

    if(!isMatch){
        throw new unAuthorized("Incorrect password.")
    }
    
    const Payload = {
      userId:user._id,
      name:user.name,
      role:user.role
    }
    const token = jwt.sign(Payload, process.env.JSON_SECRET, {expiresIn:'15m'})        

    const refreshToken = jwt.sign(
        {userId: user._id},
        process.env.REFRESH_SECRET,
        {expiresIn:'30d'}
    )
    res.cookie('refreshToken', refreshToken, {
        httpOnly:true,
        secure: process.env.NODE_ENV === 'production',
        sameSite:'Strict',
        maxAge: 1000* 60 * 60 * 24 * 7

    } )
    res.status(200).json({success:true, msg:token})

}

const refresh = (req, res)=>{

    const token = req.cookies?.refreshToken;

    if (!token){
        throw new BadRequest("No token found!")
    }
    try {
        const decoded = jwt.verify(token, process.env.REFRESH_SECRET)

        const newAccessToken = jwt.sign(
            {userId:decoded.userId},
            process.env.JSON_SECRET,
            {expiresIn:'15m'}
        )
        res.status(200).json({success:true, accessToken:newAccessToken})
    } catch (error) {
        res.clearCookie('refreshToken')
        res.status(403).json({success:false, msg:"Session expired! Kindly login again."})
    }
}

const logOut = (req, res)=>{
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV==='production',
        sameSite: 'strict',
        maxAge: 1000* 60 * 60 * 24 * 7
    })
    res.status(200).json({success:true, msg: "Logged out."})
}
export {
    createUser,
    login,
    refresh,
    logOut
}