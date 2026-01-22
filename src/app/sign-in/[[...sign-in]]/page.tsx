import { SignIn } from '@clerk/nextjs'
import { RetroGrid } from "@/components/ui/retro-grid"
import { HyperText } from "@/components/ui/hyper-text"

export default function Page() {
  return <div style={{
    display: 'flex',
    gap: "50px",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw"
  }}>
    <div
      style={{
        color: "#D97757",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "--font-primary",
        fontSize: "12px"
      }}>
      <div style={{
        display: "flex",
        gap: "16px"
      }}
      >
        <HyperText>OUR</HyperText>
        <HyperText>WALLET</HyperText>
        <HyperText>LOG</HyperText>
      </div>
      <h2>同棲やシェアハウス用の家計簿アプリ</h2>
    </div>
    <RetroGrid angle={80} cellSize={10} />
    <SignIn />
  </div>
}