import { type Metadata } from 'next'
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { M_PLUS_Rounded_1c } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

import { MonthProvider } from '@/context/MonthContext'
import { Suspense } from 'react'
import { TypingAnimation } from "@/components/ui/typing-animation"
import { ModeSwitch } from '@/components/ModeSwitch'

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
          <SignedOut>
            {children}
          </SignedOut>
          <SignedIn>
            <Suspense fallback={<div>Loading...</div>}>
              <MonthProvider>
                <div className="app-container">
                  <header className="app-header">
                    <ModeSwitch />
                    <Link href="/family/expenses" className="app-title">
                      <TypingAnimation words={["アワーウォレットログ 💴", "Our Wallet Log 💵"]}
                        loop
                        blinkCursor={true}
                        pauseDelay={5000}
                      />
                    </Link>
                    <UserButton />
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
