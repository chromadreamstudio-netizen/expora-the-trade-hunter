import type { Metadata } from 'next'
import { Cairo } from 'next/font/google'
import './globals.css'

// استدعاء خط Cairo الاحترافي ودعمه للغتين
const cairo = Cairo({ 
  subsets: ['latin', 'arabic'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-cairo',
})

export const metadata: Metadata = {
  title: 'Expora | B2B AI Trade Hunter',
  description: 'AI-Powered B2B Lead Generation and Outreach',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cairo.variable}`}>
      {/* تطبيق الخط على كامل المنصة */}
      <body className="font-cairo bg-slate-950 text-slate-200">
        {children}
      </body>
    </html>
  )
}