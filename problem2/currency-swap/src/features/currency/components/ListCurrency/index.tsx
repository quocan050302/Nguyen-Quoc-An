import React, { useState } from "react";
import { TCurrency } from "../CurrencyForm/typings";
import { useFetchAllCurrencies } from "../../hooks/useFetchAllCurrencies";

const ListCurrency: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: listCurrencies } = useFetchAllCurrencies();

  const filteredCurrencies: TCurrency[] = listCurrencies?.filter(
    ({ currency }: TCurrency) =>
      currency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 bg-gray-800 shadow-lg text-white rounded-xl max-h-[94vh] overflow-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">
        List of Currencies
      </h2>

      <input
        type="text"
        placeholder="Search currency..."
        className="w-full p-2 mb-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 outline-none border border-gray-600 focus:ring-2 focus:ring-blue-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ul className="space-y-3">
        {filteredCurrencies?.map(({ currency, price, date }) => (
          <li
            key={currency}
            className="flex flex-col gap-1 p-3 bg-gray-700 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <img
                src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${currency}.svg`}
                alt={currency}
                className="w-6 h-6"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/24";
                }}
              />
              <span className="text-lg font-medium">{currency}</span>
              <span className="ml-auto text-gray-300">
                ${price?.toFixed(2)}
              </span>
            </div>

            <span className="text-xs text-gray-400">
              {new Date(date as Date).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListCurrency;
