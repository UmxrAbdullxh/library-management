const privateRoutes = {
  'GET /users': 'UserController.getAll',
  'POST /remove': 'UserController.remove',
  'GET /editUser': 'UserController.editUser',
  'POST /update': 'UserController.update',
  'GET /addUser': 'UserController.addUser',
  'POST /addBook': 'BooksController.addBook',
  'GET /books': 'BooksController.getAll',
  'POST /updateBook': 'BooksController.update',
  'POST /removeBook': 'BooksController.remove',
  'GET /addBooks': 'BooksController.add',
};

module.exports = privateRoutes;
