import JWT from 'jsonwebtoken';

const generateToken = (user) => {
    return JWT.sign({email: user.email, id: user._id}, process.env.JWT_KEY, {expiresIn: "2d"})
}

export default generateToken;