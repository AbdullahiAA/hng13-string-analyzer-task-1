const crypto = require("crypto");

const isPalindrome = (value) => {
  const _value = value.toLowerCase().split(" ").join("");
  const reversedValue = _value.split("").reverse().join("");

  return _value === reversedValue;
};

const createSha256Hash = (value) => {
  return crypto.createHash("sha256").update(value).digest("hex");
};

module.exports = {
  isPalindrome,
  createSha256Hash,
};
