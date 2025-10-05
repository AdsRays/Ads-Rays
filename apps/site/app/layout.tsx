export const metadata = { title: "AdsRays Demo" } as any;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body style={{margin:0, fontFamily:"system-ui, -apple-system, Segoe UI, Roboto, Arial"}}>
        {children}
      </body>
    </html>
  );
}
