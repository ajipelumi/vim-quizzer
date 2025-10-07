import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
  onRestart?: () => void;
  showRestartButton?: boolean;
}

export default function Layout({
  children,
  onRestart,
  showRestartButton,
}: LayoutProps) {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <Header onRestart={onRestart} showRestartButton={showRestartButton} />
      <main className="flex-1 overflow-y-auto">
        <div className="container">
          {children}
        </div>
      </main>
      <Footer className="shrink-0" />
    </div>
  );
}
