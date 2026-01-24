import { PersonalNav } from '@/components/personal/PersonalNav';
import { MonthNav } from '@/components/MonthNav';

export default function PersonalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="personal-mode">
      {/* Mode indicator badge */}
      {/* <div 
        style={{
          position: 'absolute',
          top: '0.5rem',
          left: '1rem',
          padding: '0.25rem 0.75rem',
          background: 'var(--color-primary-personal)',
          color: 'white',
          fontSize: '0.75rem',
          fontWeight: 600,
          borderRadius: 'var(--radius-full)',
          zIndex: 10,
        }}
      >
        個人モード
      </div> */}
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
