// Make sure the PayPal routes are registered
const paypalRoutes = require('./routes/paypal');
app.use('/api/paypal', paypalRoutes);

// Also register the subscriptions routes if they're not already
const subscriptionRoutes = require('./routes/subscriptions');
app.use('/api/subscriptions', subscriptionRoutes); 