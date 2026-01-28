import Link from 'next/link';
import { Book, User, Users } from 'lucide-react';
import styles from './page.module.css';

export default function PortalPage() {
  return (
    <div className={styles.container}>
      <div className={styles.welcome}>
        <h2 className={styles.welcomeTitle}>ようこそ！</h2>
        <p className={styles.welcomeSubtitle}>管理したいモードを選んでください</p>
      </div>

      <div className={styles.modeGrid}>
        <Link href="/personal/dashboard" className={styles.modeCard}>
          <div className={styles.modeIcon}>
            <User size={48} strokeWidth={1.5} />
          </div>
          <h3 className={styles.modeTitle}>個人モード</h3>
          <p className={styles.modeDescription}>
            自分だけの支出・予算を管理<br />
            月ごとの振り返りや年間分析も
          </p>
        </Link>

        <Link href="/family/expenses" className={styles.modeCard}>
          <div className={styles.modeIcon}>
            <Users size={48} strokeWidth={1.5} />
          </div>
          <h3 className={styles.modeTitle}>同棲モード</h3>
          <p className={styles.modeDescription}>
            パートナーと共有する家計簿<br />
            折半ルールも自由にカスタマイズ
          </p>
        </Link>
      </div>

      <Link href="/guide" className={styles.guideLink}>
        <Book size={18} />
        <span>このアプリの使い方を見る</span>
      </Link>
    </div>
  );
}
