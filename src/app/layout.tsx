import type { Metadata } from "next";

import "./globals.css";
import TodoProvider from "./context/todoContext";

export const metadata: Metadata = {
  title: "Todo",
  description: "Todo-App for Sprinto Interview",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased dark`}>
        <TodoProvider>{children}</TodoProvider>
      </body>
    </html>
  );
}
