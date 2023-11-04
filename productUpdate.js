const { Product } = require("./model/Product");

let update =  async ()=>{const products = await Product.find({});
for(let product of products){
    product.discountedPrice = Math.round(product.price*(1-product.discountPercentage/100));
    await product.save();
    console.log(product.title +' updated');
}}

update();