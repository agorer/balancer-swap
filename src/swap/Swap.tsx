import { ConnectButton } from "@rainbow-me/rainbowkit"
import MessagesViewer from '../shared/MessagesViewer'
import SwapForm from "./SwapForm"

export default function Swap() {
  return (
    <>
      <div className="card">
        <div className="header">
          <ConnectButton />
        </div>
        <MessagesViewer />
        <SwapForm />
      </div>
    </>
  )
}
