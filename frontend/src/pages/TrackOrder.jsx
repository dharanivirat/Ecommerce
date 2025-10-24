import React, { useState } from 'react';
import axios from 'axios';
import { assets } from '../assets/assets';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackOrder = async () => {
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }

    setLoading(true);
    setError('');
    setOrderData(null);

    try {
      const response = await axios.get(`http://localhost:4000/api/track/${orderId}`);
      setOrderData(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setError('Order not found. Please check your order ID.');
      } else {
        setError('Failed to track order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'order confirmed':
        return 'bg-blue-500';
      case 'shipped':
        return 'bg-yellow-500';
      case 'out for delivery':
        return 'bg-orange-500';
      case 'delivered':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'order confirmed':
        return '✓';
      case 'shipped':
        return '🚚';
      case 'out for delivery':
        return '📦';
      case 'delivered':
        return '✅';
      default:
        return '⏳';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Track Your Order</h1>
          <p className="text-gray-600">Enter your order ID to get real-time updates</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter your order ID (e.g., 12345)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleTrackOrder}
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Tracking...' : 'Track Order'}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>

        {/* Order Tracking Results */}
        {orderData && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Order #{orderData.orderId}
              </h2>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(orderData.status)}`}>
                  {getStatusIcon(orderData.status)} {orderData.status}
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Timeline</h3>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                {orderData.timeline.map((step, index) => {
                  const isCompleted = index <= orderData.currentStep;
                  const isCurrent = index === orderData.currentStep;
                  
                  return (
                    <div key={index} className="relative flex items-start mb-6">
                      {/* Timeline dot */}
                      <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                        isCompleted ? getStatusColor(step) : 'bg-gray-300'
                      }`}>
                        {isCompleted ? getStatusIcon(step) : index + 1}
                      </div>
                      
                      {/* Timeline content */}
                      <div className="ml-4 flex-1">
                        <div className={`font-medium ${
                          isCurrent ? 'text-blue-600' : isCompleted ? 'text-gray-800' : 'text-gray-500'
                        }`}>
                          {step}
                        </div>
                        {isCurrent && (
                          <div className="text-sm text-blue-600 mt-1">
                            Current Status
                          </div>
                        )}
                        {isCompleted && !isCurrent && (
                          <div className="text-sm text-gray-500 mt-1">
                            Completed
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Order ID
                  </label>
                  <p className="text-gray-800">#{orderData.orderId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Current Status
                  </label>
                  <p className="text-gray-800">{orderData.status}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Progress
                  </label>
                  <p className="text-gray-800">
                    {orderData.currentStep + 1} of {orderData.timeline.length} steps completed
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Estimated Delivery
                  </label>
                  <p className="text-gray-800">
                    {orderData.status === 'Delivered' ? 'Delivered' : '2-3 business days'}
                  </p>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Need Help?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Contact Support</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Having issues with your order? Our support team is here to help.
                  </p>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Contact Support →
                  </button>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Order History</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    View all your previous orders and their status.
                  </p>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Orders →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sample Order IDs for Demo */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Demo Order IDs</h3>
          <p className="text-blue-700 mb-4">
            Try these sample order IDs to see the tracking in action:
          </p>
          <div className="flex flex-wrap gap-2">
            {['123', '456', '789', '101'].map((id) => (
              <button
                key={id}
                onClick={() => setOrderId(id)}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
              >
                Order #{id}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
