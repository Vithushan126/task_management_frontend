import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import StoreProvider from '@/redux/StoreProvider';
import { Toaster } from 'react-hot-toast';

const outfit = Outfit({
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <StoreProvider>
          <ThemeProvider>
            <SidebarProvider>
              {children}{' '}
              <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                  style: {
                    zIndex: 100000,
                  },
                }}
              />
            </SidebarProvider>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
