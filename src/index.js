import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import UsersController from './modules/Users/users.controllers.js'; 
import ProductsController from './modules/Products/products.controllers.js'; 
import mongoose from 'mongoose';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection configuration
const dbURI = process.env.DATABASE_URI;

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

db.on('reconnected', () => {
  console.log('Mongo has reconnected')
})

db.on('disconnected', () => {
  console.log('Mongo connection is disconnected')
})


app.get('/', (req, res) => {
  res.status(200).send({ message: 'eolyz.coder' });
});

const userController = new UsersController();
const productController = new ProductsController();
app.use('/u', userController.router);
app.use('/p', productController.router);

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on port: ${server.address().port}`);
});

