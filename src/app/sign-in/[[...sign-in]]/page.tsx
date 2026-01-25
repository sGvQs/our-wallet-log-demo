import { SignIn } from '@clerk/nextjs'
import { RetroGrid } from "@/components/ui/retro-grid"
import { HyperText } from "@/components/ui/hyper-text"
import styles from './page.module.css'

export default function Page() {
  return (
    <div className={styles.container}>
      <div className={styles.branding}>
        <div className={styles.title}>
          <HyperText>OUR</HyperText>
          <HyperText>WALLET</HyperText>
          <HyperText>LOG</HyperText>
        </div>
        <h2 className={styles.subtitle}>同棲やシェアハウス用の家計簿アプリ</h2>
      </div>
      <RetroGrid angle={80} cellSize={10} />
      <SignIn />
    </div>
  )
}