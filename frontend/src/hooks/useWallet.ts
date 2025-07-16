import { useState, useEffect } from 'react';

export function useWallet() {
  const [account, setAccount] = useState<string | undefined>(undefined);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [network, setNetwork] = useState<string | undefined>(undefined);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 in hex
  const SEPOLIA_NETWORK_NAME = 'Sepolia Testnet';

  // Check if wallet is connected on mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (!window.ethereum) return;
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
      }

      // Check current network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setNetwork(chainId);
      setIsCorrectNetwork(chainId === SEPOLIA_CHAIN_ID);
    } catch (error) {
      console.error('Failed to check wallet connection:', error);
    }
  };

  const connect = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask or another wallet provider');
      return;
    }

    setIsLoading(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
      }

      // Check and switch to Sepolia if needed
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setNetwork(chainId);
      setIsCorrectNetwork(chainId === SEPOLIA_CHAIN_ID);

      if (chainId !== SEPOLIA_CHAIN_ID) {
        await switchToSepolia();
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const switchToSepolia = async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
      setNetwork(SEPOLIA_CHAIN_ID);
      setIsCorrectNetwork(true);
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: SEPOLIA_CHAIN_ID,
                chainName: SEPOLIA_NETWORK_NAME,
                nativeCurrency: {
                  name: 'Sepolia Ether',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://sepolia.infura.io/v3/645b161c447c49d4bbed402076e9ad0b'],
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
          setNetwork(SEPOLIA_CHAIN_ID);
          setIsCorrectNetwork(true);
        } catch (addError) {
          console.error('Failed to add Sepolia network:', addError);
        }
      }
    }
  };

  const disconnect = () => {
    setAccount(undefined);
    setIsConnected(false);
    setNetwork(undefined);
    setIsCorrectNetwork(false);
  };

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setAccount(undefined);
        setIsConnected(false);
      } else {
        setAccount(accounts[0]);
        setIsConnected(true);
      }
    };

    const handleChainChanged = (chainId: string) => {
      setNetwork(chainId);
      setIsCorrectNetwork(chainId === SEPOLIA_CHAIN_ID);
      if (chainId !== SEPOLIA_CHAIN_ID) {
        alert('Please switch to Sepolia testnet to use this application');
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  return {
    account,
    isConnected,
    isLoading,
    network,
    isCorrectNetwork,
    connect,
    disconnect,
    switchToSepolia,
  };
} 