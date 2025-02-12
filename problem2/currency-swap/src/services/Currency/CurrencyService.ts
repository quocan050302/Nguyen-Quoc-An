import axios from "axios";
import { ENDPOINTS } from "../../constants/endpoints";

export default class CurrencyService {
  static async getAllCurrency() {
    try {
      const res = await axios.get(ENDPOINTS.FETCH_ALL_CURRENCY);
      return res.data;
    } catch (error) {
      console.error("Error fetching currencies:", error);
      throw error;
    }
  }
}
