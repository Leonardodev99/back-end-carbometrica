'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('ingredientes', {
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
      quantidade: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      carboidrato_por_grama: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      receita_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'receitas',
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

     await queryInterface.dropTable('ingredientes');

  }
};
