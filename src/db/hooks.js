//перед оновленням встанови
export const setUpdateSettinds = function (next) {
  //пеовертати оновлений об'єкт
  this.options.new = true;
  // при оновленні робити перевірку
  this.options.runValidators = true;
  next();
};
