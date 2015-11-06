module.exports = function(Category) {
  Category.validatesUniquenessOf('name', {message: 'name is not unique'});
};


