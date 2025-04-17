'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Modules", "videoUrl", {
      type: Sequelize.STRING,
      allowNull: true,
      validate: { isUrl: true },
    });

    await queryInterface.addColumn("Modules", "materialsUrl", {
      type: Sequelize.STRING,
      allowNull: true,
      validate: { isUrl: true },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Modules", "videoUrl");
    await queryInterface.removeColumn("Modules", "materialsUrl");
  }
};
