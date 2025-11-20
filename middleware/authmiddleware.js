import jwt from "jsonwebtoken";
import User from '../models/user.js';



export default async function auth(req, res, next) {
    try {
        //  console.log("AUTH HEADERS:", req.headers);
        // console.log("AUTH COOKIES:", req.cookies);

        //   console.log("🔥 AUTH MIDDLEWARE TRIGGERED");

        let token = null;

        const authHeader= req.headers && req.headers.authorization;

        if(authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }

        if(!token & req.cookies && req.cookies.token){
            token = req.cookies.token;
        }

        

        if(!token){
            return res.status(401).json({
                success: false,
                message: "NO Token Provided"
            });
        }

        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_KEY);
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invaild or expired Token"
            })
        }

        const user = await User.findById(payload.id).select("-password");

        if(!user){
            return res.status(401).json({
                success: false,
                message: "User Not Found"
            })
        }

        req.user = user

        next()
    } catch (error) {
        return res.status(500).json({
                success: false,
                message: "Authentication Error",
                message: error.message
            })
    }
}

