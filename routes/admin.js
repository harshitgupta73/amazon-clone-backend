const express = require('express');
const { Product } = require('../models/product');
const admin = require('../middleware/admin_middleware');
const adminRouter = express.Router();

adminRouter.post('/admin/add-product',admin,async(req,res)=>{
    try{
        console.log("Request body:", req.body);
        const {name,description,category,price, images,quantity} = req.body;

        let product = new Product({
            name,
            description,
            images,
            quantity,
            price,
            category
        });
        product = await product.save();
        res.json(product);
        console.log(product);
    }catch(e){
        res.status(500).json({err : e.message});
    }
});

adminRouter.get('/admin/get-products',admin,async (req,res)=>{
    try{
        const products =await Product.find({});
        res.json(products);
    }catch(e){
        res.status(500).json({err : e.message});
    }
});

adminRouter.delete('/admin/delete-products',admin,async (req,res)=>{
    try{
        const {id}=req.body;
        let product = await Product.findByIdAndDelete(id);
        res.json(product);
    }catch(e){
        res.status(500).json({err : e.message});
    }
});

module.exports= adminRouter;

