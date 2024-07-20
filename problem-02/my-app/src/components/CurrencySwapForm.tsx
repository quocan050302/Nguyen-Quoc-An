import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import "../styles/form.css";
import { fetchTokenPrices } from "../api/tokenService";
import ClipLoader from "react-spinners/ClipLoader";

type FormValues = {
  currency: string;
  date: string;
  price: number;
};

const CurrencySwapForm = () => {
  const [fromCurrency, setFromCurrency] = useState<string>("");
  const [toCurrency, setToCurrency] = useState<string>("");
  const [amount, setAmount] = useState<number | string>("");
  const [result, setResult] = useState<string | null>(null);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);

  const {
    data: prices,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["tokenPrices"],
    queryFn: fetchTokenPrices,
  });

  if (isLoading) return <p>Loading...</p>;

  if (error) {
    const errorMessage = (error as Error).message;
    return <p>Error: {errorMessage}</p>;
  }

  const latestPrices: Record<string, { price: number; date: string }> = {};

  prices.forEach((priceEntry: FormValues) => {
    const existingPrice = latestPrices[priceEntry.currency];
    if (
      !existingPrice ||
      new Date(priceEntry.date) > new Date(existingPrice.date)
    ) {
      latestPrices[priceEntry.currency] = {
        price: priceEntry.price,
        date: priceEntry.date,
      };
    }
  });

  const tokens = Object.keys(latestPrices);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !fromCurrency ||
      !toCurrency ||
      !amount ||
      isNaN(Number(amount)) ||
      Number(amount) < 0.01
    ) {
      setResult("Please fill out all fields with valid values.");
      return;
    }

    setIsLoadingBtn(true);
    setTimeout(() => {
      const fromPrice = latestPrices[fromCurrency]?.price;
      const toPrice = latestPrices[toCurrency]?.price;

      if (fromPrice == null || toPrice == null) {
        setResult("Invalid currency selected.");
        return;
      }

      const swappedAmount = (Number(amount) * fromPrice) / toPrice;
      console.log("amount", swappedAmount.toFixed(2));

      setResult(`You will receive ${swappedAmount.toFixed(2)} ${toCurrency}.`);
      setIsLoadingBtn(false);
    }, 2000);
  };

  return (
    <div className="form-container">
      <h2>Currency Swap</h2>
      <form onSubmit={onSubmit}>
        <div className="form-field">
          <label htmlFor="fromCurrency">From Currency</label>
          <select
            id="fromCurrency"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            <option value="">Select Currency</option>
            {tokens.map((token) => (
              <option key={token} value={token}>
                {token} - ${latestPrices[token]?.price.toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="toCurrency">To Currency</label>
          <select
            id="toCurrency"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            <option value="">Select Currency</option>
            {tokens.map((token) => (
              <option key={token} value={token}>
                {token} - ${latestPrices[token]?.price.toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <button type="submit">
          {isLoadingBtn ? (
            <div className="loading-indicator">
              <ClipLoader color="#4110e5" size={10} />
            </div>
          ) : (
            "Swap"
          )}
        </button>
      </form>

      {result && <p className="result">{result}</p>}
    </div>
  );
};

export default CurrencySwapForm;
