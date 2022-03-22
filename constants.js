module.exports.Routes = {
  home: '/home',
  login: '/auth/login',
  signup: '/auth/signup',
  admin: '/admin',
  inventory: '/admin/inventory',
  addbook: '/books/add',
  updateBook: '/books/update',
  wishlist: '/wishlist'
}

module.exports.Messages = {
  loginSuccess: {
    type: 'success',
    message: 'Successfully logged in!'
  },
  signupSuccess: {
    type: 'success',
    message: 'Successfully signed up! Please login to continue.'
  },
  usernameAlreadyExists: {
    type: 'error',
    message: 'Username already Exists. Please try different username'
  },
  emailAlreadyExists: {
    type: 'error',
    message: 'An account with this email already exists.'
  },
  incorrectEmailOrPassword: {
    type: 'error',
    message: 'Incorrect Email or password please try again.'
  },
  logout: {
    type: 'success',
    message: 'Successfully logged out'
  },
  addBookSuccess: {
    type: 'success',
    message: 'Successfully added book'
  },
  removeBookSuccess: {
    type: 'success',
    message: 'Sucessfully removed book'
  },
  addWishlistSuccess: {
    type: 'success',
    message: 'Succesfully added to wishlist'
  },
  removeFromWishlistSuccess: {
    type: 'success',
    message: 'Succesfully removed from wishlist'
  },
  addToCartSuccess: {
    type: 'success',
    message: 'Succesfully added to cart'
  },
  removeFromCartSuccess: {
    type: 'success',
    message: 'Succesfully removed from cart'
  },
  error: {
    type: "error",
    message: "There was a problem. Please try again."
  }
}

module.exports.Roles = {
  USER: 'user',
  ADMIN: 'admin'
}