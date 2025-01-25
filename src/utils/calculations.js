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

    // If frequency is monthly, multiply by 12 to get annual amount
    if (income.clientIncomeFrequency === 1) {
      amount *= 12
    } else if (income.clientIncomeFrequency === 3) {
      // If frequency is lump-sum, only year 1 has the income; other years are 0
      amount = year === 1 ? amount : 0
    }

    // Apply annual growth rate for years beyond the first year
    if (year > 1 && income.clientIncomeFrequency !== 3) {
      for (let y = 1; y < year; y++) {
        amount *= (1 + income.clientIncomeAnnualGrowthRate)
      }
    }

    details.push({ [income.clientIncomeName]: amount.toFixed(2) })
  }
  return details
}

export function calculateYearlyExpense(expenses, year) {
  const details = []
  for (const expense of expenses) {
    let amount = expense.clientExpenseAmount

    // If frequency is monthly, multiply by 12 to get annual amount
    if (expense.clientExpenseFrequency === 1) {
      amount *= 12
    } else if (expense.clientExpenseFrequency === 3) {
      // If frequency is lump-sum, only year 1 has the expense; other years are 0
      amount = year === 1 ? amount : 0
    }

    // Apply annual growth rate for years beyond the first year
    if (year > 1 && expense.clientExpenseFrequency !== 3) {
      for (let y = 1; y < year; y++) {
        amount *= (1 + expense.clientExpenseAnnualGrowthRate)
      }
    }

    details.push({ [expense.clientExpenseName]: amount.toFixed(2) })
  }
  return details
}

export function calculateGoalPayments(goals, portfolioReturn, expenses, year) {
  const payments = []
  let anyPayment = false

  // Find the annual growth rate from expenses where clientExpenseType is "รายจ่ายเพื่อการออม"
  const savingExpense = expenses.find(exp => exp.clientExpenseType === 3)
  const clientSavingGrowth = savingExpense ? savingExpense.clientExpenseAnnualGrowthRate : 0

  for (const goal of goals) {
    const clientGoalValue = goal.clientGoalValue
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

    for (let y = 1; y < year; y++) {
      payment *= 1 + clientSavingGrowth
    }

    payments.push({ [goal.clientGoalName]: payment.toFixed(2) })
  }

  if (!anyPayment && goals.length === 0) {
    // If no goals at all
    payments.push({ "No Payments": "0.00" })
  }
  return payments
}


export function calculateGoal(Goal) {
  const period = Goal.goalPeriod
  const goalValue = Goal.goalValue
  const netIncomeGrowth = Goal.netIncomeGrowth
  const totalInvestment = Goal.totalInvestment
  const portReturn = Goal.portReturn

  const fvOfCurrentInvestment = totalInvestment * Math.pow(1 + portReturn, period)
 
  const newGoalValue = goalValue - fvOfCurrentInvestment

  const numerator = portReturn - netIncomeGrowth
  const denominator = Math.pow(1 + portReturn, period) - Math.pow(1 + netIncomeGrowth, period)

  let GoalAnnualSaving = 0
  if (denominator !== 0) {
    GoalAnnualSaving = newGoalValue * (numerator / denominator)
  }

  return {
    fvOfCurrentInvestment: parseFloat(fvOfCurrentInvestment.toFixed(2)),
    GoalAnnualSaving: parseFloat(GoalAnnualSaving.toFixed(2))
  }
}

