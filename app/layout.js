import '@/app/globals.css';

export const metadata = {
  title: 'FinanceDash - Financial Dashboard',
  description: 'Real-time financial dashboard for monitoring accounts payable, receivable, and cash flow',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}