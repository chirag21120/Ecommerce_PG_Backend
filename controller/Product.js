const {Product} = require("../model/Product")

exports.createProduct = async(req,res)=>{
    const {id} = req.user;
    const product = new Product({...req.body,admin:id});
    try{
    const response = await product.save();
    res.status(201).json(response);
    } catch(err){
        res.status(400).json(err)
    }
}

exports.fetchAllProduct = async(req,res)=>{

    let query = Product.find({deleted:{$ne:true}});
    let totalProductsQuery = Product.find({deleted:{$ne:true}});
    if(req.query.category){
      query=   query.find({category:{$in:req.query.category.split(',')}})
      totalProductsQuery=   totalProductsQuery.find({category:{$in:req.query.category.split(',')}})
    }
    if(req.query.brands ){
      query=   query.find({brand:{$in:req.query.brands.split(',')}})
      totalProductsQuery=  totalProductsQuery.find({brand:{$in:req.query.brands.split(',')}})
    }
    if(req.query._sort && req.query._order){
       query=  query.sort({[req.query._sort]:req.query._order})
       totalProductsQuery=  totalProductsQuery.sort({[req.query._sort]:req.query._order})
    }
    const totalDocs = await totalProductsQuery.count().exec();
    if(req.query._page && req.query._limit ){
        const pageSize = req.query._limit;
        const page = req.query._page;
        query=  query.skip(pageSize*(page-1)).limit(pageSize);
      }
    try{
    const response = await query.exec();
    res.set('X-Total-Count',totalDocs);
    res.status(200).json(response);
    } catch(err){
        res.status(400).json(err)
    }
}

exports.fetchProductById = async(req,res)=>{
    const {id} = req.params;
    try{
        const product = await Product.findById(id);
        res.status(200).json(product);
        } catch(err){
            res.status(400).json(err)
        }
    
}

exports.updateProduct = async(req,res)=>{
    const {id} = req.params;
    try{
        const product = await Product.findByIdAndUpdate(id,req.body,{new:true});
        res.status(200).json(product);
        } catch(err){
            res.status(400).json(err)
        }
    
}

exports.fetchAdminProducts = async(req,res)=>{
    let {id} = req.user
    let query = Product.find({admin:id});
    let totalProductsQuery = Product.find({admin:id})
    if(req.query.category){
      query=   query.find({category:{$in:req.query.category.split(',')}})
      totalProductsQuery=   totalProductsQuery.find({category:{$in:req.query.category.split(',')}})
    }
    if(req.query.brands ){
      query=   query.find({brand:{$in:req.query.brands.split(',')}})
      totalProductsQuery=  totalProductsQuery.find({brand:{$in:req.query.brands.split(',')}})
    }
    if(req.query._sort && req.query._order){
       query=  query.sort({[req.query._sort]:req.query._order})
       totalProductsQuery=  totalProductsQuery.sort({[req.query._sort]:req.query._order})
    }
    const totalDocs = await totalProductsQuery.count().exec();
    if(req.query._page && req.query._limit ){
        const pageSize = req.query._limit;
        const page = req.query._page;
        query=  query.skip(pageSize*(page-1)).limit(pageSize);
      }
    try{
    const response = await query.exec();
    res.set('X-Total-Count',totalDocs);
    res.status(200).json(response);
    } catch(err){
        res.status(400).json(err)
    }
}