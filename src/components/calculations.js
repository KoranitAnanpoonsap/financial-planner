export function calculatePortfolioSummary(assetsData) {
  let totalInvestAmount = 0
  let weightedReturnSum = 0

  for (const asset of assetsData) {
    totalInvestAmount += asset.investAmount
  }

  if (totalInvestAmount > 0) {
    for (const asset of assetsData) {
      const proportion = asset.investAmount / totalInvestAmount
      weightedReturnSum += proportion * asset.yearlyReturn
    }
  }

  const portReturn = parseFloat(weightedReturnSum.toFixed(4))

  return {
    totalInvestAmount,
    portReturn
  }
}

export function calculateYearlyIncome(incomes, year) {
  const details = []
  for (const income of incomes) {
    let amount = income.clientIncomeAmount
    if (income.clientIncomeFrequency === "ทุกเดือน") {
      amount *= 12
    }
    for (let y = 1; y < year; y++) {
      amount = amount * (1 + income.clientIncomeAnnualGrowthRate)
    }
    details.push({ [income.id.clientIncomeName]: amount.toFixed(2) })
  }
  return details
}

export function calculateYearlyExpense(expenses, year) {
  const details = []
  for (const expense of expenses) {
    let amount = expense.clientExpenseAmount
    if (expense.clientExpenseFrequency === "ทุกเดือน") {
      amount *= 12
    }
    for (let y = 1; y < year; y++) {
      amount = amount * (1 + expense.clientExpenseAnnualGrowthRate)
    }
    details.push({ [expense.id.clientExpenseName]: amount.toFixed(2) })
  }
  return details
}

export function calculateGoalPayments(goals, portfolioReturn, year) {
  const payments = []
  let anyPayment = false
  for (const goal of goals) {
    const clientGoalValue = goal.clientGoalValue
    const clientSavingGrowth = goal.clientSavingGrowth
    const clientGoalPeriod = goal.clientGoalPeriod

    let payment = 0
    if (year <= clientGoalPeriod) {
      const numerator = portfolioReturn - clientSavingGrowth
      const denom =
        Math.pow(1 + portfolioReturn, clientGoalPeriod) -
        Math.pow(1 + clientSavingGrowth, clientGoalPeriod)
      if (denom !== 0) {
        payment = clientGoalValue * (numerator / denom)
        anyPayment = true
      }
    }
    payments.push({ [goal.id.clientGoalName]: payment.toFixed(2) })
  }

  if (!anyPayment && goals.length === 0) {
    // if no goals at all
    payments.push({ "No Payments": "0.00" })
  }
  return payments
}

export function calculateGeneralGoal(generalGoal, totalInvestAmount, portReturn) {
  const period = generalGoal.clientGeneralGoalPeriod
  const goalValue = generalGoal.clientGeneralGoalValue
  const netIncomeGrowth = generalGoal.clientNetIncomeGrowth

  const fvOfCurrentInvestment = totalInvestAmount * Math.pow(1 + portReturn, period)
  // newGeneralGoalValue = goalValue - fvOfCurrentInvestment
  const newGeneralGoalValue = goalValue - fvOfCurrentInvestment

  const numerator = portReturn - netIncomeGrowth
  const denominator = Math.pow(1 + portReturn, period) - Math.pow(1 + netIncomeGrowth, period)

  let generalGoalAnnualSaving = 0
  if (denominator !== 0) {
    generalGoalAnnualSaving = newGeneralGoalValue * (numerator / denominator)
  }

  return {
    fvOfCurrentInvestment: parseFloat(fvOfCurrentInvestment.toFixed(2)),
    generalGoalAnnualSaving: parseFloat(generalGoalAnnualSaving.toFixed(2))
  }
}

export function calculateRetirementGoal(retirementGoalInfo, retiredExpensePortion) {
  const { clientCurrentAge, clientRetirementAge, clientLifeExpectancy, clientCurrentYearlyExpense, clientExpectedRetiredPortReturn, inflationRate } = retirementGoalInfo
  const currentAge = clientCurrentAge
  const retirementAge = clientRetirementAge
  const lifeExpectancy = clientLifeExpectancy
  const currentYearlyExpense = clientCurrentYearlyExpense
  const expectedRetPortReturn = clientExpectedRetiredPortReturn
  const inflation = inflationRate

  const yearsToRetirement = retirementAge - currentAge

  const bdCurrentExpense = currentYearlyExpense
  const bdInflationRate = inflation
  const bdExpectedRetPortReturn = expectedRetPortReturn
  const bdProportion = retiredExpensePortion

  // fvCurrentExpense = currentExpense * (1+inflation)^yearsToRetirement
  const fvCurrentExpense = bdCurrentExpense * Math.pow(1+bdInflationRate, yearsToRetirement)

  // discount_rate = ((1+expectedRetPortReturn)/(1+inflation)) - 1
  const discountRate = ((1+bdExpectedRetPortReturn)/(1+bdInflationRate))-1

  // newFvCurrentExpense = fvCurrentExpense * proportion
  const newFvCurrentExpense = fvCurrentExpense * bdProportion

  // retirementDuration = lifeExpectancy - retirementAge
  const retirementDuration = lifeExpectancy - retirementAge
  const onePlusDiscount = 1 + discountRate

  let retirementGoal
  if (discountRate === 0) {
    // If discount rate =0, retirement_goal = newFvCurrentExpense * retirementDuration
    retirementGoal = newFvCurrentExpense * retirementDuration
  } else {
    // retirement_goal = newFvCurrentExpense * [1 - 1/(1+discount_rate)^(duration)] / discountRate * (1+discount_rate)
    const denominatorDiscount = Math.pow(onePlusDiscount, retirementDuration)
    const factor = 1 - (1/denominatorDiscount)
    retirementGoal = newFvCurrentExpense * (factor / discountRate) * onePlusDiscount
  }

  return {
    discountRate,
    fvCurrentExpense,
    newFvCurrentExpense,
    retirementGoal
  }
}