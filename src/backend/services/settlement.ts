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
};

export function calculateSettlements(
  expenses: { amount: number; payerId: number }[],
  members: { userId: number; user: { name: string } }[]
): { balances: MemberBalance[]; settlements: Settlement[] } {
  // 1. Calculate totals
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const averageAmount = Math.floor(totalAmount / members.length); // Simple floor to avoid decimals

  // 2. Calculate paid amount per user
  const paidByUser: Record<number, number> = {};
  members.forEach((m) => {
    paidByUser[m.userId] = 0;
  });
  expenses.forEach((exp) => {
    paidByUser[exp.payerId] = (paidByUser[exp.payerId] || 0) + exp.amount;
  });

  // 3. Calculate balances
  const balances: MemberBalance[] = [];
  members.forEach((m) => {
    balances.push({
      userId: m.userId,
      name: m.user.name,
      paid: paidByUser[m.userId],
      balance: paidByUser[m.userId] - averageAmount,
    });
  });

  // 4. Calculate settlements (Simple Greedy Algorithm)
  // Receivers have positive balance, Payers have negative balance.
  let receivers = balances.filter((b) => b.balance > 0).sort((a, b) => b.balance - a.balance);
  let payers = balances.filter((b) => b.balance < 0).sort((a, b) => a.balance - b.balance);
  
  const settlements: Settlement[] = [];

  let i = 0; // receiver index
  let j = 0; // payer index

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

  // Restore balances for display (since we mutated them in logic)
  // Re-calculate or just use the initial paid - avg.
  // Actually, let's re-map them to avoid confusion if we use the mutated objects for display.
  const displayBalances = members.map(m => ({
      userId: m.userId,
      name: m.user.name,
      paid: paidByUser[m.userId],
      balance: paidByUser[m.userId] - averageAmount
  })).sort((a, b) => b.balance - a.balance);

  return { balances: displayBalances, settlements };
}
