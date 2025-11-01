import './styles.css';
import React from 'react';

export const metadata = {
  title: 'James & Miller Dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="max-w-5xl mx-auto px-6">{children}</main>
      </body>
    </html>
  );
}
