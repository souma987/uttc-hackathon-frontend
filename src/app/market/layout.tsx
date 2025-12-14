import { Header } from "./_components/header";
import { Footer } from "./_components/footer";
import {ReactNode} from "react";

export default function MarketLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <Header />
      </div>
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8">{children}</main>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <Footer />
      </div>
    </div>
  );
}
