const Sequelize = require('sequelize');
const db = require('../db');

const Todo = db.define("todo", {
  content: {
    type: Sequelize.STRING,
    allowNull: false
  },

  status: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },

});

module.exports = Todo;