const express = require('express');
const app = express();

const mongoose = require('mongoose');
const productRouter  = require('./routes/productRoute')

const port = 2000;




app.use(express.json());
app.use('/products',productRouter)


try {
    mongoose.connect('mongodb://127.0.0.1:27017/product-service')
        .then(() => console.log('product-service database connected successfully'))
        .catch((error) => console.log('Error connecting to database:', error.message));
} catch (error) {
    console.log('Error in mongoose connection setup:', error.message);
}



app.listen(port,()=>{
    console.log(`server connected the port ${port}`)
})