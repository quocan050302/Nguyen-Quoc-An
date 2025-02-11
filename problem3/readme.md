# React Code Analysis & Refactoring

## Computational Inefficiencies and Anti-Patterns

The provided React code has several inefficiencies and anti-patterns. Below is a detailed breakdown:

---

### **1. Undefined Variable (`lhsPriority`)**

#### **Issue:**

```ts
const balancePriority = getPriority(balance.blockchain);
if (lhsPriority > -99) { // lhsPriority is undefined
```

- `lhsPriority` is not defined anywhere, leading to a runtime error.

#### **Fix:**

- Replace `lhsPriority` with `balancePriority`.

---

### **2. Incorrect Filtering Logic in `useMemo`**

#### **Issue:**

```ts
if (balancePriority > -99) {
  if (balance.amount <= 0) {
    return true;
  }
}
return false;
```

- This logic retains balances with `amount <= 0`, which might be incorrect.

#### **Fix:**

```ts
return balancePriority > -99 && balance.amount > 0;
```

---

### **3. Inefficient Sorting in `useMemo`**

#### **Issue:**

```ts
.sorted((lhs: WalletBalance, rhs: WalletBalance) => {
  const leftPriority = getPriority(lhs.blockchain);
  const rightPriority = getPriority(rhs.blockchain);
  if (leftPriority > rightPriority) {
    return -1;
  } else if (rightPriority > leftPriority) {
    return 1;
  }
});
```

- Calls `getPriority` twice for each comparison, increasing computational cost.

#### **Fix:**

```ts
.sorted((lhs, rhs) => getPriority(rhs.blockchain) - getPriority(lhs.blockchain));
```

---

### **4. `formattedBalances` Not Used in `rows` Mapping**

#### **Issue:**

```ts
const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
  return {
    ...balance,
    formatted: balance.amount.toFixed(),
  };
});
```

- `rows` uses `sortedBalances`, missing formatted values.

#### **Fix:**

- Use `formattedBalances` instead of `sortedBalances` in `rows`.

---

### **5. Incorrect Type Assertion in `rows` Mapping**

#### **Issue:**

```ts
const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => { ... })
```

- `sortedBalances` is `WalletBalance`, but mapped as `FormattedWalletBalance`, causing a TypeScript error.

#### **Fix:**

- Use `formattedBalances` instead.

---

### **6. Inefficient `useMemo` Dependencies**

#### **Issue:**

```ts
}, [balances, prices]);
```

- `prices` is **not used in filtering or sorting**, causing unnecessary recomputation.

#### **Fix:**

```ts
}, [balances]);
```

---

## **Refactored Code**

```tsx
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: string): number => {
    const priorities: Record<string, number> = {
      Osmosis: 100,
      Ethereum: 50,
      Arbitrum: 30,
      Zilliqa: 20,
      Neo: 20,
    };
    return priorities[blockchain] ?? -99;
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter(
        (balance) => getPriority(balance.blockchain) > -99 && balance.amount > 0
      )
      .sort(
        (lhs, rhs) => getPriority(rhs.blockchain) - getPriority(lhs.blockchain)
      );
  }, [balances]);

  const formattedBalances: FormattedWalletBalance[] = sortedBalances.map(
    (balance) => ({
      ...balance,
      formatted: balance.amount.toFixed(2),
    })
  );

  const rows = formattedBalances.map((balance, index) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });

  return <div {...rest}>{rows}</div>;
};
