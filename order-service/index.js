const express = require('express');
const mongoose = require('mongoose');
const { router  } = require('./routes/orderRouter')
const app = express();


const port = 3000;

app.use(express.json());
app.use('/order',router)



try {
    mongoose.connect('mongodb://127.0.0.1:27017/ordder-service')
        .then(() => console.log('order-service database connected successfully'))
        .catch((error) => console.log('Error connecting to database:', error.message));
} catch (error) {
    console.log('Error in mongoose connection setup:', error.message);
}




app.listen(port,()=>{
    console.log(`order-server connected the port ${port}`)
})