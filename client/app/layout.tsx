export const metadata = {
  title: 'SkillQuest - Cosmic Archive',
  description: 'The Arcanepunk Learning Experience',
}

import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0A0E1A]">{children}</body>
    </html>
  )
}
