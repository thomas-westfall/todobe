const Sequelize = require('sequelize');
const db = require('../db');

const Todo = db.define("todo", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },

  description: {
    type: Sequelize.STRING,
  },

});

module.exports = Todo;