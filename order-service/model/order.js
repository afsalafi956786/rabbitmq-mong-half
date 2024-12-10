const mongosoe = require('mongoose');

const orderSchema = new mongosoe.Schema({ 
   products:[
    {product_id:String}
   ],

    total:{
        type:Number,
        required:true
    },
    purchasedAt:{
        type: Date, // Use Date for better date handling
        default: Date.now,
    }
},{
    timestamps:true
})

const orderModel = mongosoe.model('order',orderSchema);
module.exports = orderModel;