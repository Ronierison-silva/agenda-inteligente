import type { Metadata } from "next";
import ThemeRegistry from "@/components/themeRegistry";
import { AuthContextProvider } from "@/context/auth/AuthProvider";
import Header from "@/components/dumb/header/header";

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
          <AuthContextProvider>
            <Header></Header>
              {children}
          </AuthContextProvider>
        </body>
      </ThemeRegistry>
    </html>
  );
}
