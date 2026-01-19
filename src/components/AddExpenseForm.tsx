'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { addExpense } from '@/backend/actions/expenses';
import { CATEGORIES, CATEGORY_COLORS } from '@/components/FilterBar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';



export function AddExpenseForm() {
  const [state, action, isPending] = useActionState(addExpense, null);
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      setIsOpen(false);
      formRef.current?.reset();
    }
  }, [state]);



  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="w-full">
        ＋ 支出を記録する
      </Button>
    );
  }

  return (
    <Card className="mb-6">
      <div className="form-header">
        <h3 className="form-title">支出の記録</h3>
        <Button variant="ghost" onClick={() => setIsOpen(false)} style={{ padding: '0.25rem 0.5rem' }}>✕</Button>
      </div>
      <form ref={formRef} action={action} className="form-body">
        <div className="date-grid">
            <div className="form-dates-column">
              <label className="form-label">年</label>
              <select name="year" defaultValue={new Date().getFullYear()} className="form-select">
                 {[new Date().getFullYear() - 1, new Date().getFullYear(), new Date().getFullYear() + 1].map(y => (
                     <option key={y} value={y}>{y}年</option>
                 ))}
              </select>
            </div>
            <div className="form-dates-column">
              <label className="form-label">月</label>
              <select name="month" defaultValue={new Date().getMonth() + 1} className="form-select">
                 {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                     <option key={m} value={m}>{m}月</option>
                 ))}
              </select>
            </div>
            <div className="form-dates-column">
              <label className="form-label">日</label>
              <select name="day" defaultValue={new Date().getDate()} className="form-select">
                 {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                     <option key={d} value={d}>{d}日</option>
                 ))}
              </select>
            </div>
        </div>
        <Input 
            label="内容" 
            name="description" 
            placeholder="スーパーでの買い物" 
            required
        />
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label className="form-label" style={{ textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            カテゴリー
          </label>
          <select 
            name="category" 
            required 
            defaultValue="FOOD"
            className="form-select"
          >
            {Object.entries(CATEGORIES).filter(([key]) => key !== 'ALL').map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <Input 
            label="金額 (円)" 
            name="amount" 
            type="number" 
            placeholder="3000" 
            required
        />
        
        {state?.error && <p style={{ color: 'var(--color-accent)' }}>{state.error}</p>}
        
        <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => setIsOpen(false)} style={{ flex: 1 }}>
                キャンセル
            </Button>
            <Button type="submit" isLoading={isPending} style={{ flex: 1 }}>
                保存
            </Button>
        </div>
      </form>
    </Card>
  );
}
