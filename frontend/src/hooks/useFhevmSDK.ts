import { useState, useEffect } from 'react';

// Declare the relayerSDK property on window
declare global {
  interface Window {
    relayerSDK?: any;
  }
}

export interface FhevmSDK {
  initSDK: () => Promise<void>;
  createInstance: (config: any) => Promise<any>;
  SepoliaConfig: any;
}

export const useFhevmSDK = () => {
  const [sdk, setSdk] = useState<FhevmSDK | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSDK = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Wait for the relayer SDK to be loaded from CDN
        let attempts = 0;
        const maxAttempts = 30;
        while (!window.relayerSDK && attempts < maxAttempts) {
          console.log(`Waiting for relayer SDK to load... attempt ${attempts + 1}/${maxAttempts}`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          attempts++;
        }

        // Check if the relayer SDK is loaded
        if (!window.relayerSDK) {
          throw new Error('Relayer SDK not loaded. Please refresh the page.');
        }

        // Wait for WebAssembly modules to be fully loaded
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Check if SDK functions are available
        if (!window.relayerSDK.initSDK) {
          throw new Error('initSDK function not available on relayerSDK');
        }

        if (!window.relayerSDK.createInstance) {
          throw new Error('createInstance function not available on relayerSDK');
        }

        // Create a safe wrapper for the SDK
        const safeSDK: FhevmSDK = {
          initSDK: async () => {
            if (!window.relayerSDK?.initSDK) {
              throw new Error('Relayer SDK not loaded. Please ensure the CDN script is loaded before using FHE features.');
            }
            return window.relayerSDK.initSDK();
          },
          createInstance: async (config: any) => {
            if (!window.relayerSDK?.createInstance) {
              throw new Error('Relayer SDK not loaded. Please ensure the CDN script is loaded before using FHE features.');
            }
            return window.relayerSDK.createInstance(config);
          },
          SepoliaConfig: window.relayerSDK.SepoliaConfig || {}
        };

        setSdk(safeSDK);
        console.log('FHEVM SDK loaded and ready');
      } catch (err) {
        console.error('Failed to load FHEVM SDK:', err);
        setError(err instanceof Error ? err.message : 'Failed to load FHEVM SDK');
      } finally {
        setIsLoading(false);
      }
    };

    loadSDK();
  }, []);

  return { sdk, isLoading, error };
}; 