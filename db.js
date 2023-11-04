const  mongoose = require("mongoose");

const dotenv = require('dotenv')
dotenv.config();

const mongouri = process.env.MONGODB_URI;
const connectToMongo = ()=>{mongoose.connect(mongouri,{
    useNewUrlParser : true
}).then(()=>{console.log("Connected to dataBase");})
.catch(e=>{console.log(e);})}

module.exports = connectToMongo;
