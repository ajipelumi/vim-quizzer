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
    <div className="min-h-screen w-full flex flex-col bg-vim-bg text-white overflow-x-hidden">
      <Header onRestart={onRestart} showRestartButton={showRestartButton} />
      <main className="flex-1 w-full overflow-x-hidden p-4">
        <div className="max-w-4xl mx-auto w-full pb-4">{children}</div>
      </main>
      <Footer className="shrink-0" />
    </div>
  );
}
