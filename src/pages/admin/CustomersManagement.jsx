import { useState } from 'react';
import { getCustomers } from '../../services/dataStore';
import { Users } from 'lucide-react';
import { motion } from 'framer-motion';

const CustomersManagement = () => {
  const [customers] = useState(() => getCustomers());

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Users size={26} className="text-brand-gold" />
        <div>
          <h2 className="text-3xl font-serif text-brand-cream">Customers</h2>
          <p className="text-brand-cream/60">Review customer order history and contact details from the last saved orders.</p>
        </div>
      </div>

      <div className="bg-brand-matte border border-white/10 rounded-3xl overflow-hidden">
        <div className="grid grid-cols-3 gap-6 p-6 border-b border-white/10 text-brand-cream/60 text-sm uppercase tracking-[0.2em]">
          <div>Name</div>
          <div>Email / Phone</div>
          <div className="text-right">Orders</div>
        </div>
        <div className="divide-y divide-white/10">
          {customers.length === 0 ? (
            <div className="p-6 text-center text-brand-cream/60">No customer records available yet.</div>
          ) : (
            customers.map((customer, index) => (
              <motion.div 
                key={`${customer.email}-${customer.phone}`} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="grid grid-cols-3 gap-6 p-6 hover:bg-white/5 transition-colors"
              >
                <div>
                  <p className="font-semibold text-brand-cream">{customer.name || 'Guest'}</p>
                  <p className="text-brand-cream/60 text-sm">Last order: {new Date(customer.lastOrder).toLocaleDateString()}</p>
                </div>
                <div className="text-brand-cream/80 text-sm">
                  {customer.email || customer.phone || 'N/A'}
                </div>
                <div className="text-right font-semibold text-brand-gold">{customer.totalOrders}</div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomersManagement;
