const axios = require("axios");
const {
  CAT_FACT_API_URL,
  API_TIMEOUT,
  FALLBACK_MESSAGES,
} = require("../config/constants");

class CatFactService {
  /**
   * Fetches a random cat fact from the Cat Facts API
   * @returns {Promise<string>} A cat fact string
   */
  static async getCatFact() {
    try {
      const response = await axios.get(CAT_FACT_API_URL, {
        timeout: API_TIMEOUT,
      });

      const fact = response?.data?.fact;

      if (!fact) {
        throw new Error("No fact in response");
      }

      return fact;
    } catch (error) {
      console.error("Error fetching cat fact:", error?.message);
      return this.getFallbackMessage();
    }
  }

  /**
   * Returns a random fallback message when the API fails
   * @returns {string} A fallback cat fact
   */
  static getFallbackMessage() {
    const randomMessage =
      FALLBACK_MESSAGES[Math.floor(Math.random() * FALLBACK_MESSAGES.length)];
    return `${randomMessage} (Cat Facts API temporarily unavailable)`;
  }
}

module.exports = CatFactService;
