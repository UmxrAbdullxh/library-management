function addUsers(event) {
  event.preventDefault()
  var token = localStorage.getItem("token");
  console.log('=== [users.html]:: token ===', token , typeof(token));
  window.location.href = '/private/addUser/?token=' + token
}

function getBooks(event) {
  event.preventDefault()
  var token = localStorage.getItem("token");
  console.log('=== [users.html]:: token ===', token , typeof(token));
  window.location.href = '/private/books/?token=' + token
}

function addBooks(event) {
  event.preventDefault()
  var token = localStorage.getItem("token");
  console.log('=== [users.html]:: token ===', token , typeof(token));
  window.location.href = '/private/addBooks/?token=' + token
}

function getUsers(event) {
  event.preventDefault()
  var token = localStorage.getItem("token");
  console.log('=== [users.html]:: token ===', token , typeof(token));
  window.location.href = '/private/users?token=' + token
}

function getHome(event) {
  event.preventDefault()
  var token = localStorage.getItem("token");
  console.log('=== [users.html]:: token ===', token , typeof(token));
  window.location.href = '/private/home?token=' + token
}