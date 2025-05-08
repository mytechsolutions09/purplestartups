// New API endpoint to activate the free plan
router.post('/activate-free', async (req, res) => {
  const { userId } = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  
  try {
    // In a real app, you would store this in your database
    // Example with Supabase:
    /*
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_id: 'free',
        plan_name: 'Basic Plan',
        status: 'active',
        price: 0,
        currency: 'USD',
        start_date: new Date(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        generations_remaining: 2 // Start with 2 generations
      });
      
    if (error) throw error;
    */
    
    // Return success response
    return res.json({
      success: true,
      message: 'Free plan activated successfully'
    });
    
  } catch (error) {
    console.error('Error activating free plan:', error);
    return res.status(500).json({ error: 'Failed to activate free plan' });
  }
}); 