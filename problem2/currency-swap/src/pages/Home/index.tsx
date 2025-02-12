import React from "react";
import CurrencyForm from "../../features/currency/components/CurrencyForm";
import ListCurrency from "../../features/currency/components/ListCurrency";

const HomePage: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 min-lg:col-span-4">
          <CurrencyForm />
        </div>
        <div className="col-span-12 min-lg:col-span-8">
          <ListCurrency />
        </div>
      </div>
    </>
  );
};

export default HomePage;
