import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        email: {
            type: String,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        avatar: {
            type: String,
            required: true
        }, 
        refreshToken: {
            type: String
        }

    }, {timestamps: true}
);

userSchema.pre('save', async function(next){
    if(!this.isModified("password")) return next()
    
    this.password = await bcrypt.hash(this.password, 10)
    next();
})

userSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function(){
    jwt.sign({
        _id: this.id,
        email: this.email,
        username: this.username
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
userSchema.methods.generateAccessToken = function(){
    jwt.sign({
        _id: this.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)
}



export const User = mongoose.model('User', userSchema);