import React, { useEffect, useState } from 'react';

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders logic
    setOrders([
      { id: 1, customer: 'John Doe', total: 500, status: 'Pending' },
      { id: 2, customer: 'Jane Smith', total: 1200, status: 'Completed' },
    ]);
  }, []);

  return (
    <div className="view-orders">
      <h1>View Orders</h1>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.total}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewOrders;