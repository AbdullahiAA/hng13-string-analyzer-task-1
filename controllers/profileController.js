const User = require("../models/User");
const CatFactService = require("../services/catFactService");

class ProfileController {
  /**
   * GET /me endpoint handler
   * Returns user profile data along with a random cat fact
   */
  static async getProfile(req, res) {
    try {
      // Get user data
      const user = User.getCurrentUser();

      // Fetch cat fact
      const catFact = await CatFactService.getCatFact();

      const response = {
        status: "success",
        user: user.toJSON(),
        timestamp: new Date().toISOString(),
        fact: catFact,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error("Error in getProfile:", error?.message);

      // Even in case of error, return a valid response with fallback data
      const user = User.getCurrentUser();
      const fallbackFact = CatFactService.getFallbackMessage();

      res.status(200).json({
        status: "success",
        user: user.toJSON(),
        timestamp: new Date().toISOString(),
        fact: fallbackFact,
      });
    }
  }
}

module.exports = ProfileController;
