const express = require('express');
const amqp = require('amqplib');
const PRODUCT = require('../model/product')
const router = express.Router();




//first establish the rabbit mq connnection

let connnection,channel ,order ;

async function connectToRabbitMQ(){         //default port 56724
    try {
     const amqpServer = 'amqp://guest:guest@localhost:5672';
     connnection = await amqp.connect(amqpServer);
     channel = await connnection.createChannel();
    await channel.assertQueue('product-service-queue')
    console.log('RabbitMQ connected and channel created');

} catch (error) {
    console.error('Error connecting to RabbitMQ:', error.message);
}
   }

   connectToRabbitMQ();

   // Route to create a product
router.post('/create-product', async (req, res) => {
    try {
      const { name, price, quantity } = req.body;
      
      if (!name || !price || !quantity) {
        return res.status(400).json({ message: 'Please provide product details' });
      }
  
      // Save product to the database (e.g., MongoDB)
      const product = await PRODUCT.create({ name, price, quantity });
  
      return res.status(200).json({ message: 'Product created', product });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  });



// Route to buy products, interacting with RabbitMQ
router.post('/buy', async (req, res) => {
    try {
      const { productIds } = req.body;
  
      if (!productIds || productIds.length === 0) {
        return res.status(400).json({ message: 'Please provide product IDs to buy' });
      }
  
  
      // Get the product data (for example, from MongoDB)
      const products = await PRODUCT.find({ _id: { $in: productIds } });
  
      if (!products || products.length === 0) {
        return res.status(404).json({ message: 'Product not found!' });
      }
      console.log(products,'product wokring')
  
      // Send the products to the 'order-service-queue' via RabbitMQ
      channel.sendToQueue('order-service-queue', Buffer.from(JSON.stringify({ products })));
      console.log('done send queue')
  
      // Consume the message from 'product-service-queue' to process the order
      channel.consume('product-service-queue', (data) => {
        console.log('Consumed from product-service-queue');
         order = JSON.parse(data.content.toString());
  
        // Acknowledge the message
        channel.ack(data);
  
        // Send the response back to the client
      }, { noAck: false });
      res.status(200).json({ message: 'Order placed successfully', order });
  
    } catch (error) {
      console.log('Error in buyProducts:', error.message);
      
      res.status(500).json({ message: 'Internal server error' });
    }
  });





module.exports = router;
