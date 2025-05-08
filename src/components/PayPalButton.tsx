import React, { useEffect, useRef, useState } from 'react';

interface PayPalButtonProps {
  planId: string;
  amount: number;
  onSuccess: (details: any) => void;
  onError: (error: any) => void;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ planId, amount, onSuccess, onError }) => {
  const paypalButtonRef = useRef<HTMLDivElement>(null);
  const [sdkReady, setSdkReady] = useState(false);
  
  // This ensures we know when the PayPal SDK is fully loaded
  useEffect(() => {
    const checkPayPalSDKLoaded = () => {
      if (window.paypal) {
        setSdkReady(true);
      } else {
        setTimeout(checkPayPalSDKLoaded, 100);
      }
    };
    
    checkPayPalSDKLoaded();
    
    return () => {
      // Clean up if needed
    };
  }, []);
  
  // This effect creates the PayPal button once the SDK is loaded
  useEffect(() => {
    if (!sdkReady || !paypalButtonRef.current) return;
    
    try {
      // Clear any existing buttons
      paypalButtonRef.current.innerHTML = '';
      
      // Get the correct price based on the plan ID
      let price = 19.99; // Default to Pro plan
      if (planId === 'enterprise') {
        price = 49.99;
      } else if (planId === 'free') {
        price = 0;
      }
      
      // Check if Buttons function exists before trying to use it
      if (window.paypal && typeof window.paypal.Buttons === 'function') {
        window.paypal.Buttons({
          style: {
            shape: 'rect',
            color: 'blue',
            layout: 'vertical',
            label: 'paypal'
          },
          
          createOrder: function(data, actions) {
            console.log("Creating order for plan:", planId, "amount:", amount/100);
            
            return actions.order.create({
              intent: 'CAPTURE',
              purchase_units: [{
                description: `PurpleStartups ${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan`,
                amount: {
                  value: (amount/100).toFixed(2),
                  currency_code: 'USD'
                }
              }]
            });
          },
          
          onApprove: async function(data, actions) {
            console.log("Payment approved, capturing order:", data.orderID);
            try {
              const details = await actions.order.capture();
              console.log('Payment capture successful', details);
              onSuccess(details);
            } catch (error) {
              console.error('Error capturing order:', error);
              onError(error);
            }
          },
          
          onError: function(err) {
            console.error('PayPal Error:', err);
            onError(err);
          },
          
          onCancel: function() {
            console.log('Payment canceled');
          }
        }).render(paypalButtonRef.current);
      } else {
        console.error('PayPal Buttons function is not available');
        onError(new Error('PayPal SDK is not initialized correctly'));
      }
    } catch (error) {
      console.error('Error rendering PayPal button:', error);
      onError(error);
    }
  }, [sdkReady, planId, amount, onSuccess, onError]);
  
  return (
    <div className="paypal-button-container">
      {!sdkReady && (
        <div className="text-center py-4">
          <div className="animate-pulse flex space-x-4 items-center justify-center">
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
            <div className="h-4 w-12 bg-gray-300 rounded"></div>
          </div>
          <p className="mt-2 text-sm text-gray-500">Loading payment options...</p>
        </div>
      )}
      <div ref={paypalButtonRef}></div>
    </div>
  );
};

// Add type definition for PayPal SDK
declare global {
  interface Window {
    paypal: any;
  }
}

export default PayPalButton; 