import { FamilyNav } from '@/components/family';
import { MonthNav } from '@/components/common';

export default function FamilyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="family-mode">
      <FamilyNav />
      <main className="app-main">
        <MonthNav />
        <div className="main-content">
          {children}
        </div>
      </main>
    </div>
  );
}
