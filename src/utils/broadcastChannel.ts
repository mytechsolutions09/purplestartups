/**
 * Creates a BroadcastChannel for cross-tab communication
 */
export function createBroadcastChannel(channelName: string) {
  // Only use the native BroadcastChannel API
  return new BroadcastChannel(channelName);
}