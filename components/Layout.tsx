import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
  onRestart?: () => void;
  showRestartButton?: boolean;
}

export default function Layout({ children, onRestart, showRestartButton }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header onRestart={onRestart} showRestartButton={showRestartButton} />
      <main className="flex-grow pt-4">{children}</main>
      <Footer />
    </div>
  );
}
