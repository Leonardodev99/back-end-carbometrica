'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('usuarios', 'cuida_diabete', {
      type: Sequelize.STRING,
      allowNull: false
    });
  },

  /*down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('usuarios', 'age');
  }*/

};
