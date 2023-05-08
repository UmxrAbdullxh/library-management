const User = require('../models/User');
const authService = require('../services/auth.service');
const bcryptService = require('../services/bcrypt.service');
const Util = require('../../utils/utils')
const bcrypt = require('bcrypt-nodejs');
const { async } = require('rxjs');

const UserController = () => {
  const register = async (req, res) => {
    const { body } = req;
    console.log('=== [UserController.js]:: body ===', body , typeof(body));
    let tCheck = await Util.Validate(body, {
      username: 'required|string',
      password: 'required',
      password2: 'required',
      type: 'required|string'
    })

    if( tCheck && tCheck.status == 404) {
      return res.status(404).json({ msg: tCheck.error });
    }
    
    if (body.password === body.password2) {
      try {
        const user = await User.create({
          username: body.username,
          password: body.password,
          type: body.type,
          status: 1
        });
        const token = authService().issue({ id: user.id });

        return res.status(200).json({ token, user });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Internal server error' });
      }
    }

    return res.status(400).json({ msg: 'Bad Request: Passwords don\'t match' });
  };

  const login = async (req, res) => {
    const { body } = req;
    let tCheck = await Util.Validate(body, {
      username: 'required|string',
      password: 'required',
    })

    if( tCheck && tCheck.status == 404) {
      return res.status(404).json({ msg: tCheck.error });
    }
    
    //console.log('=== [UserController.js]:: body ===', body , typeof(body));
    const { username, password } = body;
    console.log('=== [UserController.js]:: username ===', username , typeof(username));
    if (username && password) {
      try {
        const user = await User
          .findOne({
            where: {
              username,
            },
          });

        if (!user) {
          return res.status(400).json({ msg: 'Bad Request: User not found' });
        }

        if (bcryptService().comparePassword(password, user.password)) {
          const token = authService().issue({ id: user.id });

          return res.status(200).json({ token, user });
        }

        return res.status(401).json({ msg: 'Password did not match' });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Internal server error' });
      }
    } else {
      return res.status(400).json({ msg: 'Bad Request: Username or password is wrong' });
    }

  };

  const validate = (req, res) => {
    const { token } = req.body;

    authService().verify(token, (err) => {
      if (err) {
        return res.status(401).json({ isvalid: false, err: 'Invalid Token!' });
      }

      return res.status(200).json({ isvalid: true });
    });
  };

  const getAll = async (req, res) => {
    try {
      console.log('Made request')
      console.log('=== [UserController.js]:: req.userInfo ===', req.userInfo , typeof(req.userInfo));
      let userInfo = req.userInfo;
      const users = await User.findAll();

      //return res.status(200).json({ users });
      return res.render("users.html", {
        users,
        userInfo
      })
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const update = async ( req, res ) => {
    const { body } = req;
    let tCheck = await Util.Validate(body, {
      id: 'required|integer',
    })

    if( tCheck && tCheck.status == 404) {
      return res.status(404).json({ msg: tCheck.error });
    }

    const { id } = body;
    // const { username, password} = body;

    try {
      const user = await User
        .findOne({
          where: {
            id,
          },
        });

      if (!user) {
        return res.status(400).json({ msg: 'Bad Request: User not found' });
      }

      if( body.password ) {
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt);

        body.password = hash;
      }

      delete body.id;
      let updateObj = {
        ...body,
      }
      console.log('=== [UserController.js]:: updateObj ===', updateObj , typeof(updateObj));
      await user.update(updateObj);
      return res.status(200).json({ msg: 'Update succesfuul', user });
    } catch (error) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
    
  }

  const remove = async (req, res) => {
    const { body } = req;
    let tCheck = await Util.Validate(body, {
      id: 'required|integer',
    })

    if( tCheck && tCheck.status == 404) {
      return res.status(404).json({ msg: tCheck.error });
    }

    const { id } = body;

    try {
      await User.destroy({
        where : {
          id
        }
      })
      return res.status(200).json({ msg: 'User delete succesfuul'});
    } catch( error ) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  }

  const getRegister = async ( req, res) => {
    //console.log('=== [UserController.js]:: req ===', req , typeof(req));
    return res.render("index.html");
  }

  const getLogin = async ( req, res) => {
    //console.log('=== [UserController.js]:: req ===', req , typeof(req));
    return res.render("login.html");
  }

  const home = async (req, res) => {
    let userInfo = req.userInfo
    //console.log('=== [UserController.js]:: req.query ===', req.query , typeof(req.query));
    authService().verify(req.query.token, (err) => {
      if (err) {
        return {
          msg: 'Not Valid',
          status: 401
        }
      }

      console.log('=== [UserController.js]:: userInfo ===', userInfo , typeof(userInfo));
      return res.render("home.html", {
        userInfo
      });
    });
  }

  const editUser = async (req, res) => {
    console.log('=== [UserController.js]:: req.query ===', req.query , typeof(req.query));
    try {
      let id = req.query.id
      const user = await User
        .findOne({
          where: {
            id
          },
        });
      return res.render("userEdit.html", {
        user
      });
    } catch ( error ) {
      console.log(error);
    }
  }

  const addUser = async (req, res) => {
    console.log('=== [UserController.js]:: req ===', req , typeof(req));
    res.render('addUser.html')
  }


  return {
    register,
    login,
    validate,
    getAll,
    update,
    remove,
    getRegister,
    getLogin,
    home,
    editUser,
    addUser
  };
};

module.exports = UserController;
