import './globals.css';
export const metadata = {
  title: 'Sales Dashboard',
  description: 'Company sales visualisation',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
