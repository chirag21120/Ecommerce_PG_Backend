// const  mongoose = require("mongoose");

// const dotenv = require('dotenv')
// dotenv.config();

// const mongouri = process.env.MONGODB_URI;
// const connectToMongo = ()=>{mongoose.connect(mongouri,{
//     useNewUrlParser : true
// }).then(()=>{console.log("Connected to dataBase");})
// .catch(e=>{console.log(e);})}

// module.exports = connectToMongo;


const {Client} = require('pg');

const client = new Client({
    host:"localhost",
    user:"postgres",
    port: 5432,
    password:"root",
    database: "ecommerce"
})

client.connect(function(err){
    if(err) console.error(err);
    console.log("Connected!");
})

// client.query('Select * from customer',(err,res)=>{
//     if(!err)
//         console.log(res.rows);
//     else
//         console.log(err.message);
//     client.end;
// })