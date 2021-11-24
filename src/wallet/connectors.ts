import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

export const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42,97] })


export const walletconnect = new WalletConnectConnector({
    rpc: { 97: "https://data-seed-prebsc-1-s2.binance.org:8545/" },
    qrcode: true
  })
