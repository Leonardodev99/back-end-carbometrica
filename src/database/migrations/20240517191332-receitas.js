'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Cria a tabela "receitas"
    await queryInterface.createTable('receitas', {
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
      modo_preparo: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      carboidrato: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  async down (queryInterface, Sequelize) {

    await queryInterface.dropTable('receitas');

  }
}
