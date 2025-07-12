import type { Metadata } from 'next'
import '../styles/globals.css'
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: 'EDTECH-AI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Footer />
      </body>
    </html>
  )
}
