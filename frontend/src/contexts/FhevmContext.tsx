import { useEffect, useState, useContext, createContext, type ReactNode } from 'react';
import { ethers } from 'ethers';
import { getContractAddress, getRpcUrl } from '../config/contracts';
import { useFhevmSDK } from '../hooks/useFhevmSDK';

// Define types locally to avoid bundle.js import issues
export type EIP712 = any;
export type FhevmInstance = any;

export type FhevmContextType = {
  instance: FhevmInstance;
  eip712: EIP712;
  setSignature: (signature: string) => void;
  decrypt: (
    handle: string,
    requestSignature: (eip712: any) => Promise<string>,
  ) => Promise<bigint | undefined>;
};

export const FhevmContext = createContext<FhevmContextType | undefined>(undefined);

export const useFhevm = () => {
  const context = useContext(FhevmContext);
  if (context === undefined) {
    throw new Error('useFhevm must be used within a FhevmProvider');
  }
  return context;
};

interface FhevmProviderProps {
  children: ReactNode;
  account?: string;
}

export function FhevmProvider({ children, account }: FhevmProviderProps) {
  const [instance, setInstance] = useState<FhevmInstance | undefined>(undefined);
  const [eip712, setEip712] = useState<EIP712>();
  const [startTimestamp, setStartTimestamp] = useState<number | undefined>(undefined);
  const [keypair, setKeypair] = useState<
    { publicKey: string; privateKey: string } | undefined
  >(undefined);
  const [signature, setSignature] = useState<string | undefined>(undefined);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const durationDays = 365;
  const contractAddress = getContractAddress();

  // Use the new FHEVM SDK hook
  const { sdk, isLoading: sdkLoading, error: sdkError } = useFhevmSDK();

  // Initialize FHEVM instance when SDK is ready and account is available
  useEffect(() => {
    const initializeFHEVM = async () => {
      try {
        setIsInitializing(true);
        setError(undefined);

        // Check if WebAssembly is supported
        if (typeof WebAssembly === 'undefined') {
          throw new Error('WebAssembly is not supported in this browser');
        }

        // Wait for SDK to be loaded
        if (sdkLoading) {
          return;
        }

        if (sdkError) {
          throw new Error(sdkError);
        }

        if (!sdk) {
          throw new Error('FHEVM SDK not available');
        }

        console.log('Initializing FHEVM with SDK...');
        
        try {
          console.log('Calling initSDK...');
          await sdk.initSDK();
          console.log('SDK initialized successfully');
        } catch (initError) {
          console.error('initSDK failed, retrying...', initError);
          // Wait a bit more and try again
          await new Promise(resolve => setTimeout(resolve, 3000));
          console.log('Retrying initSDK...');
          await sdk.initSDK();
          console.log('SDK initialized successfully on retry');
        }
        
        // Get and log the RPC URL
        const rpcUrl = getRpcUrl();
        console.log('Using RPC URL:', rpcUrl);
        
        // Use explicit configuration since SepoliaConfig might not be available
        const config = {
          aclContractAddress: "0x687820221192C5B662b25367F70076A37bc79b6c",
          kmsContractAddress: "0x1364cBBf2cDF5032C47d8226a6f6FBD2AFCDacAC",
          inputVerifierContractAddress: "0xbc91f3daD1A5F19F8390c400196e58073B6a0BC4",
          verifyingContractAddressDecryption: "0xb6E160B1ff80D67Bfe90A85eE06Ce0A2613607D1",
          verifyingContractAddressInputVerification: "0x7048C39f048125eDa9d678AEbaDfB22F7900a29F",
          chainId: 11155111,
          gatewayChainId: 55815,
          network: rpcUrl,
          relayerUrl: "https://relayer.testnet.zama.cloud",
        };
        
        console.log('Creating FHEVM instance with config:', config);
        
        let i;
        try {
          i = await sdk.createInstance(config);
          console.log('FHEVM instance created successfully');
        } catch (createError) {
          console.error('createInstance failed:', createError);
          throw createError;
        }
        
        if (!keypair || !eip712) {
          setSignature(undefined);
          const timestamp = Date.now();
          setStartTimestamp(timestamp);
          const kp = i.generateKeypair();
          setKeypair(kp);
          
          // Type guard to ensure currentKeypair is defined
          if (!kp) {
            console.error('Failed to generate keypair');
            return;
          }
          
          const eip = i.createEIP712(
            kp.publicKey,
            [contractAddress],
            timestamp,
            durationDays,
          );
          setEip712(eip);
        }
        setInstance(i);
      } catch (e) {
        console.error('Failed to initialize FHEVM:', e);
        let errorMessage = 'Failed to initialize FHEVM';
        if (e instanceof Error) {
          if (e.message.includes('wrong relayer url')) {
            errorMessage = 'Relayer URL configuration error. Please check your network settings.';
          } else if (e.message.includes('Failed to fetch')) {
            errorMessage = 'Network connection error. Please check your internet connection and try again.';
          } else if (e.message.includes('__wbindgen_malloc')) {
            errorMessage = 'FHEVM SDK WebAssembly modules not loaded. Please refresh the page and ensure JavaScript is enabled.';
          } else if (e.message.includes('Invalid public key')) {
            errorMessage = 'Public key error. Please check your network connection and try again.';
          } else if (e.message.includes('WebAssembly is not supported')) {
            errorMessage = 'Your browser does not support WebAssembly. Please use a modern browser like Chrome, Firefox, or Safari.';
          } else if (e.message.includes('Relayer SDK not loaded')) {
            errorMessage = 'FHEVM SDK not loaded. Please refresh the page and try again.';
          } else {
            errorMessage = e.message;
          }
        }
        setError(errorMessage);
      } finally {
        setIsInitializing(false);
      }
    };

    // Only initialize if we have an account and SDK is ready
    if (account && !sdkLoading) {
      initializeFHEVM();
    } else if (!account) {
      setIsInitializing(false);
    }
  }, [account, sdk, sdkLoading, sdkError]); // Run when account or SDK state changes

  // Decrypt function for getting results from contract
  const decrypt = async (
    handle: string,
    requestSignature: (eip712: any) => Promise<string>,
  ) => {
    if (!instance || !account) return;
    
    let s = signature;
    let timestamp = startTimestamp;
    let currentKeypair = keypair;
    
    if (!s) {
      timestamp = Math.floor(Date.now() / 1000) - 1000;
      setStartTimestamp(timestamp);
      currentKeypair = instance.generateKeypair();
      setKeypair(currentKeypair);
      
      // Type guard to ensure currentKeypair is defined
      if (!currentKeypair) {
        console.error('Failed to generate keypair');
        return;
      }
      
      const eip = instance.createEIP712(
        currentKeypair.publicKey,
        [contractAddress],
        timestamp,
        durationDays,
      );
      setEip712(eip);
      const signature = await requestSignature(eip);
      setSignature(signature);
      s = signature;
    }
    
    // At this point, currentKeypair should be defined
    if (!currentKeypair) {
      console.error('Keypair is undefined after generation');
      return;
    }
    
    const r = await instance.userDecrypt(
      [{ handle, contractAddress }],
      (currentKeypair as { publicKey: string; privateKey: string }).privateKey,
      (currentKeypair as { publicKey: string; privateKey: string }).publicKey,
      s,
      [contractAddress],
      ethers.getAddress(account),
      timestamp!,
      durationDays,
    );
    return r[handle] as bigint;
  };

  if (isInitializing || sdkLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {sdkLoading ? 'Loading FHEVM SDK...' : account ? 'Initializing FHEVM...' : 'Please connect your wallet to continue'}
          </p>
        </div>
      </div>
    );
  }

  if (error || sdkError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800 mb-2">FHEVM Initialization Failed</h3>
          <p className="text-red-600 mb-4">{error || sdkError}</p>
          <div className="text-sm text-gray-600 mb-4">
            <p>Common solutions:</p>
            <ul className="text-left mt-2 space-y-1">
              <li>• Ensure your wallet is connected to Sepolia network</li>
              <li>• Check your internet connection</li>
              <li>• Refresh the page and try again</li>
              <li>• Use a modern browser (Chrome, Firefox, Safari)</li>
              <li>• Ensure JavaScript is enabled</li>
            </ul>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Please connect your wallet to use FHE features</p>
        </div>
      </div>
    );
  }

  if (!instance) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">FHEVM not initialized</p>
        </div>
      </div>
    );
  }

  return (
    <FhevmContext.Provider
      value={{
        instance,
        setSignature,
        eip712: eip712!,
        decrypt,
      }}
    >
      {children}
    </FhevmContext.Provider>
  );
} 