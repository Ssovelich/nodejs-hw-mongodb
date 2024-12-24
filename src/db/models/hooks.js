export const handleSaveError = (error, doc, next) => {
  error.status = 400;
  next();
};

//перед оновленням встанови
export const setUpdateSettings = function (next) {
  //пеовертати оновлений об'єкт
  this.options.new = true;
  // при оновленні робити перевірку
  this.options.runValidators = true;
  next();
};
