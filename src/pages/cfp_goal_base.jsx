import { useEffect, useState, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Footer from "../components/footer.jsx"
import Header from "../components/cfpHeader.jsx"
import CfpClientSidePanel from "../components/cfpClientSidePanel.jsx"
import PortfolioPieChart from "../components/portfolioPieChart.jsx"
import { calculatePortfolioSummary } from "../utils/calculations.js"
import { motion } from "framer-motion"

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 1 },
}

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.3,
}

export default function CFPGoalBase() {
  const [clientUuid] = useState(localStorage.getItem("clientUuid") || "")
  const navigate = useNavigate()

  const [TotalInvestment, setTotalInvestment] = useState("")
  const [PortfolioReturn, setPortfolioReturn] = useState("")

  // Fields from GeneralGoal
  const [NetIncome, setNetIncome] = useState("") // กระแสเงินสดสุทธิต่อปี
  const [NetIncomeGrowth, setNetIncomeGrowth] = useState("") // %
  const [GoalName, setGoalName] = useState("") // ชื่อเป้าหมาย
  const [GoalValue, setGoalValue] = useState("") // จำนวนเงินเพื่อเป้าหมาย
  const [GoalPeriod, setGoalPeriod] = useState("") // ระยะเวลาเป้าหมาย

  const [GoalExists, setGoalExists] = useState(false)

  // Ref for debounce timer
  const debounceTimer = useRef(null)

  useEffect(() => {
    fetchAllData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientUuid])

  const fetchAllData = async () => {
    try {
      const [GoalRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_KEY}api/calculategoal/${clientUuid}`),
      ])

      if (GoalRes.ok) {
        const g = await GoalRes.json()
        setGoalExists(true)
        setNetIncome(g.netIncome?.toString() || "")
        setNetIncomeGrowth(
          g.netIncomeGrowth !== undefined
            ? (g.netIncomeGrowth * 100).toFixed(2)
            : ""
        )
        setGoalName(g.goalName || "")
        setGoalValue(g.goalValue?.toString() || "")
        setGoalPeriod(g.goalPeriod?.toString() || "")
        setTotalInvestment(g.totalInvestment?.toString() || "")
        setPortfolioReturn(
          g.portReturn !== undefined ? (g.portReturn * 100).toFixed(2) : ""
        )
      } else {
        // No goal yet
        setGoalExists(false)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  useEffect(() => {
    // Function to validate inputs
    const isValid = () => {
      return (
        NetIncome !== "" &&
        NetIncomeGrowth !== "" &&
        GoalName.trim() !== "" &&
        GoalValue !== "" &&
        GoalPeriod !== "" &&
        TotalInvestment !== "" &&
        PortfolioReturn !== ""
      )
    }

    // If any field is invalid, do not attempt to save
    if (!isValid()) {
      return
    }

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    // Set new timer
    debounceTimer.current = setTimeout(() => {
      handleSaveGoal()
    }, 500) // 500ms debounce

    // Cleanup function
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    NetIncome,
    NetIncomeGrowth,
    GoalName,
    GoalValue,
    GoalPeriod,
    TotalInvestment,
    PortfolioReturn,
  ])

  const handleSaveGoal = async () => {
    // Construct GeneralGoal object
    const goal = {
      clientUuid: clientUuid,
      goalName: GoalName,
      goalValue: parseFloat(GoalValue),
      goalPeriod: parseInt(GoalPeriod),
      netIncome: parseFloat(NetIncome),
      netIncomeGrowth: parseFloat(NetIncomeGrowth) / 100, // convert % to decimal
      totalInvestment: parseInt(TotalInvestment),
      portReturn: parseFloat(PortfolioReturn) / 100, // convert % to decimal
    }

    const method = GoalExists ? "PUT" : "POST"
    const url = GoalExists
      ? `${import.meta.env.VITE_API_KEY}api/calculategoal/${clientUuid}`
      : `${import.meta.env.VITE_API_KEY}api/calculategoal`

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(goal),
      })

      if (!response.ok) throw new Error("Failed to save goal")

      const savedGoal = await response.json()

      setGoalExists(true) // now definitely exists

      // Update state with formatted numbers
      setNetIncome(savedGoal.netIncome?.toString() || "")
      setNetIncomeGrowth(
        savedGoal.netIncomeGrowth !== undefined
          ? (savedGoal.netIncomeGrowth * 100).toFixed(2)
          : ""
      )
      setGoalName(savedGoal.goalName || "")
      setGoalValue(savedGoal.goalValue?.toString() || "")
      setGoalPeriod(savedGoal.goalPeriod?.toString() || "")
      setTotalInvestment(savedGoal.totalInvestment?.toString() || "")
      setPortfolioReturn(
        savedGoal.portReturn !== undefined
          ? (savedGoal.portReturn * 100).toFixed(2)
          : ""
      )
    } catch (error) {
      console.error("Error saving goal:", error)
      // Optionally, handle errors (e.g., display a toast notification)
    }
  }

  const handleCalculate = () => {
    // Navigate to calculation result page
    // Adjust the route as desired
    navigate(`/goal-base-calculated/`)
  }

  const handleNavigateRetirement = () => {
    navigate(`/retirement-goal/`)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <CfpClientSidePanel />
        <div className="flex-1 p-6 space-y-8">
          {/* Top Buttons */}
          <div className="flex space-x-4 justify-center">
            <button className="bg-tfpa_gold px-4 py-2 rounded font-ibm font-bold text-white">
              เป้าหมายทั่วไป
            </button>
            <button
              className="bg-gray-200 px-4 py-2 rounded font-ibm font-bold text-tfpa_blue"
              onClick={handleNavigateRetirement}
            >
              เป้าหมายเกษียณ
            </button>
          </div>

          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            {/* Input Fields */}
            <form className="space-y-6">
              {/* Group 1: Financial Information */}
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-tfpa_blue font-semibold mb-1">
                    กระแสเงินสดสุทธิต่อปี (บาท)
                  </label>
                  <input
                    type="number"
                    value={NetIncome}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => setNetIncome(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                  />
                </div>

                <div>
                  <label className="block text-tfpa_blue font-semibold mb-1">
                    อัตราการเติบโตของกระแสเงินสดสุทธิต่อปี (%)
                  </label>
                  <input
                    type="number"
                    value={NetIncomeGrowth}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => setNetIncomeGrowth(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                  />
                </div>
              </div>

              {/* Group 2: Goal Details */}
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-tfpa_blue font-semibold mb-1">
                    ชื่อเป้าหมาย
                  </label>
                  <input
                    type="text"
                    value={GoalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                  />
                </div>

                <div>
                  <label className="block text-tfpa_blue font-semibold mb-1">
                    จำนวนเงินเพื่อเป้าหมาย (บาท)
                  </label>
                  <input
                    type="number"
                    value={GoalValue}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => setGoalValue(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                  />
                </div>
              </div>

              {/* Group 3: Investment Details */}
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-tfpa_blue font-semibold mb-1">
                    เงินรวมปัจจุบันในการลงทุน (บาท)
                  </label>
                  <input
                    type="number"
                    value={TotalInvestment}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => setTotalInvestment(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                  />
                </div>

                <div>
                  <label className="block text-tfpa_blue font-semibold mb-1">
                    ผลตอบแทนต่อปีของพอร์ตที่ลงทุนปัจจุบัน (%)
                  </label>
                  <input
                    type="number"
                    value={PortfolioReturn}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => setPortfolioReturn(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                  />
                </div>
              </div>

              {/* Group 4: Goal Period */}
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-tfpa_blue font-semibold mb-1">
                    ระยะเวลาเป้าหมาย (ปี)
                  </label>
                  <input
                    type="number"
                    value={GoalPeriod}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => setGoalPeriod(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                  />
                </div>
              </div>
            </form>

            {/* Calculate Button */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleCalculate}
                className="bg-tfpa_blue hover:bg-tfpa_blue_hover text-white px-6 py-3 rounded font-ibm font-bold"
              >
                คำนวณ
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
