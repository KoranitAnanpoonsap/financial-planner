import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Footer from "../components/footer.jsx"
import Header from "../components/header.jsx"
import ClientBluePanel from "../components/clientBluePanel.jsx"

export default function RetirementGoalPage() {
  const { clientId, cfpId } = useParams()
  const navigate = useNavigate()

  const [retirementGoalExists, setRetirementGoalExists] = useState(false)

  const [clientCurrentAge, setClientCurrentAge] = useState("")
  const [clientRetirementAge, setClientRetirementAge] = useState("")
  const [clientLifeExpectancy, setClientLifeExpectancy] = useState("")
  const [clientCurrentYearlyExpense, setClientCurrentYearlyExpense] =
    useState("")
  const [clientExpectedRetiredPortReturn, setClientExpectedRetiredPortReturn] =
    useState("")
  const [inflationRate, setInflationRate] = useState("")

  useEffect(() => {
    fetchRetirementGoal()
  }, [clientId])

  const fetchRetirementGoal = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/retirementgoal/${clientId}`
      )
      if (response.ok) {
        const rg = await response.json()
        setRetirementGoalExists(true)
        setClientCurrentAge(rg.clientCurrentAge?.toString() || "")
        setClientRetirementAge(rg.clientRetirementAge?.toString() || "")
        setClientLifeExpectancy(rg.clientLifeExpectancy?.toString() || "")
        setClientCurrentYearlyExpense(
          rg.clientCurrentYearlyExpense?.toString() || ""
        )
        setClientExpectedRetiredPortReturn(
          (rg.clientExpectedRetiredPortReturn * 100)?.toString() || ""
        )
        setInflationRate((rg.inflationRate * 100)?.toString() || "")
      } else {
        setRetirementGoalExists(false)
      }
    } catch (error) {
      console.error("Error fetching retirement goal:", error)
      setRetirementGoalExists(false)
    }
  }

  const handleSave = async () => {
    const goal = {
      clientId: parseInt(clientId),
      clientCurrentAge: parseInt(clientCurrentAge),
      clientRetirementAge: parseInt(clientRetirementAge),
      clientLifeExpectancy: parseInt(clientLifeExpectancy),
      clientCurrentYearlyExpense: parseInt(clientCurrentYearlyExpense),
      clientExpectedRetiredPortReturn:
        parseFloat(clientExpectedRetiredPortReturn) / 100,
      inflationRate: parseFloat(inflationRate) / 100,
      clientRetiredExpensePortion: 1,
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

      await response.json()
      setRetirementGoalExists(true)
    } catch (error) {
      console.error("Error saving retirement goal:", error)
    }
  }

  const handleCalculate = () => {
    navigate(`/${cfpId}/retirement-goal-calculated/${clientId}`)
  }

  const handleNavigateGeneralGoal = () => {
    navigate(`/${cfpId}/goal-base/${clientId}`)
  }

  // A small helper component to create a labeled input line
  const InputLine = ({ label, value, onChange, unit }) => (
    <div className="flex items-center space-x-4 w-full justify-center">
      <span className="w-48 text-left">{label}</span>
      <div className="border-b-2 border-tfpa_blue w-96 relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent outline-none text-right font-normal"
        />
      </div>
      <span>{unit}</span>
    </div>
  )

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

          {/* Input fields */}
          <div className="flex flex-col items-center space-y-6 text-tfpa_blue font-bold text-lg">
            <InputLine
              label="อายุปัจจุบัน"
              value={clientCurrentAge}
              onChange={setClientCurrentAge}
              unit="ปี"
            />
            <InputLine
              label="อายุเกษียณ"
              value={clientRetirementAge}
              onChange={setClientRetirementAge}
              unit="ปี"
            />
            <InputLine
              label="อายุยืน"
              value={clientLifeExpectancy}
              onChange={setClientLifeExpectancy}
              unit="ปี"
            />
            <InputLine
              label="รายจ่ายต่อปีปัจจุบัน"
              value={clientCurrentYearlyExpense}
              onChange={setClientCurrentYearlyExpense}
              unit="บาท"
            />
            <InputLine
              label="ผลตอบแทนต่อปีที่คาดหวัง หลังเกษียณ"
              value={clientExpectedRetiredPortReturn}
              onChange={setClientExpectedRetiredPortReturn}
              unit="%"
            />
            <InputLine
              label="อัตราเงินเฟ้อ"
              value={inflationRate}
              onChange={setInflationRate}
              unit="%"
            />
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded font-bold"
            >
              บันทึก
            </button>
            <button
              onClick={handleCalculate}
              className="bg-blue-600 text-white px-4 py-2 rounded font-bold"
            >
              คำนวณ
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
