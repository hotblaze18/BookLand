module.exports.Routes = {
  home: '/home',
  login: '/auth/login',
  signup: '/auth/signup'
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
  error: {
    type: "error",
    message: "There was a problem. Please try again."
  }
}