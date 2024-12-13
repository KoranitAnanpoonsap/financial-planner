import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Footer from "../components/footer.jsx"
import Header from "../components/header.jsx"
import ClientBluePanel from "../components/clientBluePanel.jsx"

export default function CFPCashflowBaseCalculated() {
  const { clientId } = useParams()
  const { cfpId } = useParams()
  const navigate = useNavigate()

  const [incomes, setIncomes] = useState([])
  const [expenses, setExpenses] = useState([])
  const [goals, setGoals] = useState([])

  const [annualReturn, setAnnualReturn] = useState(0)

  const years = [1, 2, 3, 4, 5]

  useEffect(() => {
    fetchAllData()
  }, [clientId])

  const fetchAllData = async () => {
    try {
      const [incomesRes, expensesRes, goalsRes, assetsRes] = await Promise.all([
        fetch(`http://localhost:8080/api/clientincome/${clientId}`),
        fetch(`http://localhost:8080/api/clientexpense/${clientId}`),
        fetch(`http://localhost:8080/api/cashflow/${clientId}`),
        fetch(`http://localhost:8080/api/portassets/${clientId}`),
      ])

      if (!incomesRes.ok || !expensesRes.ok || !goalsRes.ok || !assetsRes.ok) {
        throw new Error("Failed to fetch data")
      }

      const incomesData = await incomesRes.json()
      const expensesData = await expensesRes.json()
      const goalsData = await goalsRes.json()
      const assetsData = await assetsRes.json()

      setIncomes(incomesData)
      setExpenses(expensesData)
      setGoals(goalsData)

      calculatePortfolioSummary(assetsData)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const calculatePortfolioSummary = (assetsData) => {
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
    setAnnualReturn(portReturn)
  }

  const calculateYearlyIncome = (incomes, year) => {
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

  const calculateYearlyExpense = (expenses, year) => {
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

  const calculateGoalPayments = (goals, portfolioReturn, year) => {
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

  // Perform calculation for 5 years
  const portfolioReturn = annualReturn
  // We'll store final results for display
  const calculationResults = years.map((year) => {
    const incomeDetails = calculateYearlyIncome(incomes, year)
    const expenseDetails = calculateYearlyExpense(expenses, year)
    const totalIncome = incomeDetails.reduce(
      (sum, inc) => sum + parseFloat(Object.values(inc)[0]),
      0
    )
    const totalExpense = expenseDetails.reduce(
      (sum, exp) => sum + parseFloat(Object.values(exp)[0]),
      0
    )
    const netIncome = totalIncome - totalExpense

    const goalPayments = calculateGoalPayments(goals, portfolioReturn, year)
    const totalGoalPayments = goalPayments.reduce(
      (sum, g) => sum + parseFloat(Object.values(g)[0]),
      0
    )
    const netIncomeAfterGoals = netIncome - totalGoalPayments

    return {
      year,
      incomeDetails,
      expenseDetails,
      goalPayments,
      totalIncome,
      totalExpense,
      netIncome,
      netIncomeAfterGoals,
    }
  })

  const handleDashboard = () => {
    // Navigate to a dashboard page
    navigate(`/${cfpId}/dashboard`)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <ClientBluePanel />
        <div className="flex-1 p-4 space-y-8">
          <div className="overflow-x-auto mt-20">
            <table className="min-w-full bg-white border border-gray-300 text-sm">
              <thead>
                <tr>
                  <th className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                    (บาท)
                  </th>
                  {calculationResults.map((r) => (
                    <th
                      key={r.year}
                      className="py-2 px-4 border font-ibm font-bold text-tfpa_blue"
                    >
                      ปี {r.year}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Incomes */}
                <tr>
                  <td
                    className="py-2 px-4 border text-lg font-ibm font-extrabold text-tfpa_blue"
                    colSpan={1}
                  >
                    รายได้
                  </td>
                  {calculationResults.map((r, i) => (
                    <td key={i} className="border"></td>
                  ))}
                </tr>
                {incomes.map((inc) => (
                  <tr key={inc.id.clientIncomeName}>
                    <td className="py-2 px-4 border font-ibm font-semibold text-tfpa_blue">
                      {inc.id.clientIncomeName}
                    </td>
                    {calculationResults.map((r, i) => {
                      // find inc amount
                      const detail = r.incomeDetails.find(
                        (d) => Object.keys(d)[0] === inc.id.clientIncomeName
                      )
                      const val = detail
                        ? detail[inc.id.clientIncomeName]
                        : "0.00"
                      return (
                        <td
                          key={i}
                          className="py-2 px-4 border text-center font-ibm font-semibold text-tfpa_blue"
                        >
                          {parseFloat(val).toLocaleString()}
                        </td>
                      )
                    })}
                  </tr>
                ))}
                {/* Total Income */}
                <tr className="border-t-2">
                  <td className="py-2 px-4 border font-ibm font-semibold text-tfpa_gold">
                    รวมรายได้
                  </td>
                  {calculationResults.map((r, i) => (
                    <td
                      key={i}
                      className="py-2 px-4 border text-center font-ibm font-semibold text-tfpa_gold"
                      style={{ color: "#d4a017" }}
                    >
                      {r.totalIncome.toLocaleString()}
                    </td>
                  ))}
                </tr>

                {/* Expenses */}
                <tr>
                  <td
                    className="py-2 px-4 border text-lg font-ibm font-bold text-tfpa_blue"
                    colSpan={1}
                  >
                    รายจ่าย
                  </td>
                  {calculationResults.map((r, i) => (
                    <td key={i} className="border"></td>
                  ))}
                </tr>
                {expenses.map((exp) => (
                  <tr key={exp.id.clientExpenseName}>
                    <td className="py-2 px-4 border font-ibm font-semibold text-tfpa_blue">
                      {exp.id.clientExpenseName}
                    </td>
                    {calculationResults.map((r, i) => {
                      const detail = r.expenseDetails.find(
                        (d) => Object.keys(d)[0] === exp.id.clientExpenseName
                      )
                      const val = detail
                        ? detail[exp.id.clientExpenseName]
                        : "0.00"
                      return (
                        <td
                          key={i}
                          className="py-2 px-4 border text-center font-ibm font-semibold text-tfpa_blue"
                        >
                          {parseFloat(val).toLocaleString()}
                        </td>
                      )
                    })}
                  </tr>
                ))}
                {/* Total Expense */}
                <tr className="border-t-2">
                  <td className="py-2 px-4 border font-ibm font-semibold text-tfpa_gold">
                    รวมรายจ่าย
                  </td>
                  {calculationResults.map((r, i) => (
                    <td
                      key={i}
                      className="py-2 px-4 border text-center font-ibm font-semibold text-tfpa_gold"
                      style={{ color: "#d4a017" }}
                    >
                      {r.totalExpense.toLocaleString()}
                    </td>
                  ))}
                </tr>

                {/* Net Income */}
                <tr className="border-t-2">
                  <td className="py-2 px-4 border font-ibm font-semibold text-tfpa_gold">
                    กระแสนเงินสดสุทธิ
                  </td>
                  {calculationResults.map((r, i) => (
                    <td
                      key={i}
                      className="py-2 px-4 border text-center font-ibm font-semibold text-tfpa_gold"
                    >
                      {r.netIncome.toLocaleString()}
                    </td>
                  ))}
                </tr>

                {/* Goals */}
                {goals.map((goal) => (
                  <tr key={goal.id.clientGoalName}>
                    <td className="py-2 px-4 border text-red-600 font-ibm font-semibold">
                      การออมเพื่อเป้าหมาย {goal.id.clientGoalName}
                    </td>
                    {calculationResults.map((r, i) => {
                      const pay = r.goalPayments.find(
                        (g) => Object.keys(g)[0] === goal.id.clientGoalName
                      )
                      const val = pay ? pay[goal.id.clientGoalName] : "0.00"
                      return (
                        <td
                          key={i}
                          className="py-2 px-4 border text-center text-red-600 font-ibm font-semibold"
                        >
                          {parseFloat(val).toLocaleString()}
                        </td>
                      )
                    })}
                  </tr>
                ))}

                {/* Net Income After Goals */}
                <tr className="border-t-2">
                  <td className="py-2 px-4 border font-ibm font-semibold text-tfpa_blue">
                    กระแสนเงินสดสุทธิหลังเป้าหมาย
                  </td>
                  {calculationResults.map((r, i) => {
                    const style = {}
                    if (r.netIncomeAfterGoals < 0) {
                      style.backgroundColor = "#f28b82" // Light red
                    }
                    return (
                      <td
                        key={i}
                        className="py-2 px-4 border text-center font-ibm font-semibold text-tfpa_blue"
                        style={style}
                      >
                        {r.netIncomeAfterGoals.toLocaleString()}
                      </td>
                    )
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleDashboard}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
