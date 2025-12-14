import { Header } from "./_components/header";
import {ReactNode} from "react";

export default function MarketLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <Header />
      </div>
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
