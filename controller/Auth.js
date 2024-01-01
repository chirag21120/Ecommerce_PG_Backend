const sequelize = require('../sequelizeConnection')
const User  = require("../model/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sanitizeUser, sendMail } = require("../services/common");
const dotenv = require("dotenv");

dotenv.config();

const secret_key = process.env.JWT_SECRET;

exports.createUser = async (req, res) => {
  try {
    console.log(req.body);
    const already = await User.findOne({ where: { email: req.body.email } });
    console.log("hi");
      if (already) {
          return res.status(400).json({error:'user alredy '});
      }
      const salt = crypto.randomBytes(16);
      crypto.pbkdf2(
          req.body.password,
          salt,
          310000,
          32,
          'sha256',
          async function (err, hashedPassword) {
              try {
                console.log(User);
                  const user = await User.create({
                      username: req.body.username,
                      email:req.body.email,
                      password: hashedPassword,
                      role:'user',
                      salt:salt,
                  });

                  const token = jwt.sign(user.toJSON(), secret_key);
                  const expirationTime = Date.now() + 3600000;

                  res
                      .cookie('jwt', token, {
                          expires: new Date(expirationTime),
                          httpOnly: true,
                      })
                      .status(201)
                      .json({ id: user.id, role: user.role });
              } catch (err) {
                console.log(err);
                  res.status(400).json(err);
              }
          }
      );
  } catch (err) {
      res.status(400).json(err);
  }
};





exports.loginUser = async (req, res) => {
  const user = req.user;
  const token = jwt.sign(user, secret_key);
  const expirationTime = Date.now() + 3600000;
  
  res
      .cookie('jwt', token, {
          expires: new Date(expirationTime),
          httpOnly: true,
      })
      .status(200)
      .json({ id: user.id, role: user.role, token });
};


exports.checkAuth = async (req, res) => {
  if (req.user) {
      res.json(req.user);
  } else {
      res.sendStatus(401);
  }
};


exports.logout = async (req, res) => {
  res.cookie('jwt', '', {
      expires: new Date(Date.now()),
      httpOnly: true,
  }).sendStatus(200);
};


exports.resetPasswordRequest = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ where: { email: email } });
  if (user) {
      const token = crypto.randomBytes(48).toString('hex');
      user.resetPasswordToken = token;
      await user.save();
      const link =
          'https://ecommerce-backend-lyart.vercel.app/reset-password?token=' +
          token +
          '&email=' +
          email;
      const subject = 'Reset Password for e-commerce';
      const html = `<p> <a href='${link}'>Click here</a> to reset your Password</p>`;
      if (email) {
          // Adjust the sendMail function to handle email sending
          const response = await sendMail({ to: email, subject, html });
          res.json(response);
      } else {
          res.sendStatus(400);
      }
  } else {
      res.sendStatus(400);
  }
};


exports.resetPassword = async (req, res) => {
  const { email, token, password } = req.body;
  const user = await User.findOne({ where: { email: email, resetPasswordToken: token } });
  if (user) {
      const salt = crypto.randomBytes(16);
      crypto.pbkdf2(
          password,
          salt,
          310000,
          32,
          'sha256',
          async function (err, hashedPassword) {
              user.password = hashedPassword;
              user.resetPasswordToken = '';
              user.salt = salt;
              await user.save();
              const subject = 'Password Successfully reset for e-commerce';
              const html = `<p> Successfully able to reset your Password</p>`;
              if (email) {
                  // Adjust the sendMail function to handle email sending
                  const response = await sendMail({ to: email, subject, html });
                  res.json(response);
              } else {
                  res.sendStatus(400);
              }
          }
      );
  } else {
      res.sendStatus(400);
  }
};



