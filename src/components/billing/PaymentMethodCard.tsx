import React from 'react';
import { CreditCard, Trash2 } from 'lucide-react';

interface PaymentMethodCardProps {
  paymentMethod: {
    id: string;
    type: 'card' | 'paypal';
    last4?: string;
    expMonth?: number;
    expYear?: number;
    brand?: string;
    isDefault: boolean;
    email?: string; // For PayPal
  };
  onRemove: (id: string) => void;
  onSetDefault: (id: string) => void;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ 
  paymentMethod, 
  onRemove, 
  onSetDefault 
}) => {
  const { id, type, last4, expMonth, expYear, brand, isDefault, email } = paymentMethod;
  
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg mb-3">
      <div className="flex items-center">
        {type === 'card' ? (
          <>
            <div className="w-10 h-8 bg-gray-100 rounded flex items-center justify-center mr-3">
              <CreditCard className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="font-medium">
                {brand} ending in {last4}
              </p>
              <p className="text-sm text-gray-500">
                Expires {expMonth}/{expYear}
                {isDefault && <span className="ml-2 text-green-600">(Default)</span>}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="w-10 h-8 bg-blue-100 rounded flex items-center justify-center mr-3">
              <span className="text-blue-800 font-bold text-sm">PayPal</span>
            </div>
            <div>
              <p className="font-medium">PayPal</p>
              <p className="text-sm text-gray-500">
                {email}
                {isDefault && <span className="ml-2 text-green-600">(Default)</span>}
              </p>
            </div>
          </>
        )}
      </div>
      
      <div className="flex space-x-2">
        {!isDefault && (
          <button
            onClick={() => onSetDefault(id)}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            Set as default
          </button>
        )}
        <button
          onClick={() => onRemove(id)}
          className="text-sm text-red-600 hover:text-red-800"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PaymentMethodCard; 