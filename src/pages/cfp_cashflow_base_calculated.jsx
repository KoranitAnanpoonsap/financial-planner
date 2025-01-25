import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Footer from "../components/footer.jsx"
import Header from "../components/cfpHeader.jsx"
import CfpClientSidePanel from "../components/cfpClientSidePanel.jsx"
import { motion } from "framer-motion"

// Import the calculation functions
import {
  calculatePortfolioSummary,
  calculateYearlyIncome,
  calculateYearlyExpense,
  calculateGoalPayments,
} from "../utils/calculations.js"

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 1 },
}

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.4,
}

export default function CFPCashflowBaseCalculated() {
  const [clientUuid] = useState(localStorage.getItem("clientUuid") || "")
  const navigate = useNavigate()

  const [incomes, setIncomes] = useState([])
  const [expenses, setExpenses] = useState([])
  const [goals, setGoals] = useState([])
  const [portfolioReturn, setPortfolioReturn] = useState(0)

  const years = [1, 2, 3, 4, 5]

  useEffect(() => {
    fetchAllData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientUuid])

  const fetchAllData = async () => {
    try {
      const [incomesRes, expensesRes, goalsRes, assetsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_KEY}api/clientincome/${clientUuid}`),
        fetch(`${import.meta.env.VITE_API_KEY}api/clientexpense/${clientUuid}`),
        fetch(`${import.meta.env.VITE_API_KEY}api/cashflow/${clientUuid}`),
        fetch(`${import.meta.env.VITE_API_KEY}api/portassets/${clientUuid}`),
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

      const { portReturn } = calculatePortfolioSummary(assetsData)
      setPortfolioReturn(portReturn)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

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

    // Pass 'expenses' as an additional argument to calculateGoalPayments
    const goalPayments = calculateGoalPayments(
      goals,
      portfolioReturn,
      expenses,
      year
    )
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
    navigate(`/cashflow-base-dashboard`)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <CfpClientSidePanel />
        <div className="flex-1 p-4 space-y-8">
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full bg-white border border-gray-300 text-sm">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border text-left font-ibm font-bold text-tfpa_blue">
                      (บาท)
                    </th>
                    {calculationResults.map((r) => (
                      <th
                        key={r.year}
                        className="py-2 px-4 border text-right font-ibm font-bold text-tfpa_blue"
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
                    <tr key={inc.clientIncomeName}>
                      <td className="py-2 px-4 border font-ibm font-semibold text-tfpa_blue_panel_select">
                        {inc.clientIncomeName}
                      </td>
                      {calculationResults.map((r, i) => {
                        // find inc amount
                        const detail = r.incomeDetails.find(
                          (d) => Object.keys(d)[0] === inc.clientIncomeName
                        )
                        const val = detail
                          ? detail[inc.clientIncomeName]
                          : "0.00"
                        return (
                          <td
                            key={i}
                            className="py-2 px-4 border text-right font-ibm font-semibold text-tfpa_blue_panel_select"
                          >
                            {Number(val).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
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
                        className="py-2 px-4 border text-right font-ibm font-semibold text-tfpa_gold"
                        style={{ color: "#d4a017" }}
                      >
                        {r.totalIncome.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
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
                    <tr key={exp.clientExpenseName}>
                      <td className="py-2 px-4 border font-ibm font-semibold text-tfpa_blue_panel_select">
                        {exp.clientExpenseName}
                      </td>
                      {calculationResults.map((r, i) => {
                        const detail = r.expenseDetails.find(
                          (d) => Object.keys(d)[0] === exp.clientExpenseName
                        )
                        const val = detail
                          ? detail[exp.clientExpenseName]
                          : "0.00"
                        return (
                          <td
                            key={i}
                            className="py-2 px-4 border text-right font-ibm font-semibold text-tfpa_blue_panel_select"
                          >
                            {Number(val).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
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
                        className="py-2 px-4 border text-right font-ibm font-semibold text-tfpa_gold"
                        style={{ color: "#d4a017" }}
                      >
                        {r.totalExpense.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    ))}
                  </tr>

                  {/* Net Income */}
                  <tr className="border-t-2">
                    <td className="py-2 px-4 border text-lg font-ibm font-semibold text-tfpa_blue">
                      กระแสเงินสดสุทธิ
                    </td>
                    {calculationResults.map((r, i) => (
                      <td
                        key={i}
                        className="py-2 px-4 border text-right font-ibm font-semibold text-tfpa_blue"
                      >
                        {r.netIncome.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    ))}
                  </tr>

                  {/* Goals */}
                  {goals.map((goal) => (
                    <tr key={goal.clientGoalName}>
                      <td className="py-2 px-4 border text-lg text-red-600 font-ibm font-semibold">
                        การออมเพื่อเป้าหมาย {goal.clientGoalName}
                      </td>
                      {calculationResults.map((r, i) => {
                        const pay = r.goalPayments.find(
                          (g) => Object.keys(g)[0] === goal.clientGoalName
                        )
                        const val = pay ? pay[goal.clientGoalName] : "0.00"
                        return (
                          <td
                            key={i}
                            className="py-2 px-4 border text-right text-red-600 font-ibm font-semibold"
                          >
                            {Number(val).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                        )
                      })}
                    </tr>
                  ))}

                  {/* Net Income After Goals */}
                  <tr className="border-t-2">
                    <td className="py-2 px-4 border text-lg font-ibm font-semibold text-tfpa_blue">
                      กระแสเงินสดสุทธิหลังเป้าหมาย
                    </td>
                    {calculationResults.map((r, i) => {
                      const style = {}
                      if (r.netIncomeAfterGoals < 0) {
                        style.backgroundColor = "#f28b82" // Light red
                      }
                      return (
                        <td
                          key={i}
                          className="py-2 px-4 border text-right font-ibm font-semibold text-tfpa_blue"
                          style={style}
                        >
                          {r.netIncomeAfterGoals.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      )
                    })}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-center mt-4">
              <button
                onClick={handleDashboard}
                className="bg-tfpa_blue hover:bg-tfpa_blue_hover text-white px-4 py-2 rounded"
              >
                Dashboard
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
