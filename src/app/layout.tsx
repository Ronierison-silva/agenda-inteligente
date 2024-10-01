import type { Metadata } from "next";
import ThemeRegistry from "@/components/themeRegistry";

export const metadata: Metadata = {
  title: "Agenda",
  description: "Agenda de clientes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <ThemeRegistry>
        <body>
          {children}
        </body>
      </ThemeRegistry>
    </html>
  );
}
