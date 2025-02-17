import './App.css'

import '@rainbow-me/rainbowkit/styles.css'
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import {
  arbitrum,
  sepolia,
} from 'wagmi/chains'
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query"

import Swap from './swap/Swap'

const config = getDefaultConfig({
  appName: 'balancer-test',
  projectId: '76e0050096dbc0b88e88fd6d260e3d2a', // FIXME: This should go to a secret store or env var
  chains: [arbitrum, sepolia],
  ssr: false
})

const queryClient = new QueryClient()

function App() {
  return (
    <>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <Swap />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>   
    </>
  )
}

export default App
