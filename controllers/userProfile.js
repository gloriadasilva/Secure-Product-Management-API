import { User } from "../model/userModel.js"

export const userProfile = async (req, res)=>{

  const {id} = req.params;

  const findUser = await User.findById(id).select('-password')    
  if(!findUser){
    return res.status(400).json({success:false, msg:"User not found"})
  }
  return res.status(200).json({success:true, msg:findUser})
   
}

