import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Footer from "../components/footer.jsx"
import Header from "../components/header.jsx"
import ClientBluePanel from "../components/clientBluePanel.jsx"
import PortfolioPieChart from "../components/portfolioPieChart.jsx"
import { calculatePortfolioSummary } from "../utils/calculations.js"

export default function CFPGoalBase() {
  const { clientId } = useParams()
  const { cfpId } = useParams()
  const navigate = useNavigate()

  const [assets, setAssets] = useState([])
  const [totalInvestment, setTotalInvestment] = useState(0)
  const [portfolioReturn, setPortfolioReturn] = useState(0)

  // Fields from GeneralGoal
  const [clientNetIncome, setClientNetIncome] = useState("") // กระแสเงินสดสุทธิต่อปี
  const [clientNetIncomeGrowth, setClientNetIncomeGrowth] = useState("") // %
  const [clientGeneralGoalName, setClientGeneralGoalName] = useState("") // ชื่อเป้าหมาย
  const [clientGeneralGoalValue, setClientGeneralGoalValue] = useState("") // จำนวนเงินเพื่อเป้าหมาย
  const [clientGeneralGoalPeriod, setClientGeneralGoalPeriod] = useState("") // ระยะเวลาเป้าหมาย

  const [generalGoalExists, setGeneralGoalExists] = useState(false)

  useEffect(() => {
    fetchAssets()
    fetchGeneralGoal()
  }, [clientId])

  const fetchAssets = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/portassets/${clientId}`
      )
      if (!response.ok) throw new Error("Failed to fetch assets")
      const data = await response.json()
      setAssets(data)

      const { totalInvestAmount, portReturn } = calculatePortfolioSummary(data)
      setTotalInvestment(totalInvestAmount)
      setPortfolioReturn(portReturn)
    } catch (error) {
      console.error("Error fetching assets:", error)
    }
  }

  const fetchGeneralGoal = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/generalgoal/${clientId}`
      )
      if (response.ok) {
        const gg = await response.json()
        setGeneralGoalExists(true)
        setClientNetIncome(gg.clientNetIncome?.toString() || "")
        setClientNetIncomeGrowth(
          (gg.clientNetIncomeGrowth * 100)?.toString() || ""
        )
        setClientGeneralGoalName(gg.clientGeneralGoalName || "")
        setClientGeneralGoalValue(gg.clientGeneralGoalValue?.toString() || "")
        setClientGeneralGoalPeriod(gg.clientGeneralGoalPeriod?.toString() || "")
      } else {
        // No general goal yet
        setGeneralGoalExists(false)
      }
    } catch (error) {
      console.error("Error fetching general goal:", error)
    }
  }

  const handleSaveGoal = async () => {
    // Construct GeneralGoal object
    const goal = {
      clientId: parseInt(clientId),
      clientGeneralGoalName: clientGeneralGoalName,
      clientGeneralGoalValue: parseFloat(clientGeneralGoalValue),
      clientGeneralGoalPeriod: parseInt(clientGeneralGoalPeriod),
      clientNetIncome: parseFloat(clientNetIncome),
      clientNetIncomeGrowth: parseFloat(clientNetIncomeGrowth) / 100, // convert % to decimal
    }

    const method = generalGoalExists ? "PUT" : "POST"
    const url = generalGoalExists
      ? `http://localhost:8080/api/generalgoal/${clientId}`
      : `http://localhost:8080/api/generalgoal`

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(goal),
      })

      if (!response.ok) throw new Error("Failed to save general goal")

      setGeneralGoalExists(true) // now definitely exists
      // You could also refresh data if needed
    } catch (error) {
      console.error("Error saving general goal:", error)
    }
  }

  const handleCalculate = () => {
    // Navigate to calculation result page
    // Adjust the route as desired
    navigate(`/${cfpId}/goal-base-calculated/${clientId}`)
  }

  const handleNavigateRetirement = () => {
    navigate(`/${cfpId}/retirement-goal/${clientId}`)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <ClientBluePanel />
        <div className="flex-1 p-4 space-y-8">
          {/* Top buttons */}
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

          {/* Pie Chart and summary */}
          <div className="flex space-x-8 items-center justify-center">
            <PortfolioPieChart assets={assets} width={300} height={300} />
            <div className="flex flex-col space-y-2">
              <p className="text-lg font-ibm font-bold text-tfpa_blue">
                เงินรวมปัจจุบันในการลงทุน: {totalInvestment.toLocaleString()}{" "}
                บาท
              </p>
              <p className="text-lg font-ibm font-bold text-tfpa_blue">
                ผลตอบแทนต่อปีของพอร์ตที่ลงทุนปัจจุบัน:{" "}
                {(portfolioReturn * 100).toFixed(2)} %
              </p>
            </div>
          </div>

          {/* Input fields */}
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col space-y-4">
              <div>
                <label className="font-ibm font-bold text-tfpa_blue">
                  กระแสเงินสดสุทธิต่อปี (บาท)
                </label>
                <input
                  type="number"
                  value={clientNetIncome}
                  onChange={(e) => setClientNetIncome(e.target.value)}
                  className="border rounded p-2 w-full font-ibm mt-1"
                />
              </div>
              <div>
                <label className="font-ibm font-bold text-tfpa_blue">
                  อัตราการเติบโตของกระแสเงินสดสุทธิต่อปี (%)
                </label>
                <input
                  type="number"
                  value={clientNetIncomeGrowth}
                  onChange={(e) => setClientNetIncomeGrowth(e.target.value)}
                  className="border rounded p-2 w-full font-ibm mt-1"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <div>
                <label className="font-ibm font-bold text-tfpa_blue">
                  ชื่อเป้าหมาย
                </label>
                <input
                  type="text"
                  value={clientGeneralGoalName}
                  onChange={(e) => setClientGeneralGoalName(e.target.value)}
                  className="border rounded p-2 w-full font-ibm mt-1"
                />
              </div>
              <div>
                <label className="font-ibm font-bold text-tfpa_blue">
                  จำนวนเงินเพื่อเป้าหมาย (บาท)
                </label>
                <input
                  type="number"
                  value={clientGeneralGoalValue}
                  onChange={(e) => setClientGeneralGoalValue(e.target.value)}
                  className="border rounded p-2 w-full font-ibm mt-1"
                />
              </div>
              <div>
                <label className="font-ibm font-bold text-tfpa_blue">
                  ระยะเวลาเป้าหมาย (ปี)
                </label>
                <input
                  type="number"
                  value={clientGeneralGoalPeriod}
                  onChange={(e) => setClientGeneralGoalPeriod(e.target.value)}
                  className="border rounded p-2 w-full font-ibm mt-1"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={handleSaveGoal}
              className="bg-blue-500 text-white px-4 py-2 rounded font-ibm"
            >
              บันทึก
            </button>
            <button
              onClick={handleCalculate}
              className="bg-blue-600 text-white px-4 py-2 rounded font-ibm"
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
