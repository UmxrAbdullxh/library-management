const Books = require('../models/Books')
const Util = require('../../utils/utils')

const BooksController = () => {
  const addBook = async (req, res) => {
    const { body } = req;
    console.log('=== [BooksController.js]:: body ===', body , typeof(body));
    let tCheck = await Util.Validate(body, {
      title: 'required|string',
      isbn: 'required|string',
      author: 'required|string',
      status: 'required|string'
    })

    if( tCheck && tCheck.status == 404) {
      return res.status(404).json({ msg: tCheck.error });
    }

    try {
      let book = await Books.create({
        title: body.title,
        isbn: body.isbn,
        author: body.author,
        status: body.status
      })

      console.log('=== [BooksController.js]:: book ===', book , typeof(book));
      return res.status(200).json({ book });
    } catch( error) {
      console.log(error)
      return res.status(500).json({ msg: 'Internal server error' });
    }
  }

  const getAll = async (req, res) => {
    try {
      console.log('Made request')
      console.log('=== [UserController.js]:: req.userInfo ===', req.userInfo , typeof(req.userInfo));
      let userInfo = req.userInfo;
      const books = await Books.findAll();

      //return res.status(200).json({ users });
      return res.render("books.html", {
        books,
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
      //status: 'required|string'
    })

    if( tCheck && tCheck.status == 404) {
      return res.status(404).json({ msg: tCheck.error });
    }

    const { id } = body;
    // const { username, password} = body;

    try {
      const book = await Books
        .findOne({
          where: {
            id,
          },
        });

      if (!book) {
        return res.status(400).json({ msg: 'Bad Request: Book not found' });
      }

      delete body.id;
      if( book.status == 'available') {
        body.status = 'issued'
      } else {
        body.status = 'available'
      }
      let updateObj = {
        ...body,
      }
      console.log('=== [UserController.js]:: updateObj ===', updateObj , typeof(updateObj));
      await book.update(updateObj);
      return res.status(200).json({ msg: 'Update succesfuul', book });
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
      await Books.destroy({
        where : {
          id
        }
      })
      return res.status(200).json({ msg: 'Book delete succesfuul'});
    } catch( error ) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  }

  const add = async (req, res) => {
    res.render('addBook.html')
  }

  return {
    addBook,
    getAll,
    update,
    remove,
    add
  }
}

module.exports = BooksController;