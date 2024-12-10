const express = require('express');
const amqp = require('amqplib');
const orderContoller = require('../contoller/orders')
const router = express.Router();





let connection, channel;

// Establish RabbitMQ connection
async function connectToRabbitMQ() {
    try {
        const amqpServer = 'amqp://guest:guest@localhost:5672';
        connection = await amqp.connect(amqpServer);
        channel = await connection.createChannel();
        await channel.assertQueue('order-service-queue');
        console.log('RabbitMQ connected for order-service');
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error.message);
    }
}

// Wait for RabbitMQ connection before setting up routes
connectToRabbitMQ().then(() => {
    // Consume messages from the product-service queue
    channel.consume('order-service-queue', async (data) => {
        console.log('Message received in order-service!');
        const { products } = JSON.parse(data);
        
        // Handle order creation
       const newOrder =  await orderContoller.createOrder(products);

        // Acknowledge the message
        channel.ack(data);
        channel.sendToQueue('product-service-queue',Buffer.from(JSON.stringify(newOrder)))

        return res.status(200).json({ message:'Order created Succssfully',newOrder})

    }, { noAck: false });
}).catch(console.error);


module.exports = {  router };


