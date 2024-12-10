const mongosoe = require('mongoose');




const productSchema = new mongosoe.Schema({ 
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    }
},{
    timestamps:true
})

const productModel = mongosoe.model('product',productSchema);
module.exports = productModel;