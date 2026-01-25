'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { PERSONAL_CATEGORIES } from '@/lib/constants/categories';
import { PersonalExpenseCategory } from '@prisma/client';

// Filter categories (including ALL)
const FILTER_CATEGORIES: PersonalExpenseCategory[] = [
  'ALL',
  'FOOD',
  'HOUSING',
  'UTILITIES',
  'DAILY',
  'TRAVEL',
  'ENTERTAINMENT',
  'HOBBY',
  'CLOTHING',
  'BEAUTY',
  'MEDICAL',
  'EDUCATION',
  'GIFTS',
  'SUBSCRIPTION',
  'SAVINGS',
  'OTHER',
];

interface BudgetFilterBarProps {
  year: number;
}

export function BudgetFilterBar({ year }: BudgetFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URLから現在の値を取得 (存在しない場合は 'ALL' とする)
  const currentCategory = searchParams.get('category') || 'ALL';
  const monthParam = searchParams.get('month'); // format: YYYY-MM

  // YYYY-MM から MM 部分だけを抽出して現在の選択値とする。パラメータがない場合は 'ALL'
  const currentMonthValue = monthParam ? monthParam.split('-')[1] : 'ALL'; // Returns "01", "02", ... or "ALL"

  // フィルター変更時の共通ハンドラー
  const handleFilterChange = (key: 'month' | 'category', value: string) => {
    // 現在のパラメータを複製（他のパラメータを消さないため）
    const params = new URLSearchParams(searchParams.toString());

    if (value === 'ALL') {
      // "ALL" が選ばれたらパラメータ自体を削除
      params.delete(key);
    } else {
      // 値をセット
      if (key === 'month') {
        // 月の場合は YYYY-MM 形式に変換
        // value は "1" ~ "12" なので、0埋めしてフォーマット
        params.set(key, `${year}-${value.padStart(2, '0')}`);
      } else {
        params.set(key, value);
      }
    }

    router.push(`/personal/budget?${params.toString()}`);
  };

  const selectStyle = {
    padding: '0.375rem 2rem 0.375rem 0.75rem', // 右側のpaddingは矢印用
    fontSize: '0.875rem',
    borderRadius: '0.375rem',
    border: '1px solid var(--color-border)',
    background: 'var(--color-background)',
    color: 'var(--color-text)',
    cursor: 'pointer',
    minWidth: '120px',
    appearance: 'none' as const, // デフォルトの矢印を消す場合（必要に応じてCSSでカスタム矢印を追加）
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.5rem center',
    backgroundSize: '1em',
  };

  const labelStyle = {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--color-text-muted)',
    display: 'block',
    marginBottom: '0.375rem',
  };

  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      {/* Month Selector */}
      <div>
        <label style={labelStyle}>月</label>
        <select
          value={currentMonthValue === 'ALL' ? 'ALL' : String(Number(currentMonthValue))} // "05" -> "5" に戻して比較
          onChange={(e) => handleFilterChange('month', e.target.value)}
          style={selectStyle}
        >
          <option value="ALL">全て</option>
          {[...Array(12)].map((_, i) => {
            const m = i + 1;
            return (
              <option key={m} value={m.toString()}>
                {m}月
              </option>
            );
          })}
        </select>
      </div>

      {/* Category Selector */}
      <div>
        <label style={labelStyle}>カテゴリ</label>
        <select
          value={currentCategory}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          style={selectStyle}
        >
          {FILTER_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'ALL' ? '全て' : PERSONAL_CATEGORIES[cat]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}