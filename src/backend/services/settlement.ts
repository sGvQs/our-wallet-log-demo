export type Settlement = {
  fromUserId: number;
  toUserId: number;
  amount: number;
};

export type MemberBalance = {
  userId: number;
  name: string;
  paid: number;
  balance: number; // Positive = gets money, Negative = owes money
  targetAmount: number; // 本来負担すべき額
};

export type SplitResult = {
  creatorAmount: number;   // 作成者の負担額
  partnerAmount: number;   // パートナーの負担額
  remainder: number;       // 端数
};

/**
 * カスタム割合で精算額を計算
 * @param totalAmount 合計支払い金額
 * @param creatorRatio 作成者の負担割合 (0-100)
 * @returns 各自の負担額
 */
export function calculateSplitAmount(
  totalAmount: number,
  creatorRatio: number
): SplitResult {
  const partnerRatio = 100 - creatorRatio;

  let creatorAmount = Math.floor(totalAmount * creatorRatio / 100);
  let partnerAmount = Math.floor(totalAmount * partnerRatio / 100);

  // 端数処理: 切り捨ての差分を高割合側に加算
  const remainder = totalAmount - creatorAmount - partnerAmount;

  if (remainder > 0) {
    // より大きい割合を持つ側に端数を加算
    if (creatorRatio >= partnerRatio) {
      creatorAmount += remainder;
    } else {
      partnerAmount += remainder;
    }
  }

  return {
    creatorAmount,
    partnerAmount,
    remainder,
  };
}

export function calculateSettlements(
  expenses: { amount: number; payerId: number }[],
  members: { userId: number; user: { name: string | null } }[],
  creatorId?: number,
  splitRatio: number = 50
): { balances: MemberBalance[]; settlements: Settlement[] } {
  // 1. Calculate totals
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // 2. Calculate paid amount per user
  const paidByUser: Record<number, number> = {};
  members.forEach((m) => {
    paidByUser[m.userId] = 0;
  });
  expenses.forEach((exp) => {
    paidByUser[exp.payerId] = (paidByUser[exp.payerId] || 0) + exp.amount;
  });

  // 3. Calculate target amounts (what each should pay)
  const targetAmount: Record<number, number> = {};

  if (members.length === 2 && creatorId !== undefined) {
    // カスタム割合モード（2人の場合）
    const { creatorAmount, partnerAmount } = calculateSplitAmount(totalAmount, splitRatio);
    const partner = members.find(m => m.userId !== creatorId);

    targetAmount[creatorId] = creatorAmount;
    if (partner) {
      targetAmount[partner.userId] = partnerAmount;
    }
  } else {
    // 均等割り（フォールバック）
    const averageAmount = Math.floor(totalAmount / members.length);
    members.forEach((m) => {
      targetAmount[m.userId] = averageAmount;
    });
  }

  // 4. Calculate balances
  const balances: MemberBalance[] = members.map((m) => ({
    userId: m.userId,
    name: m.user.name || '名前未設定',
    paid: paidByUser[m.userId],
    balance: paidByUser[m.userId] - targetAmount[m.userId],
    targetAmount: targetAmount[m.userId],
  }));

  // 5. Calculate settlements (Simple for 2 people)
  const settlements: Settlement[] = [];
  const sorted = [...balances].sort((a, b) => b.balance - a.balance);

  if (sorted.length === 2 && sorted[0].balance > 0 && sorted[1].balance < 0) {
    settlements.push({
      fromUserId: sorted[1].userId,
      toUserId: sorted[0].userId,
      amount: sorted[0].balance,
    });
  } else if (sorted.length > 2) {
    // Legacy greedy algorithm for 3+ people (fallback)
    let receivers = sorted.filter((b) => b.balance > 0);
    let payers = sorted.filter((b) => b.balance < 0);

    let i = 0;
    let j = 0;

    while (i < receivers.length && j < payers.length) {
      const receiver = receivers[i];
      const payer = payers[j];

      const amount = Math.min(receiver.balance, -payer.balance);

      if (amount > 0) {
        settlements.push({
          fromUserId: payer.userId,
          toUserId: receiver.userId,
          amount: amount,
        });
      }

      receiver.balance -= amount;
      payer.balance += amount;

      if (receiver.balance === 0) i++;
      if (payer.balance === 0) j++;
    }
  }

  // Return balances sorted by balance descending
  const displayBalances = members.map(m => ({
    userId: m.userId,
    name: m.user.name || '名前未設定',
    paid: paidByUser[m.userId],
    balance: paidByUser[m.userId] - targetAmount[m.userId],
    targetAmount: targetAmount[m.userId],
  })).sort((a, b) => b.balance - a.balance);

  return { balances: displayBalances, settlements };
}
