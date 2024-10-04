import type { Metadata } from "next";
import ThemeRegistry from "@/components/themeRegistry";
import { AuthProvider } from "@/context/AuthContext";

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
        <AuthProvider>
          <body>
            {children}
          </body>
        </AuthProvider>
      </ThemeRegistry>
    </html>
  );
}
