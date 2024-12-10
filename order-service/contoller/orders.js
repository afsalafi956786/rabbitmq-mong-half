
const { getChannel }  = require('../routes/orderRouter');
const ORDER = require('../model/order')




exports.createOrder = async (products)=>{
    try{

        let total = 0;
        products.forEach((ele)=>{
            total += ele.price;
        })

        const order = await new ORDER({
            products,
            total,
            purchasedAt
        })

        await order.save();
        return order;
      
    }catch(error){
        console.log(error.message)
    }
}