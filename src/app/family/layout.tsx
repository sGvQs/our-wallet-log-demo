import { FamilyNav } from '@/components/FamilyNav';
import { MonthNav } from '@/components/MonthNav';

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
