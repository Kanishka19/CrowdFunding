import { Router } from "express";
import cookieParser from "cookie-parser";
import {Users} from "../models/User.js";
import bcrypt from "bcryptjs";
import {authSchema} from "../helpers/validation.js";
import {jwtAccessToken, verifyJwtToken, signRefreshToken, verifyRefreshToken} from "../helpers/jwt.js";
import createError from "http-errors";

const router = Router();

router.get('/', verifyJwtToken, async(req,res,next) => {
    res.send("Testing the get request with bearer token")
})

router.post('/register', async(req, res, next) => { 
    try{
    const result = await authSchema.validateAsync(req.body);
    
    const userExist = await Users.findOne({email: result.email});
    if (userExist) {
        return res.status(400).json({
            message: "It seems you already have an account, please log in instead.",
        })
    }
    const hash_password = await bcrypt.hashSync(result.password, 10);
    const user = new Users({ email: result.email, password: hash_password});
    const savedUser = await user.save();
    const accessToken = await jwtAccessToken(savedUser.id)
    const refreshToken = await signRefreshToken(savedUser.id)
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    res.send({accessToken, refreshToken});
    }
    catch(error){
        if(error.isJoi === true)
            error.status =422
        next(error)
    }
})
router.post('/login', async (req, res, next) => {
 try{
    const result = await authSchema.validateAsync(req.body);
    const user = await Users.findOne({email: result.email});
    if(!user)
        return createError.NotFound("User not registered")
    const validPassword = await bcrypt.compareSync(result.password, user.password)
    console.log(validPassword)
    if(!validPassword)
        return createError.Unauthorized("Invalid username or password")
    
    const accessToken = await jwtAccessToken(user.id)
    const refreshToken = await signRefreshToken(user.id)
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    res.send({accessToken, refreshToken});
}
 catch(err){
    if(err.isJoi === true) 
        return next(createError.BadRequest("Invalid Username or Password"))
    next(err);
 }
})

router.post('/refresh-token', async(req, res, next) => {
    const {refreshToken} = req.body;
    if(!refreshToken)
        return next(createError.Unauthorized)
    const userId= await verifyRefreshToken(refreshToken)
    const accessToken= await jwtAccessToken(userId)
    const refToken = await signRefreshToken(userId)
    res.send({accessToken: accessToken, refreshToken: refToken})
})

router.delete('/logout', async(req,res,next) => {
    res.send("Logging out")
})

export default router;