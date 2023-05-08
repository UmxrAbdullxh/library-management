const publicRoutes = {
  'POST /user': 'UserController.register',
  'POST /register': 'UserController.register', // alias for POST /user
  'POST /login': 'UserController.login',
  'POST /validate': 'UserController.validate',
  'GET /register': 'UserController.getRegister',
  'GET /getLogin': 'UserController.getLogin',
  'GET /home': 'UserController.home',
};

module.exports = publicRoutes;
