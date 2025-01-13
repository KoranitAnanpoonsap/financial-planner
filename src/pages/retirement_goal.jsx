import { useEffect, useState, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Footer from "../components/footer.jsx"
import Header from "../components/header.jsx"
import CfpClientSidePanel from "../components/cfpClientSidePanel.jsx"
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

export default function RetirementGoalPage() {
  const [cfpId] = useState(Number(localStorage.getItem("cfpId")) || "")
  const [clientId] = useState(Number(localStorage.getItem("clientId")) || "")
  const navigate = useNavigate()

  const [assets, setAssets] = useState([])
  const [totalInvestment, setTotalInvestment] = useState(0)
  const [portfolioReturn, setPortfolioReturn] = useState(0)

  // Fields from RetirementGoal
  const [clientCurrentAge, setClientCurrentAge] = useState("") // อายุปัจจุบัน
  const [clientRetirementAge, setClientRetirementAge] = useState("") // อายุเกษียณ
  const [clientLifeExpectancy, setClientLifeExpectancy] = useState("") // อายุยืน
  const [clientCurrentYearlyExpense, setClientCurrentYearlyExpense] =
    useState("") // รายจ่ายต่อปีปัจจุบัน
  const [clientExpectedRetiredPortReturn, setClientExpectedRetiredPortReturn] =
    useState("") // ผลตอบแทนต่อปีที่คาดหวัง หลังเกษียณ
  const [inflationRate, setInflationRate] = useState("") // อัตราเงินเฟ้อ

  const [retirementGoalExists, setRetirementGoalExists] = useState(false)
  const [retirementGoal, setRetirementGoal] = useState(null) // Add this state

  // Ref for debounce timer
  const debounceTimer = useRef(null)

  useEffect(() => {
    fetchAllData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId])

  const fetchAllData = async () => {
    try {
      const [assetsRes, retirementGoalRes] = await Promise.all([
        fetch(`http://localhost:8080/api/portassets/${clientId}`),
        fetch(`http://localhost:8080/api/retirementgoal/${clientId}`),
      ])

      if (!assetsRes.ok) throw new Error("Failed to fetch assets")
      const assetsData = await assetsRes.json()
      setAssets(assetsData)

      const { totalInvestAmount, portReturn } =
        calculatePortfolioSummary(assetsData)
      setTotalInvestment(totalInvestAmount)
      setPortfolioReturn(portReturn)

      if (retirementGoalRes.ok) {
        const rg = await retirementGoalRes.json()
        setRetirementGoalExists(true)
        setRetirementGoal(rg) // Store the entire retirement goal
        setClientCurrentAge(rg.clientCurrentAge?.toString() || "")
        setClientRetirementAge(rg.clientRetirementAge?.toString() || "")
        setClientLifeExpectancy(rg.clientLifeExpectancy?.toString() || "")
        setClientCurrentYearlyExpense(
          rg.clientCurrentYearlyExpense?.toString() || ""
        )
        setClientExpectedRetiredPortReturn(
          rg.clientExpectedRetiredPortReturn !== undefined
            ? (rg.clientExpectedRetiredPortReturn * 100).toString()
            : ""
        )
        setInflationRate(
          rg.inflationRate !== undefined
            ? (rg.inflationRate * 100).toString()
            : ""
        )
      } else {
        // No retirement goal yet
        setRetirementGoalExists(false)
        setRetirementGoal(null) // Ensure retirementGoal is null
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      setRetirementGoalExists(false)
      setRetirementGoal(null) // Ensure retirementGoal is null on error
    }
  }

  useEffect(() => {
    // Function to validate inputs
    const isValid = () => {
      return (
        clientCurrentAge !== "" &&
        clientRetirementAge !== "" &&
        clientLifeExpectancy !== "" &&
        clientCurrentYearlyExpense !== "" &&
        clientExpectedRetiredPortReturn !== "" &&
        inflationRate !== ""
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
    clientCurrentAge,
    clientRetirementAge,
    clientLifeExpectancy,
    clientCurrentYearlyExpense,
    clientExpectedRetiredPortReturn,
    inflationRate,
  ])

  const handleSaveGoal = async () => {
    // Construct RetirementGoal object
    const goal = {
      clientId: parseInt(clientId),
      clientCurrentAge: parseInt(clientCurrentAge),
      clientRetirementAge: parseInt(clientRetirementAge),
      clientLifeExpectancy: parseInt(clientLifeExpectancy),
      clientCurrentYearlyExpense: parseFloat(clientCurrentYearlyExpense),
      clientExpectedRetiredPortReturn:
        parseFloat(clientExpectedRetiredPortReturn) / 100, // convert % to decimal
      inflationRate: parseFloat(inflationRate) / 100, // convert % to decimal
      clientRetiredExpensePortion: retirementGoal
        ? retirementGoal.clientRetiredExpensePortion
        : 1, // Preserve existing portion or set to 1 if creating
    }

    const method = retirementGoalExists ? "PUT" : "POST"
    const url = retirementGoalExists
      ? `http://localhost:8080/api/retirementgoal/${clientId}`
      : `http://localhost:8080/api/retirementgoal`

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(goal),
      })
      if (!response.ok) throw new Error("Failed to save retirement goal")

      const savedGoal = await response.json()

      setRetirementGoalExists(true)
      setRetirementGoal(savedGoal) // Update the retirementGoal state
      // Update state with saved data to ensure consistency
      setClientCurrentAge(savedGoal.clientCurrentAge?.toString() || "")
      setClientRetirementAge(savedGoal.clientRetirementAge?.toString() || "")
      setClientLifeExpectancy(savedGoal.clientLifeExpectancy?.toString() || "")
      setClientCurrentYearlyExpense(
        savedGoal.clientCurrentYearlyExpense?.toString() || ""
      )
      setClientExpectedRetiredPortReturn(
        savedGoal.clientExpectedRetiredPortReturn !== undefined
          ? (savedGoal.clientExpectedRetiredPortReturn * 100).toString()
          : ""
      )
      setInflationRate(
        savedGoal.inflationRate !== undefined
          ? (savedGoal.inflationRate * 100).toString()
          : ""
      )
      // Optionally, refetch all data to ensure synchronization
      // await fetchAllData()
      console.log("Retirement goal saved successfully:", savedGoal)
    } catch (error) {
      console.error("Error saving retirement goal:", error)
      // Optionally, handle errors (e.g., display a toast notification)
    }
  }

  const handleCalculate = () => {
    // Navigate to calculation result page
    // Adjust the route as desired
    navigate(`/retirement-goal-calculated/`)
  }

  const handleNavigateGeneralGoal = () => {
    navigate(`/goal-base/`)
  }

  return (
    <div className="flex flex-col min-h-screen font-ibm">
      <Header />
      <div className="flex flex-1">
        <CfpClientSidePanel />
        <div className="flex-1 p-4 space-y-8">
          {/* Top buttons */}
          <div className="flex space-x-4 justify-center">
            <button
              className="bg-gray-200 px-4 py-2 rounded font-bold text-tfpa_blue"
              onClick={handleNavigateGeneralGoal}
            >
              เป้าหมายทั่วไป
            </button>
            <button className="bg-tfpa_gold px-4 py-2 rounded font-bold text-white">
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
            {/* Input fields */}
            <div className="flex flex-col items-center space-y-6">
              <div className="flex items-center space-x-4 w-full justify-center">
                <label className="w-48 text-left text-tfpa_blue font-semibold">
                  อายุปัจจุบัน
                </label>
                <div className="w-96">
                  <input
                    type="number"
                    value={clientCurrentAge}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => setClientCurrentAge(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                  />
                </div>
                <span className="text-tfpa_blue font-semibold">ปี</span>
              </div>
              <div className="flex items-center space-x-4 w-full justify-center">
                <label className="w-48 text-left text-tfpa_blue font-semibold">
                  อายุเกษียณ
                </label>
                <div className="w-96">
                  <input
                    type="number"
                    value={clientRetirementAge}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => setClientRetirementAge(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                  />
                </div>
                <span className="text-tfpa_blue font-semibold">ปี</span>
              </div>
              <div className="flex items-center space-x-4 w-full justify-center">
                <label className="w-48 text-left text-tfpa_blue font-semibold">
                  อายุยืน
                </label>
                <div className="w-96">
                  <input
                    type="number"
                    value={clientLifeExpectancy}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => setClientLifeExpectancy(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                  />
                </div>
                <span className="text-tfpa_blue font-semibold">ปี</span>
              </div>
              <div className="flex items-center space-x-4 w-full justify-center">
                <label className="w-48 text-left text-tfpa_blue font-semibold">
                  รายจ่ายต่อปีปัจจุบัน
                </label>
                <div className="w-96">
                  <input
                    type="number"
                    value={clientCurrentYearlyExpense}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) =>
                      setClientCurrentYearlyExpense(e.target.value)
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                  />
                </div>
                <span className="text-tfpa_blue font-semibold">บาท</span>
              </div>
              <div className="flex items-center space-x-4 w-full justify-center">
                <label className="w-48 text-left text-tfpa_blue font-semibold">
                  ผลตอบแทนต่อปีที่คาดหวัง หลังเกษียณ
                </label>
                <div className="w-96">
                  <input
                    type="number"
                    value={clientExpectedRetiredPortReturn}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) =>
                      setClientExpectedRetiredPortReturn(e.target.value)
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                  />
                </div>
                <span className="text-tfpa_blue font-semibold">%</span>
              </div>
              <div className="flex items-center space-x-4 w-full justify-center">
                <label className="w-48 text-left text-tfpa_blue font-semibold">
                  อัตราเงินเฟ้อ
                </label>
                <div className="w-96">
                  <input
                    type="number"
                    value={inflationRate}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => setInflationRate(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                  />
                </div>
                <span className="text-tfpa_blue font-semibold">%</span>
              </div>
            </div>

            {/* Calculate Button */}
            <div className="flex justify-center mt-4 mb-4">
              <button
                onClick={handleCalculate}
                className="bg-tfpa_blue text-white px-6 py-3 rounded font-bold hover:bg-tfpa_blue_hover transition duration-300"
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
