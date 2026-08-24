import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus, deleteOrder } from '../../services/dataStore';
import { motion } from 'framer-motion';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const savedOrders = await getOrders();
        setOrders(Array.isArray(savedOrders) ? [...savedOrders].reverse() : []);
      } catch {
        setOrders([]);
      }
    };
    loadOrders();
  }, []);

  const refreshOrders = async () => {
    try {
      const savedOrders = await getOrders();
      setOrders(Array.isArray(savedOrders) ? [...savedOrders].reverse() : []);
    } catch {
      setOrders([]);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateOrderStatus(id, newStatus);
    await refreshOrders();
  };

  const handlePaymentChange = async (id, newPaymentStatus) => {
    await updateOrderStatus(id, null, newPaymentStatus);
    await refreshOrders();
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm('Delete this order permanently?')) {
      // Optimistically remove from UI immediately
      setOrders((prev) => prev.filter((o) => o.id !== id));
      try {
        await deleteOrder(id);
        // Re-fetch from backend to confirm server state
        await refreshOrders();
      } catch (error) {
        // Restore orders list from backend on failure
        await refreshOrders();
        alert('Failed to delete order: ' + (error?.message || 'Server error. Please try again.'));
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-serif text-brand-cream mb-6">Manage Orders</h2>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <p className="text-brand-cream/50 text-center py-10">No orders found.</p>
        ) : (
          orders.map((order, index) => (
            <motion.div 
              key={order.id} 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-brand-matte border border-white/10 rounded-xl p-6 hover:border-brand-gold/20 transition-colors"
            >
              
              <div className="flex flex-wrap justify-between items-start mb-6 pb-6 border-b border-white/5 gap-4">
                <div>
                  <h3 className="font-bold text-brand-gold text-lg">{order.id}</h3>
                  <p className="text-sm text-brand-cream/50">{new Date(order.date).toLocaleString()}</p>
                </div>
                
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="bg-brand-black px-4 py-2 rounded-lg border border-white/10">
                    <span className="text-xs text-brand-cream/50 uppercase block mb-1">Order Status</span>
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="bg-transparent text-brand-cream text-sm font-bold focus:outline-none cursor-pointer"
                    >
                      <option className="bg-brand-black">Pending</option>
                      <option className="bg-brand-black">Confirmed</option>
                      <option className="bg-brand-black">Preparing</option>
                      <option className="bg-brand-black">Out for Delivery</option>
                      <option className="bg-brand-black">Delivered</option>
                      <option className="bg-brand-black">Cancelled</option>
                    </select>
                  </div>

                  <div className="bg-brand-black px-4 py-2 rounded-lg border border-white/10">
                    <span className="text-xs text-brand-cream/50 uppercase block mb-1">Payment: {order.paymentMethod || order.customer?.paymentMethod || 'COD'}</span>
                    <select 
                      value={order.paymentStatus || 'Pending'}
                      onChange={(e) => handlePaymentChange(order.id, e.target.value)}
                      className={`bg-transparent text-sm font-bold focus:outline-none cursor-pointer ${order.paymentStatus === 'Paid' ? 'text-green-400' : 'text-brand-red'}`}
                    >
                      <option className="bg-brand-black text-brand-cream">Pending</option>
                      <option className="bg-brand-black text-green-400">Paid</option>
                    </select>
                  </div>

                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteOrder(order.id)}
                    className="rounded-2xl px-4 py-2 text-xs font-semibold text-brand-red bg-brand-red/10 border border-brand-red/20 hover:bg-brand-red/20 transition-colors"
                  >
                    Delete Order
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Customer Details */}
                <div>
                  <h4 className="text-sm font-bold text-brand-cream/70 uppercase mb-3 border-b border-white/10 pb-2">Customer Info</h4>
                  <p className="text-brand-cream font-medium">{order.customer?.name || 'Customer'}</p>
                  <p className="text-brand-cream/70 text-sm">{order.customer?.email || 'N/A'}</p>
                  <p className="text-brand-cream/70 text-sm mb-3">{order.customer?.phone || 'N/A'}</p>
                  {order.paymentMethod === 'UPI' && (
                    <p className="text-brand-cream/70 text-sm mb-3">
                      <span className="text-brand-cream/50">UPI Transaction ID:</span>{' '}
                      {order.customer?.transactionId || 'Not provided'}
                    </p>
                  )}
                  
                  <p className="text-brand-cream/70 text-sm leading-relaxed">
                    {order.customer?.address || 'Address not available'}<br />
                    {order.customer?.city || 'City'}, {order.customer?.state || 'State'} - {order.customer?.pincode || 'PIN'}
                  </p>
                  
                  {order.customer?.notes && (
                    <div className="mt-4 p-3 bg-brand-gold/10 border border-brand-gold/20 rounded-lg">
                      <p className="text-xs text-brand-gold font-bold mb-1">Notes:</p>
                      <p className="text-sm text-brand-cream italic">"{order.customer.notes}"</p>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="text-sm font-bold text-brand-cream/70 uppercase mb-3 border-b border-white/10 pb-2">Order Items</h4>
                  <div className="space-y-4">
                    {(Array.isArray(order.items) ? order.items : []).map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-brand-black/50 p-2 rounded hover:bg-brand-black/70 transition-colors">
                        <div className="flex gap-3 items-center">
                          <img src={item.product?.image || ''} className="w-10 h-10 object-cover rounded" alt={item.product?.name || 'Item'} />
                          <div>
                            <p className="text-brand-cream text-sm font-medium">{item.product?.name || 'Item'}</p>
                            {item.product?.pricePerUnit ? (
                              <p className="text-brand-cream/50 text-xs">{item.product?.quantityType || 'Unit'} x {item.quantity || 1}</p>
                            ) : (
                              <p className="text-brand-cream/50 text-xs">{item.weightOption?.weight || 'Unit'} x {item.quantity || 1}</p>
                            )}
                          </div>
                        </div>
                        <p className="text-brand-gold font-bold text-sm">₹{(item.weightOption?.price || 0) * (item.quantity || 1)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                    <span className="text-brand-cream/70 font-bold">Total Amount:</span>
                    <span className="text-xl font-bold text-brand-gold">₹{order.totalAmount}</span>
                  </div>
                </div>
              </div>

            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageOrders;
