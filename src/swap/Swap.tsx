import { ConnectButton } from "@rainbow-me/rainbowkit"
import MessagesViewer from '../shared/MessagesViewer'
import SwapForm from "./SwapForm"

export default function Swap() {
  return (
    <>
      <h1>Swap tokens</h1>
      <MessagesViewer />
      <div className="card">
        <div className="header">
          <ConnectButton />
        </div>
        <SwapForm />
      </div>
    </>
  )
}
