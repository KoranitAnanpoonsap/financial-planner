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
