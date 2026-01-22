import { type Metadata } from 'next'
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { M_PLUS_1p, M_PLUS_Rounded_1c } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { DashboardNav } from '@/components/DashboardNav'
import { MonthNav } from '@/components/MonthNav'

import { MonthProvider } from '@/context/MonthContext'
import { Suspense } from 'react'
import { TypingAnimation } from "@/components/ui/typing-animation"

const primaryFont = M_PLUS_Rounded_1c({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-primary',
});

export const metadata: Metadata = {
  title: 'Our Wallet Log',
  description: 'Shared wallet expense tracking',
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
          <header>
            <SignedOut>
              {children}
            </SignedOut>
            <SignedIn>
              <Suspense fallback={<div>Loading...</div>}>
                <MonthProvider>
                  <div className="app-container">
                    <header className="app-header">
                      <Link href="/personal" className="app-title">
                        <TypingAnimation words={["わたしたちの家計簿 💴", "Our Wallet Log 💵"]}
                          loop
                          blinkCursor={true}
                          pauseDelay={5000}
                        />
                      </Link>
                      <UserButton />
                    </header>
                    <DashboardNav />
                    <main className="app-main">
                      <MonthNav />
                      <div className="main-content">
                        {children}
                      </div>
                    </main>
                  </div>
                </MonthProvider>
              </Suspense>
            </SignedIn>
          </header>
        </body>
      </html>
    </ClerkProvider>
  )
}
