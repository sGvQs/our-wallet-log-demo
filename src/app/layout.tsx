import { type Metadata } from 'next'
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs'
import { M_PLUS_Rounded_1c } from 'next/font/google'
import './globals.css'

import { MonthProvider } from '@/context/MonthContext'
import { Suspense } from 'react'
import { TypingAnimation } from "@/components/ui/typing-animation"
import { ModeSwitch } from '@/components/common'
import { ClientUserButton } from '@/components/common/ClientUserButton'

const primaryFont = M_PLUS_Rounded_1c({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-primary',
});

export const metadata: Metadata = {
  title: 'Our Wallet Log | 個人も同棲もこれひとつ。カップル・夫婦のためのスマート家計簿',
  description: '「どっちがいくら払ったっけ？」をなくしましょう。生活費の折半ルールを6:4など自由にカスタマイズ可能。パートナーとの家計管理を透明にしつつ、自分のお小遣い管理もこれ一つで完結します。',
  keywords: [
    "家計簿",
    "家計管理",
    "同棲",
    "カップル",
    "夫婦",
    "割り勘",
    "支出管理",
    "予算管理",
    "資産管理",
  ],
  openGraph: {
    title: 'Our Wallet Log | 個人も同棲もこれひとつ。カップル・夫婦のためのスマート家計簿',
    description: '「どっちがいくら払ったっけ？」をなくしましょう。生活費の折半ルールを6:4など自由にカスタマイズ可能。パートナーとの家計管理を透明にしつつ、自分のお小遣い管理もこれ一つで完結します。',
    url: 'https://our-wallet-log.vercel.app/',
    siteName: 'Our Wallet Log',
    images: [
      {
        url: 'https://our-wallet-log.vercel.app/ogp.png',
        width: 1200,
        height: 630,
        alt: 'Our Wallet Log',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${primaryFont.variable} antialiased`}>
          <SignedOut>
            {children}
          </SignedOut>
          <SignedIn>
            <Suspense fallback={<div>Loading...</div>}>
              <MonthProvider>
                <div className="app-container">
                  <header className="app-header">
                    <h1 className="app-title">
                      <TypingAnimation words={["アワーウォレットログ 💴", "Our Wallet Log 💵"]}
                        loop
                        blinkCursor={true}
                        pauseDelay={5000}
                        className='h-20 flex justify-center'
                      />
                    </h1>
                    <div className="app-side-header">
                      <ModeSwitch />
                      <ClientUserButton />
                    </div>
                  </header>
                  <Suspense fallback={<div>Loading...</div>}>
                    {children}
                  </Suspense>
                </div>
              </MonthProvider>
            </Suspense>
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  )
}
