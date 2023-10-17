const catchAsync = require('../utils/catchAsync');
const { priceList } = require('../utils/constants');

const getRecommendedSolution = (amount) => {
  if (amount < 1500) {
    return priceList.find((item) => item?.size === 'small');
  } else if (amount > 1500 && amount < 3000) {
    return priceList.find((item) => item?.size === 'medium');
  } else if (amount > 3000 && amount < 5000) {
    return priceList.find((item) => item?.size === 'large');
  } else {
    return priceList.find((item) => item?.size === 'extra large');
  }
};

const calcuateMonthlyConsumption = (amount) => {
  if (amount > process.env.LOWER_RANGE_TARIFF * 600) {
    return (
      (amount - process.env.LOWER_RANGE_TARIFF * 600) /
        process.env.UPPER_RANGE_TARIFF +
      600
    );
  } else {
    return amount / process.env.LOWER_RANGE_TARIFF;
  }
};

const calculateSaving = (consumption, avgDailyCost) => {
  const expectedMonthly = avgDailyCost * 30;
  if (consumption < 600) {
    return expectedMonthly * process.env.LOWER_RANGE_TARIFF;
  } else if (consumption - expectedMonthly > 599) {
    return expectedMonthly * process.env.UPPER_RANGE_TARIFF;
  } else {
    const x = (consumption - 600) * process.env.UPPER_RANGE_TARIFF;
    const y = consumption - expectedMonthly;

    return x + (600 - y) * process.env.LOWER_RANGE_TARIFF;
  }
};

//method: create and sign our token
exports.computeSolutionName = (req, res, next) => {
  const { amount } = req.body;
  const solution = getRecommendedSolution(amount);
  const monthlyConsumption = Math.ceil(calcuateMonthlyConsumption(amount));
  console.log(`Monthly consumption: ${monthlyConsumption}`);
  const savings = Math.floor(
    calculateSaving(monthlyConsumption, solution.avgDailyProd)
  );
  console.log(`Monthly savings: ${savings}`);

  req.solution = solution.size;
  req.solutionPrice = solution.costCurrent;
  req.monthlyConsumption = monthlyConsumption;
  req.savings = savings;
  req.total = amount - savings + solution.costCurrent;
  //everything OK, send to client
  next();
};

//method for calculating energy consumption
exports.calculate = catchAsync(async (req, res, next) => {
  const { amount } = req.body;

  console.log(`This is the incoming amount: ${amount}`);

  //everything OK, send to client
  res.status(200).json({
    status: 'success',
    data: {
      message: 'Everything went well my dawg ...',
      amount: amount,
      solution: req.solution,
      solutionPrice: req.solutionPrice,
      savingsGoSolr: req.savings,
      costTotal: req.total,
    },
  });
});
