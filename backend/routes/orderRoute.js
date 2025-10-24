// import express from 'express';
// import { trackOrder } from '../controllers/orderController.js';

// const orderRouter = express.Router();

// // Route to track order by ID
// orderRouter.get('/track/:orderId', trackOrder);

// export default orderRouter;

import express from 'express'

import {placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

orderRouter.post('/list',adminAuth,allOrders) 
orderRouter.post('/status',adminAuth,updateStatus) 

orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/stripe',authUser,placeOrderStripe)
orderRouter.post('/razorpay',authUser,placeOrderRazorpay)

orderRouter.post('/userorders',authUser,userOrders)

export default orderRouter