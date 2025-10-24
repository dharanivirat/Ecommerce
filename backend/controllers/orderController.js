// // Mock order tracking data - In a real application, this would come from a database
// const mockOrders = {
//   '123': {
//     orderId: 123,
//     status: 'Out for Delivery',
//     timeline: ['Order Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'],
//     currentStep: 2,
//     estimatedDelivery: '2024-01-15',
//     trackingNumber: 'TRK123456789'
//   },
//   '456': {
//     orderId: 456,
//     status: 'Delivered',
//     timeline: ['Order Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'],
//     currentStep: 3,
//     estimatedDelivery: '2024-01-10',
//     trackingNumber: 'TRK987654321'
//   },
//   '789': {
//     orderId: 789,
//     status: 'Shipped',
//     timeline: ['Order Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'],
//     currentStep: 1,
//     estimatedDelivery: '2024-01-18',
//     trackingNumber: 'TRK456789123'
//   },
//   '101': {
//     orderId: 101,
//     status: 'Order Confirmed',
//     timeline: ['Order Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'],
//     currentStep: 0,
//     estimatedDelivery: '2024-01-20',
//     trackingNumber: 'TRK789123456'
//   }
// };

// // Function to track order by ID
// const trackOrder = async (req, res) => {
//     try {
//         const { orderId } = req.params;
        
//         // Check if order exists in mock data
//         if (!mockOrders[orderId]) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Order not found'
//             });
//         }

//         const orderData = mockOrders[orderId];
        
//         res.json({
//             success: true,
//             ...orderData
//         });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error'
//         });
//     }
// };

// export { trackOrder };

import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"

const placeOrder = async (req, res) =>{

  try {
      const { userId, items, amount, address} = req.body 
      
      const orderData = {
        userId,
        items,
        address,
        amount,
        paymentMethod:"COD",
        payment:false,
        date: Date.now()
      }

      const newOrder = new orderModel(orderData)
      await newOrder.save()

      await userModel.findByIdAndUpdate(userId,{cartData:{}})
      res.json({success:true,message:"Order Placed"})

  } catch (error) {
      console.log(error)
      res.json({success:false,message:error.message})
      
  }

}


const placeOrderStripe = async (req, res) =>{
  
}

const placeOrderRazorpay = async (req, res) =>{
  
}

const allOrders = async (req,res) =>{
  
  try {
    const orders = await orderModel.find({})
    res.json({success:true,orders})
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }

}

const userOrders = async (req,res) =>{
    try {
        const {userId} = req.body
        const orders = await orderModel.find({userId})
        res.json({success:true,orders})
    } catch (error) {
      console.log(error)
      res.json({success:false,message:error.message})
    }
}


const updateStatus = async (req,res) =>{
  
  try {
    const {orderId, status} = req.body
    await orderModel.findByIdAndUpdate(orderId, {status})
    res.json({success:true,message:'Status Updated'})

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }

}

export {placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus}










