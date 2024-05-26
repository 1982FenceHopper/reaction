import React from "react";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <section className="overflow-hidden">{children}</section>;
}
