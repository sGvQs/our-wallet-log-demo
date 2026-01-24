import { PersonalNav } from '@/components/personal/PersonalNav';
import { MonthNav } from '@/components/common';

export default function PersonalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="personal-mode">
      <PersonalNav />
      <main className="app-main">
        <MonthNav />
        <div className="main-content">
          {children}
        </div>
      </main>
    </div>
  );
}
