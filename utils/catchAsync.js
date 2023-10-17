//helper function handle all the catch part of an asycn function
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => next(error));
  };
};
