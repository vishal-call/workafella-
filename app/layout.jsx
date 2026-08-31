import './globals.css';
import { AppProvider } from '../src/context/AppContext';

export const metadata = {
  title: 'Workafella — Digital Workspace Platform',
  description: 'Role-based digital workspace management platform for Workafella across Hyderabad, Chennai, Bangalore, and Mumbai.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full bg-[#faf9f7] text-[#1a1c1b] font-['Inter'] antialiased overflow-hidden selection:bg-[#f5b400] selection:text-[#161616]" suppressHydrationWarning>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
