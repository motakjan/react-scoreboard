import React, { type PropsWithChildren } from "react";
import Navbar from "../Navbar/Navbar";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="flex min-h-screen flex-col bg-layout text-white">
      <Navbar />
      <div className="px-8 pt-8 sm:px-16">{children}</div>
    </main>
  );
};
