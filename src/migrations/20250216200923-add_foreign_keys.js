"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Users → Courses
    await queryInterface.addConstraint("Courses", {
      fields: ["instructorId"],
      type: "foreign key",
      name: "fk_courses_instructor",
      references: {
        table: "Users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // Courses → Modules
    await queryInterface.addConstraint("Modules", {
      fields: ["courseId"],
      type: "foreign key",
      name: "fk_modules_course",
      references: {
        table: "Courses",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // Modules → Lessons
    await queryInterface.addConstraint("Lessons", {
      fields: ["moduleId"],
      type: "foreign key",
      name: "fk_lessons_module",
      references: {
        table: "Modules",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // Modules → Tests
    await queryInterface.addConstraint("Tests", {
      fields: ["moduleId"],
      type: "foreign key",
      name: "fk_tests_module",
      references: {
        table: "Modules",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // Tests → TestResults
    await queryInterface.addConstraint("TestResults", {
      fields: ["testId"],
      type: "foreign key",
      name: "fk_testresults_test",
      references: {
        table: "Tests",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // Users → TestResults
    await queryInterface.addConstraint("TestResults", {
      fields: ["userId"],
      type: "foreign key",
      name: "fk_testresults_user",
      references: {
        table: "Users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // Users → Certificates
    await queryInterface.addConstraint("Certificates", {
      fields: ["userId"],
      type: "foreign key",
      name: "fk_certificates_user",
      references: {
        table: "Users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // Courses → Certificates
    await queryInterface.addConstraint("Certificates", {
      fields: ["courseId"],
      type: "foreign key",
      name: "fk_certificates_course",
      references: {
        table: "Courses",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // Users → ForumTopics
    await queryInterface.addConstraint("ForumTopics", {
      fields: ["userId"],
      type: "foreign key",
      name: "fk_forumtopics_user",
      references: {
        table: "Users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // ForumTopics → ForumComments
    await queryInterface.addConstraint("ForumComments", {
      fields: ["topicId"],
      type: "foreign key",
      name: "fk_forumcomments_topic",
      references: {
        table: "ForumTopics",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // Users → ForumComments
    await queryInterface.addConstraint("ForumComments", {
      fields: ["userId"],
      type: "foreign key",
      name: "fk_forumcomments_user",
      references: {
        table: "Users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Courses", "fk_courses_instructor");
    await queryInterface.removeConstraint("Modules", "fk_modules_course");
    await queryInterface.removeConstraint("Lessons", "fk_lessons_module");
    await queryInterface.removeConstraint("Tests", "fk_tests_module");
    await queryInterface.removeConstraint("TestResults", "fk_testresults_test");
    await queryInterface.removeConstraint("TestResults", "fk_testresults_user");
    await queryInterface.removeConstraint("Certificates", "fk_certificates_user");
    await queryInterface.removeConstraint("Certificates", "fk_certificates_course");
    await queryInterface.removeConstraint("ForumTopics", "fk_forumtopics_user");
    await queryInterface.removeConstraint("ForumComments", "fk_forumcomments_topic");
    await queryInterface.removeConstraint("ForumComments", "fk_forumcomments_user");
  },
};
