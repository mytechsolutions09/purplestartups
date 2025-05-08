/**
 * Creates a BroadcastChannel for cross-tab communication
 */
export function createBroadcastChannel(channelName: string) {
  // Check if BroadcastChannel is supported in the browser
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      return new BroadcastChannel(channelName);
    } catch (error) {
      console.error('Error creating BroadcastChannel:', error);
      // Return a mock channel that won't throw errors on postMessage
      return {
        postMessage: (message: any) => {
          console.log('Mock channel - message not sent:', message);
        },
        close: () => {},
        addEventListener: () => {},
        removeEventListener: () => {}
      };
    }
  }
  
  // Fallback for browsers without BroadcastChannel support
  return {
    postMessage: (message: any) => {
      console.log('BroadcastChannel not supported - message not sent:', message);
    },
    close: () => {},
    addEventListener: () => {},
    removeEventListener: () => {}
  };
}