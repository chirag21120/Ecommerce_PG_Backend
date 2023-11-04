const mongoose = require('mongoose');
const {Schema} = mongoose

const ProductSchema = new Schema({
    title: {type:String, required: true, unique: true},
    description: {type:String, required: true},
    price: {type:Number, required: true, min:[0,'wrong min price'], max:[1000000,'worng max price']},
    discountPercentage: {type:Number, required: true, min:[0,'wrong min discount'], max:[100,'worng max discount']},
    discountedPrice: {type:Number},
    rating: {type:Number, required: true, min:[0,'wrong min rating'], max:[5,'worng max rating']},
    stock: {type:Number, min:[0,'wrong min stock'],default:0},
    brand: {type:String,required: true},
    category :{type:String, required:true},
    thumbnail: {type: String, required: true},
    images: {type: [String],required:true},
    colors: {type:[Schema.Types.Mixed]},
    sizes:{type:[Schema.Types.Mixed]},
    highlights: {type: [String]},
    admin: {type:String, required:true},
    deleted: {type:Boolean, default:false},
})

const virtual = ProductSchema.virtual('id');
virtual.get(function(){
    return this._id;
})

ProductSchema.set('toJSON',{
    virtuals: true,
    versionKey: false,
    transform: function(doc,ret){delete ret._id}
})

exports.Product = mongoose.model('Product',ProductSchema)