export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background font-sans antialiased">
      {children}
    </div>
  );
}
