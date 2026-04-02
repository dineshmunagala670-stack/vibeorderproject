import Header from '@/components/header';
import { CartProvider } from '@/context/CartContext'; // Ensure this path is correct
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#faf9f6]">
        {/* The CartProvider must wrap the Header and the Main content */}
        <CartProvider>
          <Header />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}