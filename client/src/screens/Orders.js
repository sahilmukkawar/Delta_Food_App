import React, { useEffect, useState } from 'react';
import './Orders.css';
import { API_BASE_URL } from '../config';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/custorderdata`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ custEmail: "all" }) // Send "all" to get all orders
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched orders:', data); // Debug log
      setOrders(data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error loading orders:", err);
      setError("Failed to load orders. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatPrice = (price) => {
    return typeof price === 'number' ? price :
      typeof price === 'object' && price.$numberInt ? parseInt(price.$numberInt) : 0;
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <div className="orders-container">
      <h2 className="orders-title">All Customer Orders</h2>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Email</th>
              <th>Order Date</th>
              <th>Total Price</th>
              <th>Order Details</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="loading-spinner">
                  <div className="spinner"></div>
                  <p>Loading orders...</p>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-orders">
                  <p>No orders found</p>
                  <small>Please check back later.</small>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="order-row">
                  <td className="order-number">{order._id}</td>
                  <td className="order-email">{order.email}</td>
                  <td className="order-date">{formatDate(order.date)}</td>
                  <td className="order-price">₹{formatPrice(order.price)}</td>
                  <td>
                    <div className="order-items">
                      {order.order_data && order.order_data.map((item, index) => (
                        <div key={index} className="order-item">
                          {item.name} {item.size && `(${item.size})`} × {formatPrice(item.qty)}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
