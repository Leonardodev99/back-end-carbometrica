'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuarios', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tem_diabete: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tipo_de_diabete: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      usa_a_contagem: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: { // Alterado para created_at
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: { // Alterado para updated_at
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('usuarios');
  }
};
