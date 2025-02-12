import { useQuery } from "@tanstack/react-query";
import CurrencyService from "../../../services/Currency/CurrencyService";
import { QUERY_KEY } from "../../../constants/query";

export const useFetchAllCurrencies = () => {
  return useQuery({
    queryKey: [QUERY_KEY.CURRENCY],
    queryFn: () => CurrencyService.getAllCurrency(),
  });
};
