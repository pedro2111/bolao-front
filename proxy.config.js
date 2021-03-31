const proxy = [
    {
      context: '/api',
      target: 'http://localhost:8080',
      //target: 'https://cozinhadarosa.herokuapp.com',
      pathRewrite: {'^/api' : ''},
      secure: false,
      changeOrigin: true
    }
  ];
  module.exports = proxy;