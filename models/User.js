class User {
  constructor(email, name, stack) {
    this.email = email;
    this.name = name;
    this.stack = stack;
  }

  // Get user data as plain object
  toJSON() {
    return {
      email: this.email,
      name: this.name,
      stack: this.stack,
    };
  }

  // Static method to get current user 
  static getCurrentUser() {
    return new User(
      "osuolaleabdullahi@gmail.com",
      "Jelili Abdullahi A.",
      "Node.js/Express"
    );
  }
}

module.exports = User;
