import { ReactNode } from 'react';
import { DesktopHeader } from '../components/layout/DesktopHeader';
import { DesktopFooter } from '../components/layout/DesktopFooter';

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <DesktopHeader />
      <main className="flex-1">{children}</main>
      <DesktopFooter />
    </div>
  );
}

