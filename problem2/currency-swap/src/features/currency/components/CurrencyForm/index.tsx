import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TCurrency } from "./typings";
import { useFetchAllCurrencies } from "../../hooks/useFetchAllCurrencies";
import { currencyValidationSchema } from "../../../../validations/currency";
import { toast } from "react-toastify";
import Loader from "../../../../components/Loader";

const CurrencyForm: React.FC = () => {
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [fromCurrency, setFromCurrency] = useState("ETH");
  const [toCurrency, setToCurrency] = useState("USDC");
  const [convertedAmount, setConvertedAmount] = useState<string>("0");
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const { data: listCurrencies, isSuccess } = useFetchAllCurrencies();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(currencyValidationSchema),
  });

  const amount = watch("amount");

  useEffect(() => {
    if (isSuccess && listCurrencies) {
      const priceMap: Record<string, number> = {};
      listCurrencies.forEach(({ currency, price }: TCurrency) => {
        priceMap[currency] = price;
      });

      setCurrencies(Object.keys(priceMap));
      setPrices(priceMap);
    }
  }, [listCurrencies, isSuccess]);

  useEffect(() => {
    if (amount && prices[fromCurrency] && prices[toCurrency]) {
      const rate = prices[toCurrency] / prices[fromCurrency];
      setConvertedAmount((Number(amount) * rate).toFixed(6));
    } else {
      setConvertedAmount("0");
    }
  }, [amount, fromCurrency, toCurrency, prices]);

  const onSubmit = (data: any) => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast.success(
        `Swapped ${data.amount} ${fromCurrency} to ${convertedAmount} ${toCurrency}`,
        { position: "top-center" }
      );
    }, 500);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 bg-gray-800 shadow-lg text-white rounded-xl mx-auto"
    >
      <h2 className="text-xl font-semibold mb-4 text-center">Currency Swap</h2>
      <div className="space-y-3">
        <label className="block">Amount to send</label>
        <div className="relative flex items-center gap-2 border border-solid bg-[hsla(0,0%,100%,.01)] shadow-[0_0_18.6px_-5px_rgba(123,175,253,.13),inset_0_0_5px_1px_#7baffd,inset_0_0_15px_4px_rgba(123,175,253,.2),inset_0_0_80px_10px_rgba(123,175,253,.1)] backdrop-blur-[20px] sm:text-sm rounded-lg w-full p-2.5 border-gray-600 placeholder-gray-400 dark:text-white">
          <input
            type="number"
            {...register("amount")}
            className="w-full border-none outline-none rounded bg-transparent"
            placeholder="Enter the amount"
          />
        </div>
        {errors.amount && (
          <p className="text-red-500 text-sm">{errors.amount.message}</p>
        )}

        <div className="relative flex items-center gap-2 border border-solid bg-[hsla(0,0%,100%,.01)] shadow-[0_0_18.6px_-5px_rgba(123,175,253,.13),inset_0_0_5px_1px_#7baffd,inset_0_0_15px_4px_rgba(123,175,253,.2),inset_0_0_80px_10px_rgba(123,175,253,.1)] backdrop-blur-[20px] sm:text-sm rounded-lg w-full p-2.5 border-gray-600 placeholder-gray-400 dark:text-white">
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="w-full border-none outline-none rounded"
          >
            {currencies.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3 mt-4">
        <label className="block mb-2">Amount to receive</label>
        <div className="relative flex items-center gap-2 border border-solid bg-[hsla(0,0%,100%,.01)] shadow-[0_0_18.6px_-5px_rgba(123,175,253,.13),inset_0_0_5px_1px_#7baffd,inset_0_0_15px_4px_rgba(123,175,253,.2),inset_0_0_80px_10px_rgba(123,175,253,.1)] backdrop-blur-[20px] sm:text-sm rounded-lg w-full p-2.5 border-gray-600 placeholder-gray-400 dark:text-white">
          <input
            type="text"
            value={convertedAmount}
            disabled
            className="w-full border-none outline-none rounded bg-transparent"
          />
        </div>

        <div className="relative flex items-center gap-2 border border-solid bg-[hsla(0,0%,100%,.01)] shadow-[0_0_18.6px_-5px_rgba(123,175,253,.13),inset_0_0_5px_1px_#7baffd,inset_0_0_15px_4px_rgba(123,175,253,.2),inset_0_0_80px_10px_rgba(123,175,253,.1)] backdrop-blur-[20px] sm:text-sm rounded-lg w-full p-2.5 border-gray-600 placeholder-gray-400 dark:text-white">
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="w-full border-none outline-none rounded"
          >
            {currencies.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg font-semibold"
      >
        {loading ? <Loader /> : "Confirm Swap"}
      </button>
    </form>
  );
};

export default CurrencyForm;
