export const ctrlWrapper = (ctrl) => {
  const func = async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      // даємо експресу команду шукати обробник помилки (мідлвара з 4 параметрами)
      next(error);
      //   // якщо в помилки є поле статуя, то використовуємо його значення
      //   // якщо немає,то використовуємо статус 500
      //   const { status = 500 } = error;
      //   res.status(status).json({
      //     status,
      //     message: error.message,
      //   });
    }
  };
  return func;
};
