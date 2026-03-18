import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CV Builder — Group 30 KNUST',
  description: 'Build a professional, ATS-optimized CV in minutes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
