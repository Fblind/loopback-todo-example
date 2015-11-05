module.exports = function(server) {

  var config = {
   dataSource: 'db',
   public: true
  };
  server.model('Category', config);


};

