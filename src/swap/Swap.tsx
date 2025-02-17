import { ConnectButton } from "@rainbow-me/rainbowkit"
import SwapForm from "./SwapForm"

export default function Swap() {
  return (
    <>
      <h1>Swap tokens</h1>
      <div className="card">
        <ConnectButton />
        <SwapForm />
      </div>
    </>
  )
}
