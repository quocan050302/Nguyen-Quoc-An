/* Explanation of Key Improvements:
- Combined Filter, Sort, and Map: The filtering, sorting, and mapping steps are combined into a single useMemo hook to 
  improve readability and ensure that they are performed together, reducing unnecessary re-renders.
- Correct Dependency Management: Both balances and prices are included in the dependency 
  array for useMemo to ensure the memoized value updates correctly when either of these dependencies changes.
- Efficient Calculation: The usdValue is calculated during the mapping step, ensuring that 
  all necessary transformations are performed in a single loop. Improved Type Safety: The blockchain property is added 
  to the WalletBalance interface to ensure the correct usage of the property throughout the component.
*/


interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
  usdValue: number;
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances(); 
  const prices = usePrices();

  const getPriority = (blockchain: string): number => {
    // Priority assignment for blockchains
    switch (blockchain) {
      case 'Osmosis':
        return 100;
      case 'Ethereum':
        return 50;
      case 'Arbitrum':
        return 30;
      case 'Zilliqa':
        return 20;
      case 'Neo':
        return 20;
      default:
        return -99;
    }
  };

  const processedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const priority = getPriority(balance.blockchain);
        return priority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        return rightPriority - leftPriority;
      })
      .map((balance: WalletBalance) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return {
          ...balance,
          formatted: balance.amount.toFixed(), 
          usdValue,
        };
      });
  }, [balances, prices]); 

  const rows = processedBalances.map((balance: FormattedWalletBalance, index: number) => (
    <WalletRow 
      className={classes.row}
      key={index}
      amount={balance.amount}
      usdValue={balance.usdValue} 
      formattedAmount={balance.formatted}
    />
  ));

  return (
    <div {...rest}>
      {rows}
    </div>
  );
};
