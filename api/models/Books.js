const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'books';

const Books = sequelize.define('Books', {
  title: {
    type: Sequelize.STRING,
    unique: true,
  },
  isbn: {
    type: Sequelize.STRING,
  },
  author: {
    type: Sequelize.STRING,
  },
  status: {
    type: Sequelize.STRING,
  },
  borrowedBy: {
    type: Sequelize.STRING,
  },
}, {tableName});

// eslint-disable-next-line
Books.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  //delete values.password;

  return values;
};

module.exports = Books;
