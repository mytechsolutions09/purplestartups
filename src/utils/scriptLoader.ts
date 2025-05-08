/**
 * Dynamically loads an external script
 * @param src URL of the script to load
 * @returns Promise that resolves when the script is loaded
 */
export function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if script already exists
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = (error) => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

/**
 * Loads the PayPal SDK
 */
export function loadPayPalSDK(): Promise<void> {
  // Update with your new client ID (but NOT the secret)
  const clientId = 'AVnZ79yRUYBbYIvLmvi73KaWJgjwXH-lSnekJrwK37M9XhxMeKU7uGdvBUG50fq9pFDq3avOXIfvvZEr';
  return loadScript(
    `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture&components=buttons`
  );
} 