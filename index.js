const express = require("express");
const server = express();
const crypto = require("crypto");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const cookieParser = require('cookie-parser')
const jwt = require("jsonwebtoken");
const ProductsRouter = require("./routes/Product");
const categoryRouter = require("./routes/Category");
const brandsRouter = require("./routes/Brands");
const userRouter = require("./routes/User");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const orderReducer = require("./routes/Order");
const cors = require("cors");
const  User  = require("./model/User");
const { isAuth, sanitizeUser, cookieExtractor } = require("./services/common");
const dotenv = require("dotenv");
const path = require('path');
const { Order } = require("./model/Order");
const sequelize = require("./sequelizeConnection");

dotenv.config();
// connectToMongo();
 const conn = async()=> {await sequelize.authenticate();
console.log('connected');}
conn()
const port = process.env.PORT;
const secret_key = process.env.JWT_SECRET;
const stripe_key = process.env.STRIPE_KEY

const stripe = require("stripe")(stripe_key);

//webhook
const endpointSecret = process.env.ENDPOINT_SECRET
server.post('/webhook', express.raw({type: 'application/json'}),async (request, response) => {
    const sig = request.headers['stripe-signature'];
  
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntentSucceeded = event.data.object;
        const order = await Order.findById(paymentIntentSucceeded.metadata.orderId);
        order.paymentStatus = 'received';
        await order.save();
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  });


opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = secret_key;

//Middlewares
// server.use(express.static(path.resolve(__dirname,'build')))
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // or replace '*' with your specific frontend origin
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
server.use(cookieParser())
server.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    // store: new SQLiteStore({ db: "sessions.db", dir: "./var/db" }),
    cookie:{
      sameSite:'none',
      secure: true
    }
  })
);
server.use(passport.authenticate("session"));
server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
    origin: 'http://localhost:3000', 
    credentials: true,
  })
);
server.use(express.json()); //to parse req.body
server.use("/products",isAuth(), ProductsRouter.router);
server.use("/category", isAuth(), categoryRouter.router);
server.use("/brands", isAuth(), brandsRouter.router);
server.use("/users",isAuth(), userRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart", isAuth(), cartRouter.router);
server.use("/orders", isAuth(), orderReducer.router);

// server.use("/category", categoryRouter.router);
// server.use("/brands", brandsRouter.router);
// server.use("/users", userRouter.router);
// server.use("/auth", authRouter.router);
// server.use("/cart", cartRouter.router);
// server.use("/orders", orderReducer.router);

//if no path is matched
server.get('*',(req,res)=>
res.sendFile(path.resolve('build','index.html'))
);

//Passport Strategies
passport.use(
  "local",
  new LocalStrategy({usernameField:'email'},async function (email, password, done) {
    try {
      const user = await User.findOne({where:{ email: email }});
      if (!user) {
        done(null, false, { message: "invalid credentials" });
      } else
        crypto.pbkdf2(
          password,
          user.salt,
          310000,
          32,
          "sha256",
          async function (err, hashedPassword) {
            if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
              done(null, false, { message: "invalid credentials" });
            } else {
              const token = jwt.sign(sanitizeUser(user), secret_key);

              done(null, {id:user.id,role:user.role,token});
            }
          }
        );
    } catch (err) {
      done(err);
    }
  })
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findByPk(jwt_payload.id );
      console.log("hi");
      if (user) {
        return done(null, sanitizeUser(user)); //this calls serializer
      } else {
        return done(null, false);
      }
    } catch (error) {
      if (error) {
        return done(error, false);
      }
    }
  })
);

// this create session variable req.user on bbeing called
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});
// this changes session variable req.user on bbeing called from authorized request
passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {id:user.id,role:user.role});
  });
});


//payment intent

// This is your test secret API key.


server.post("/create-payment-intent", async (req, res) => {
  const { totalAmount,orderId } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount*100,
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
    metadata:{
        orderId,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});



server.listen(port, () => {
  console.log(`listnening at http://localhost:${port}`);
});

sequelize.sync()
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((error) => {
    console.error('Error synchronizing database:', error);
  });