export function calculateRetirementGoal(retirementGoalInfo, retiredExpensePortion) {
  const { clientCurrentAge, clientRetirementAge, clientLifeExpectancy, clientCurrentYearlyExpense, clientExpectedRetiredPortReturn, inflationRate } = retirementGoalInfo

  const yearsToRetirement = clientRetirementAge - clientCurrentAge

  // fvCurrentExpense = currentExpense * (1+inflation)^yearsToRetirement
  const fvCurrentExpense = clientCurrentYearlyExpense * Math.pow(1+inflationRate, yearsToRetirement)

  // discount_rate = ((1+expectedRetPortReturn)/(1+inflation)) - 1
  const discountRate = ((1+clientExpectedRetiredPortReturn)/(1+inflationRate))-1

  // newFvCurrentExpense = fvCurrentExpense * proportion
  const newFvCurrentExpense = fvCurrentExpense * retiredExpensePortion

  // retirementDuration = lifeExpectancy - retirementAge
  const retirementDuration = clientLifeExpectancy - clientRetirementAge
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

export function computeVariables(incomes, expenses, assets, debts) {
  const annualIncome = incomes.map((i) => {
    // If frequency is monthly, multiply by 12 to get annual amount
    const amt = i.clientIncomeFrequency === 1
      ? i.clientIncomeAmount * 12
      : i.clientIncomeAmount
    return { type: i.clientIncomeType, amt }
  })
  const totalIncome = annualIncome.reduce((sum, a) => sum + a.amt, 0)

  const annualExpense = expenses.map((e) => {
    // If frequency is monthly, multiply by 12 to get annual amount
    const amt = e.clientExpenseFrequency === 1
      ? e.clientExpenseAmount * 12
      : e.clientExpenseAmount
    return { ...e, amt }
  })
  const totalExpense = annualExpense.reduce((sum, e) => sum + e.amt, 0)
  const netIncome = totalIncome - totalExpense

  let monthlyExpense = 0
  for (const e of expenses) {
    let amt = e.clientExpenseAmount
    // If frequency is monthly, divide by 12 to get monthly amount
    if (e.clientExpenseFrequency === 2) amt = amt / 12
    monthlyExpense += amt
  }

  const savingExpenses = annualExpense
    .filter((e) => e.clientSavingExpense === true)
    .reduce((sum, e) => sum + e.amt, 0)
  const savings = savingExpenses + (netIncome > 0 ? netIncome : 0)

  const totalLiquidAssets = assets
  // Filter out liquid assets
    .filter((a) => a.clientAssetType === 1)
    .reduce((sum, a) => sum + a.clientAssetAmount, 0)

  const totalInvestAsset = assets
  // Filter out investment assets
    .filter((a) => a.clientAssetType === 3)
    .reduce((sum, a) => sum + a.clientAssetAmount, 0)

  const totalAsset = assets.reduce((sum, a) => sum + a.clientAssetAmount, 0)
  const totalShortTermDebt = debts
  // Filter out short-term debts
    .filter((d) => d.clientDebtTerm === 1)
    .reduce((sum, d) => sum + d.clientDebtAmount, 0)
  const totalDebt = debts.reduce((sum, d) => sum + d.clientDebtAmount, 0)
  const netWorth = totalAsset - totalDebt

  const debtExpenses = annualExpense
    .filter((e) => e.clientDebtExpense === true)
    .reduce((sum, e) => sum + e.amt, 0)
  const totalDebtExpense = debtExpenses

  const nonMortDebtExp = annualExpense
    .filter((e) => e.clientNonMortgageDebtExpense === true)
    .reduce((sum, e) => sum + e.amt, 0)
  const totalNonMortgageDebtExpense = nonMortDebtExp

  const assetIncome = annualIncome
  // Filter out asset income
    .filter((i) => i.type === 4)
    .reduce((sum, i) => sum + i.amt, 0)
  const totalAssetIncome = assetIncome

  return {
    totalLiquidAssets,
    totalIncome,
    totalExpense,
    monthlyExpense,
    netIncome,
    savings,
    totalShortTermDebt,
    totalDebt,
    totalAsset,
    totalInvestAsset,
    totalDebtExpense,
    totalNonMortgageDebtExpense,
    netWorth,
    totalAssetIncome,
  }
}

export function computeRatios({
  totalLiquidAssets,
  totalShortTermDebt,
  monthlyExpense,
  netWorth,
  totalDebt,
  totalAsset,
  netIncome,
  totalIncome,
  totalExpense,
  savings,
  totalInvestAsset,
  totalDebtExpense,
  totalNonMortgageDebtExpense,
  totalAssetIncome,
}) {
  const liquidity = totalShortTermDebt === 0 ? 0 : totalLiquidAssets / totalShortTermDebt
  const basicLiquidity = monthlyExpense === 0 ? 0 : totalLiquidAssets / monthlyExpense
  const liquidityToNetWorth = netWorth === 0 ? 0 : totalLiquidAssets / netWorth
  const debtToAsset = totalAsset === 0 ? 0 : totalDebt / totalAsset
  const repayAllDebts = totalAsset === 0 ? 0 : netWorth / totalAsset
  const repayDebtFromIncome = totalIncome === 0 ? 0 : totalDebtExpense / totalIncome
  const repayNonMortgageDebtFromIncome = totalIncome === 0 ? 0 : totalNonMortgageDebtExpense / totalIncome
  const savingRatio = totalIncome === 0 ? 0 : savings / totalIncome
  const investRatio = netWorth === 0 ? 0 : totalInvestAsset / netWorth
  const netWorthRatio = totalAsset === 0 ? 0 : netWorth / totalAsset
  const survivalRatio = totalExpense === 0 ? 0 : totalIncome / totalExpense
  const wealthRatio = totalExpense === 0 ? 0 : totalAssetIncome / totalExpense

  return {
    liquidity,
    basicLiquidity,
    liquidityToNetWorth,
    debtToAsset,
    repayAllDebts,
    repayDebtFromIncome,
    repayNonMortgageDebtFromIncome,
    savingRatio,
    investRatio,
    netWorthRatio,
    survivalRatio,
    wealthRatio,
  }
}
