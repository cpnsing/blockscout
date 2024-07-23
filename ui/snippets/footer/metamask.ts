// utils/metamask.ts

interface ChainParams {
    chainId: any;
    chainName: any;
    nativeCurrency: {
      name: any;
      symbol: any; // 2-6 characters long
      decimals: any;
    };
    rpcUrls: any[];
    blockExplorerUrls?: any[];
  }
  
  export async function addRpcChain(chainParams: ChainParams): Promise<string> {
    console.log(">>>>>>>>>ChainParams",chainParams);
    
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }
  
    try {
      // Check if the chain is already added
      const currentChains = await window.ethereum.request({ method: 'eth_chainId' });
      if (currentChains.includes(chainParams.chainId)) {
        return 'Chain is already added';
      }
  
      // Add the new chain
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [chainParams],
      });
  
      return 'Chain added successfully';
    } catch (error) {
      console.error('Error adding chain:', error);
      throw error;
    }
  }
  