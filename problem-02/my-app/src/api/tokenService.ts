import axios from "axios";

const API_URL = "https://interview.switcheo.com/prices.json";

export const fetchTokenPrices = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error: any) {
    throw new Error("Failed to fetch token prices: " + error.message);
  }
};
