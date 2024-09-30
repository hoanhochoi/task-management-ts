import { Response,Request } from "express";
import User from "../../../models/user.model"
import {generateRandomString} from "../../../helper/generate"
import md5 from "md5"
export const register =async (req:Request,res: Response) =>{
    const email:string = req.body.email;
    const existEmail = await User.findOne({
        email: email,
        deleted: false
    })
    if(existEmail){
        res.json({
            code: 400,
            message:"email đã tồn tại!"
        })
        return;
    }else{
        req.body.token = generateRandomString(20)
        req.body.password = md5(req.body.password)
        const user = new User(req.body);
        const data = await user.save()
        res.json({
            token: data.token,
            code: 200,
            message: "tạo mới user thành công!"
        })
    }

}

export const login = async (req: Request,res: Response)=>{
    const user = await User.findOne({
        email: req.body.email,
        deleted : false
    })
    if (!user){
        res.json({
            code: 400,
            message: "email không tồn tại!"
        })
        return;
    }
    if (user.password !== md5(req.body.password)){
        res.json({
            code: 400,
            message: "mật khẩu không đúng!"
        })
        return;
    }
    res.json({
        message: "đăng nhập thành công!",
        code: 200,
        token : user.token
    })
}