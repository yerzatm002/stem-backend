"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        email: "admin@example.com",
        password: "$2b$10$dtb3aSO0hl9Zhqu00djWWezjBE6ij/OGO1b1pjKvfbqlG9lYOFoxe",
        role: "admin",
        name: "Admin User",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "user@example.com",
        password: "$2b$10$ncniYrIuwHt8aQVUfwnptOQj55iJZZporiJfDEwBZ6KggkBHdVxai",
        role: "user",
        name: "Test User",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
