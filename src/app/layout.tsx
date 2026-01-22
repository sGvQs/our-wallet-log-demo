import { type Metadata } from 'next'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Geist, Geist_Mono, Zen_Maru_Gothic } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { DashboardNav } from '@/components/DashboardNav'
import { MonthNav } from '@/components/MonthNav'

import { MonthProvider } from '@/context/MonthContext'
import { Suspense } from 'react'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const zenMaruGothic = Zen_Maru_Gothic({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-zen-maru',
})

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
        <body className={`${geistSans.variable} ${geistMono.variable} ${zenMaruGothic.variable} antialiased`}>
          <header className="flex justify-end items-center p-4 gap-4 h-16">
            <SignedOut>
              {children}
            </SignedOut>
            <SignedIn>
              <Suspense fallback={<div>Loading...</div>}>
                <MonthProvider>
                  <div className="app-container">
                    <header className="app-header">
                      <Link href="/personal" className="app-title">
                        💰 わたしたちの家計簿
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
