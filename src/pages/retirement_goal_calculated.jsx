import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Footer from "../components/footer.jsx"
import Header from "../components/header.jsx"
import ClientBluePanel from "../components/cfpClientSidePanel.jsx"
import { calculateRetirementGoal } from "../utils/calculations.js"
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

export default function RetirementGoalCalculated() {
  const [cfpId] = useState(Number(localStorage.getItem("cfpId")) || "")
  const [clientId] = useState(Number(localStorage.getItem("clientId")) || "")
  const navigate = useNavigate()

  const [retirementGoal, setRetirementGoal] = useState(null)

  // Calculation results
  const [discountRate, setDiscountRate] = useState(0)
  const [fvCurrentExpense, setFvCurrentExpense] = useState(0)
  const [newFvCurrentExpense, setNewFvCurrentExpense] = useState(0)
  const [retirementGoalAmount, setRetirementGoalAmount] = useState(0)

  // Slider state for retiredExpensePortion (0 to 1)
  const [retiredExpensePortion, setRetiredExpensePortion] = useState(1)

  useEffect(() => {
    fetchRetirementGoalData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId])

  const fetchRetirementGoalData = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/retirementgoal/${clientId}`
      )
      if (!res.ok) throw new Error("No retirement goal data")
      const rg = await res.json()
      setRetirementGoal(rg)

      // Determine the saved portion or default to 100%
      const savedPortion =
        rg.clientRetiredExpensePortion != null
          ? rg.clientRetiredExpensePortion
          : 1
      setRetiredExpensePortion(savedPortion)

      // Initial calculation with the saved portion
      performCalculation(rg, savedPortion)
    } catch (error) {
      console.error("Error fetching retirement goal data:", error)
      // Optionally, set default values or handle error state here
    }
  }

  const performCalculation = (rg, portion) => {
    const {
      discountRate,
      fvCurrentExpense,
      newFvCurrentExpense,
      retirementGoal,
    } = calculateRetirementGoal(rg, portion)

    setDiscountRate(discountRate)
    setFvCurrentExpense(fvCurrentExpense)
    setNewFvCurrentExpense(newFvCurrentExpense)
    setRetirementGoalAmount(retirementGoal)
  }

  const handlePortionChange = async (e) => {
    const portionValue = e.target.value / 100 // Convert from percent to decimal
    setRetiredExpensePortion(portionValue)
    if (retirementGoal) {
      performCalculation(retirementGoal, portionValue)
      await updateRetiredExpensePortion(portionValue)
    }
  }

  const updateRetiredExpensePortion = async (portion) => {
    const updatedGoal = {
      ...retirementGoal,
      clientRetiredExpensePortion: portion,
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/retirementgoal/${clientId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedGoal),
        }
      )
      if (!response.ok)
        throw new Error("Failed to update retired expense portion")

      const savedGoal = await response.json()
      setRetirementGoal(savedGoal)

      // Ensure the retiredExpensePortion is updated from savedGoal in case backend modified it
      const updatedPortion =
        savedGoal.clientRetiredExpensePortion != null
          ? savedGoal.clientRetiredExpensePortion
          : 1
      setRetiredExpensePortion(updatedPortion)

      // Recalculate with the saved portion
      performCalculation(savedGoal, updatedPortion)
    } catch (error) {
      console.error("Error updating retired expense portion:", error)
      // Optionally, revert the slider or notify the user
    }
  }

  const handleNavigateGeneralGoal = () => {
    navigate(`/goal-base/`)
  }

  const handleNavigateRetirement = () => {
    navigate(`/retirement-goal/`)
  }

  const handleDashboard = () => {
    navigate(`/dashboard`)
  }

  // Format numbers with appropriate decimal places and locale
  const formatNumber = (number, decimals = 2) =>
    Number(number.toFixed(decimals)).toLocaleString()

  const afterInflationReturnPercent = (discountRate * 100).toFixed(2)
  const portionPercent = (retiredExpensePortion * 100).toFixed(0)

  return (
    <div className="flex flex-col min-h-screen font-ibm">
      <Header />
      <div className="flex flex-1">
        <ClientBluePanel />
        <div className="flex-1 p-4 space-y-8">
          {/* Top Navigation Buttons */}
          <div className="flex space-x-4 justify-center">
            <button
              className="bg-gray-200 px-4 py-2 rounded font-bold text-tfpa_blue"
              onClick={handleNavigateGeneralGoal}
            >
              เป้าหมายทั่วไป
            </button>
            <button
              className="bg-tfpa_gold px-4 py-2 rounded font-bold text-white"
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
            {/* Retirement Goal Details */}
            {retirementGoal && (
              <div className="bg-tfpa_gold p-8 mx-64 rounded-2xl space-y-8 text-tfpa_blue font-bold">
                {/* Discount Rate and Current Expense */}
                <div className="flex flex-col space-y-4 text-lg text-white">
                  <div className="flex items-center space-x-2">
                    <span>ผลตอบแทนต่อปีหลังหักอัตราเงินเฟ้อ</span>
                    <span>{afterInflationReturnPercent}</span>
                    <span>%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>รายจ่ายต่อปี ณ วันเกษียณ</span>
                    <span>{formatNumber(fvCurrentExpense)}</span>
                    <span>บาท</span>
                  </div>
                </div>

                {/* Slider for Retired Expense Portion */}
                <div className="flex items-center space-x-4">
                  <span className="whitespace-nowrap text-lg text-white">
                    สัดส่วนที่คาดว่าจะใช้จ่ายจริง
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={portionPercent}
                    onChange={handlePortionChange}
                    className="w-64"
                  />
                  <div className="bg-tfpa_blue text-white px-2 py-1 rounded-full">
                    {portionPercent}%
                  </div>
                </div>

                {/* Updated Expense and Retirement Goal */}
                <div className="flex flex-col space-y-2 text-2xl">
                  <div className="flex items-center space-x-2">
                    <span>รายจ่ายต่อปี ณ วันเกษียณ</span>
                    <span>{formatNumber(newFvCurrentExpense)}</span>
                    <span>บาท</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>เงินที่ต้องมีทั้งหมด ณ วันเกษียณ</span>
                    <span>{formatNumber(retirementGoalAmount)}</span>
                    <span>บาท</span>
                  </div>
                </div>
              </div>
            )}

            {/* Dashboard Button */}
            <div className="flex justify-center mt-4 mb-4">
              <button
                onClick={handleDashboard}
                className="bg-tfpa_blue hover:bg-tfpa_blue_hover text-white px-4 py-2 rounded font-bold"
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
