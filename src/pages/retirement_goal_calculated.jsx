import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Footer from "../components/footer.jsx"
import Header from "../components/header.jsx"
import ClientBluePanel from "../components/clientBluePanel.jsx"
import { calculateRetirementGoal } from "../components/calculations.js"

export default function RetirementGoalCalculated() {
  const { clientId, cfpId } = useParams()
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
  }, [clientId])

  const fetchRetirementGoalData = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/retirementgoal/${clientId}`
      )
      if (!res.ok) throw new Error("No retirement goal data")
      const rg = await res.json()
      setRetirementGoal(rg)

      // If the retirement goal has a portion saved, use it. Otherwise default to 100%.
      const savedPortion =
        rg.clientRetiredExpensePortion != null
          ? rg.clientRetiredExpensePortion
          : 1
      setRetiredExpensePortion(savedPortion)

      // Initial calculation with the saved portion
      recalculate(rg, savedPortion)
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const recalculate = (rg, portion) => {
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
    const portionValue = e.target.value / 100 // convert from percent to decimal
    setRetiredExpensePortion(portionValue)
    if (retirementGoal) {
      recalculate(retirementGoal, portionValue)
      await savePortion(portionValue)
    }
  }

  const savePortion = async (portion) => {
    // Update the retirement goal with new portion
    // Clone the existing retirementGoal and update the portion
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
      if (!response.ok) throw new Error("Failed to update portion")

      const saved = await response.json()
      setRetirementGoal(saved)
    } catch (error) {
      console.error("Error updating portion:", error)
    }
  }

  const handleNavigateGeneralGoal = () => {
    navigate(`/${cfpId}/goal-base/${clientId}`)
  }

  const handleDashboard = () => {
    navigate(`/${cfpId}/dashboard`)
  }

  if (!retirementGoal) {
    return (
      <div className="flex flex-col min-h-screen font-ibm">
        <Header />
        <div className="flex flex-1">
          <ClientBluePanel />
          <div className="flex-1 p-4">Loading...</div>
        </div>
        <Footer />
      </div>
    )
  }

  const afterInflationReturnPercent = (discountRate * 100).toFixed(2)
  const portionPercent = (retiredExpensePortion * 100).toFixed(0)

  // Format numbers with two decimal places
  const fvCurrentExpenseStr = Number(
    fvCurrentExpense.toFixed(2)
  ).toLocaleString()
  const newFvCurrentExpenseStr = Number(
    newFvCurrentExpense.toFixed(2)
  ).toLocaleString()
  const retirementGoalAmountStr = Number(
    retirementGoalAmount.toFixed(2)
  ).toLocaleString()

  return (
    <div className="flex flex-col min-h-screen font-ibm">
      <Header />
      <div className="flex flex-1">
        <ClientBluePanel />
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

          {/* Gold box with results */}
          <div className="bg-tfpa_gold p-8 mx-64 rounded-2xl space-y-8 text-tfpa_blue font-bold">
            <div className="flex flex-col space-y-4 text-lg text-white">
              <div className="flex items-center space-x-2">
                <span>ผลตอบแทนต่อปีหลังหักอัตราเงินเฟ้อ</span>
                <span>{afterInflationReturnPercent}</span>
                <span>%</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>รายจ่ายต่อปี ณ วันเกษียณ</span>
                <span>{fvCurrentExpenseStr}</span>
                <span>บาท</span>
              </div>
            </div>

            {/* Slider for portion */}
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

            {/* Updated values after portion */}
            <div className="flex flex-col space-y-2 text-2xl">
              <div className="flex items-center space-x-2">
                <span>รายจ่ายต่อปี ณ วันเกษียณ</span>
                <span>{newFvCurrentExpenseStr}</span>
                <span>บาท</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>เงินที่ต้องมีทั้งหมด ณ วันเกษียณ</span>
                <span>{retirementGoalAmountStr}</span>
                <span>บาท</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleDashboard}
              className="bg-blue-500 text-white px-4 py-2 rounded font-bold"
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
