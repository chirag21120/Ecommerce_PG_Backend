const { User } = require("../model/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sanitizeUser, sendMail } = require("../services/common");
const dotenv = require("dotenv");

dotenv.config();

const secret_key = process.env.JWT_SECRET;

exports.createUser = async (req, res) => {
  try {
    const already = await User.findOne({email:req.body.email})
    if(already){
     return res.sendStatus(400);
    }
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const response = await user.save();
        req.login(sanitizeUser(response), (err) => {
          if (err) {
            res.status(400).json(err);
          } else {
            const token = jwt.sign(sanitizeUser(user), secret_key);
  const expirationTime = Date.now() +3600000;
            res
              .cookie("jwt", token, {
                expires: new Date(expirationTime),
                httpOnly: true,
              })
              .status(201)
              .json({if:user.id,role:user.role});
          }
        });
      }
    );
  } catch (err) {
    res.status(400).json(err);
  }
};




exports.loginUser = async (req, res) => {
  const user = req.user
  
  const expirationTime = Date.now() +3600000;
  await res.cookie("jwt", user.token, {
    expires: new Date(expirationTime),
    httpOnly: true,
  })
  .status(200)
  .json({id:user.id,role:user.role,token:user.token});
};

exports.checkAuth = async (req, res) => {
  if(req.user){
  res.json(req.user );
}else{
  res.sendStatus(401);
}
};

exports.logout = async(req,res)=>{
  res.cookie("jwt", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  })
  .sendStatus(200);
}
exports.resetPasswordRequest = async (req, res) => {
  const email =  req.body.email
  const user = await User.findOne({email:email});
  if(user){
    const token = crypto.randomBytes(48).toString('hex');
    user.resetPasswordToken = token;
    await user.save();
    const link = "https://ecommerce-backend-lyart.vercel.app/reset-password?token="+token+'&email='+email;
  const subject = "Reset Password for e-commerce";
  const html = `<p> <a href='${link}'>Click here</a> to reset your Password</p>`
  if(email){
   const response = await sendMail({to:email,subject,html})
   res.json(response)
}else{
  res.sendStatus(400);
}
  }
  else
  res.sendStatus(400)
};

exports.resetPassword = async (req, res) => {
  const {email,token,password} =  req.body;
  const user = await User.findOne({email:email,resetPasswordToken:token});
  if(user){
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        user.password = hashedPassword;
        user.resetPasswordToken = "";
        user.salt = salt;
        await user.save();
      const subject = "Password Successfully reset for e-commerce";
      const html = `<p> Successfully able to reset your Password</p>`
      if(email){
       const response = await sendMail({to:email,subject,html})
       res.json(response)
    }else{
      res.sendStatus(400);
    }
      })
  }
  else
  res.sendStatus(400)
};


