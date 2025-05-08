const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { supabase } = require('../utils/supabaseClient');

// Handle PayPal Connect callback
router.get('/connect/callback', async (req, res) => {
  try {
    // Extract code and state from query parameters
    const { code, state } = req.query;
    
    if (!code) {
      throw new Error('Authorization code not provided by PayPal');
    }
    
    // Parse the state parameter
    const { userId, returnUrl } = JSON.parse(decodeURIComponent(state));
    
    if (!userId) {
      throw new Error('User ID not provided in state parameter');
    }
    
    // Exchange the authorization code for tokens
    const tokenResponse = await exchangeCodeForTokens(code);
    
    if (!tokenResponse.access_token) {
      throw new Error('Failed to obtain access token from PayPal');
    }
    
    // Get PayPal user info
    const userInfo = await getPayPalUserInfo(tokenResponse.access_token);
    
    if (!userInfo.email) {
      throw new Error('Failed to obtain user email from PayPal');
    }
    
    // Check if this PayPal account is already connected
    const { data: existingMethods } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'paypal')
      .eq('details->>email', userInfo.email);
    
    if (existingMethods && existingMethods.length > 0) {
      // PayPal account already exists, redirect back with success message
      return res.redirect(`${returnUrl}?success=paypal_already_connected`);
    }
    
    // Get count of existing payment methods to determine if this should be default
    const { data: methodCount } = await supabase
      .from('payment_methods')
      .select('id', { count: 'exact' })
      .eq('user_id', userId);
    
    const isDefault = !methodCount || methodCount.length === 0;
    
    // Add the new PayPal account to the database
    const { error } = await supabase
      .from('payment_methods')
      .insert({
        user_id: userId,
        type: 'paypal',
        is_default: isDefault,
        details: {
          email: userInfo.email,
          paypal_user_id: userInfo.user_id || userInfo.sub
        }
      });
    
    if (error) {
      throw error;
    }
    
    // Redirect back to the app with success message
    res.redirect(`${returnUrl}?success=paypal_connected`);
  } catch (error) {
    console.error('Error handling PayPal connect callback:', error);
    const errorMessage = encodeURIComponent(error.message || 'connection_failed');
    res.redirect(`${req.query.returnUrl || '/dashboard/billing'}?error=${errorMessage}`);
  }
});

// Helper function to exchange authorization code for tokens
async function exchangeCodeForTokens(code) {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const redirectUri = `${process.env.API_URL}/api/paypal/connect/callback`;
  
  const response = await fetch('https://api.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri
    }).toString()
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`PayPal token exchange failed: ${error.error_description || error.message || 'Unknown error'}`);
  }
  
  return response.json();
}

// Helper function to get PayPal user info
async function getPayPalUserInfo(accessToken) {
  const response = await fetch('https://api.paypal.com/v1/identity/openidconnect/userinfo?schema=openid', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to get PayPal user info: ${error.error_description || error.message || 'Unknown error'}`);
  }
  
  return response.json();
}

module.exports = router; 