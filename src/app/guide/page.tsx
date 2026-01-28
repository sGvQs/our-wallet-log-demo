import Link from 'next/link';
import { ArrowRight, Layers, PiggyBank, Users, Wallet } from 'lucide-react';
import styles from './page.module.css';

export default function GuidePage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>アプリの使い方</h1>
                <p className={styles.subtitle}>Our Wallet Logの基本機能をご紹介します</p>
            </div>

            <div className={styles.sections}>
                {/* 2つのモードについて */}
                <section className={styles.section}>
                    <div className={styles.sectionIcon}>
                        <Layers size={20} />
                    </div>
                    <h2 className={styles.sectionTitle}>2つのモードについて</h2>
                    <div className={styles.sectionContent}>
                        <p>
                            このアプリには<span className={styles.highlight}>「個人モード」</span>と
                            <span className={styles.highlight}>「同棲モード」</span>の2つがあります。
                        </p>
                        <p>
                            それぞれのデータは完全に分離されているので、プライベートな支出と
                            パートナーとの共有支出を明確に分けて管理できます。
                        </p>
                        <p>
                            <span className={styles.highlight}>右上のボタン</span>から、いつでも
                            モードを切り替えることができます。
                        </p>
                    </div>
                </section>

                {/* 個人モードの機能 */}
                <section className={styles.section}>
                    <div className={styles.sectionIcon}>
                        <PiggyBank size={20} />
                    </div>
                    <h2 className={styles.sectionTitle}>個人モードの機能</h2>
                    <div className={styles.sectionContent}>
                        <p>自分だけの家計簿として使えます。</p>
                        <ul className={styles.featureList}>
                            <li>カテゴリーごとの予算設定（固定費の一括登録も可能）</li>
                            <li>月次ダッシュボードで支出の傾向を分析</li>
                            <li>年次ビューで年間の使い方を振り返り</li>
                            <li>支出と予算の進捗をひと目で確認</li>
                        </ul>
                    </div>
                </section>

                {/* 同棲モードの機能 */}
                <section className={styles.section}>
                    <div className={styles.sectionIcon}>
                        <Users size={20} />
                    </div>
                    <h2 className={styles.sectionTitle}>同棲モードの機能</h2>
                    <div className={styles.sectionContent}>
                        <p>パートナーと一緒に家計を管理できます。</p>
                        <ul className={styles.featureList}>
                            <li>「チームの設定」から「チーム」を作成して、表示される招待コードをパートナーに共有</li>
                            <li>パートナーは「チームの設定」からそのコードを入力してチームに参加</li>
                            <li>お互いの支出がリアルタイムで共有・確認できる</li>
                            <li>「どっちがいくら払った？」がすぐわかる</li>
                        </ul>
                    </div>
                </section>

                {/* 使い始めるヒント */}
                <section className={styles.section}>
                    <div className={styles.sectionIcon}>
                        <Wallet size={20} />
                    </div>
                    <h2 className={styles.sectionTitle}>まずはここから</h2>
                    <div className={styles.sectionContent}>
                        <p>
                            おすすめは、まず<span className={styles.highlight}>個人モード</span>で
                            今月の予算を設定してみること。
                        </p>
                        <p>
                            予算ページから固定費を一括で登録すれば、あとは支出を記録していくだけで
                            自動的に進捗が可視化されます。
                        </p>
                    </div>
                </section>
            </div>

            <div className={styles.footer}>
                <Link href="/" className={styles.startButton}>
                    <span>始める</span>
                    <ArrowRight size={18} />
                </Link>
            </div>
        </div>
    );
}
