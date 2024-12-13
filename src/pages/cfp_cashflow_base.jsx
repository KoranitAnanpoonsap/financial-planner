import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Footer from "../components/footer.jsx"
import Header from "../components/header.jsx"
import ClientBluePanel from "../components/clientBluePanel.jsx"
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

export default function CFPCashflowBase() {
  const { clientId } = useParams()
  const { cfpId } = useParams()
  const navigate = useNavigate()

  const [assets, setAssets] = useState([])
  const [totalInvestment, setTotalInvestment] = useState(0)
  const [annualReturn, setAnnualReturn] = useState(0)

  // For client incomes
  const [incomes, setIncomes] = useState([])

  // For goals
  const [goals, setGoals] = useState([])
  const [clientGoalName, setClientGoalName] = useState("")
  const [clientGoalValue, setClientGoalValue] = useState("")
  const [clientGoalPeriod, setClientGoalPeriod] = useState("")
  const [clientSavingGrowth, setClientSavingGrowth] = useState("")

  useEffect(() => {
    fetchAssets()
    fetchIncomes()
    fetchGoals()
  }, [clientId])

  const fetchAssets = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/portassets/${clientId}`
      )
      if (!response.ok) {
        throw new Error("Failed to fetch assets")
      }
      const data = await response.json()
      setAssets(data)
      calculatePortfolioSummary(data)
    } catch (error) {
      console.error("Error fetching assets:", error)
    }
  }

  const calculatePortfolioSummary = (assets) => {
    let totalInvestAmount = 0
    let weightedReturnSum = 0

    for (const asset of assets) {
      totalInvestAmount += asset.investAmount
    }

    if (totalInvestAmount > 0) {
      for (const asset of assets) {
        const investAmount = asset.investAmount
        const yearlyReturn = asset.yearlyReturn
        const proportion = investAmount / totalInvestAmount
        weightedReturnSum += proportion * yearlyReturn
      }
    }

    totalInvestAmount = parseFloat(totalInvestAmount.toFixed(2))
    const portfolioReturn = parseFloat(weightedReturnSum.toFixed(4))

    setTotalInvestment(totalInvestAmount)
    setAnnualReturn(portfolioReturn)
  }

  const fetchIncomes = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/clientincome/${clientId}`
      )
      if (!response.ok) {
        throw new Error("Failed to fetch incomes")
      }
      const data = await response.json()
      setIncomes(data)
    } catch (error) {
      console.error("Error fetching incomes:", error)
    }
  }

  const fetchGoals = async () => {
    try {
      // GET /api/cashflow/{clientId} returns a list of CashflowGoal objects
      const response = await fetch(
        `http://localhost:8080/api/cashflow/${clientId}`
      )
      if (!response.ok) {
        throw new Error("Failed to fetch goals")
      }
      const data = await response.json()
      setGoals(data)
    } catch (error) {
      console.error("Error fetching goals:", error)
    }
  }

  const handleCreateGoal = async () => {
    // Construct the CashflowGoal object as expected by the POST /api/cashflow endpoint
    const newGoal = {
      id: {
        clientId: parseInt(clientId),
        clientGoalName: clientGoalName,
      },
      clientGoalValue: parseFloat(clientGoalValue),
      clientGoalPeriod: parseInt(clientGoalPeriod),
      clientSavingGrowth: parseFloat(clientSavingGrowth / 100),
    }

    try {
      const response = await fetch(`http://localhost:8080/api/cashflow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGoal),
      })

      if (!response.ok) {
        throw new Error("Failed to create goal")
      }

      const createdGoal = await response.json()
      setGoals((prev) => [...prev, createdGoal])

      // Reset fields
      setClientGoalName("")
      setClientGoalValue("")
      setClientGoalPeriod("")
      setClientSavingGrowth("")
    } catch (error) {
      console.error("Error creating goal:", error)
    }
  }

  const handleDeleteGoal = async (goal) => {
    // goal.id contains { clientId, clientGoalName }
    const { clientId: gClientId, clientGoalName: gGoalName } = goal.id

    try {
      // DELETE /api/cashflow/{clientId}/{clientGoalName}
      const response = await fetch(
        `http://localhost:8080/api/cashflow/${gClientId}/${gGoalName}`,
        {
          method: "DELETE",
        }
      )
      if (!response.ok) {
        throw new Error("Failed to delete goal")
      }

      setGoals((prev) => prev.filter((g) => g.id.clientGoalName !== gGoalName))
    } catch (error) {
      console.error("Error deleting goal:", error)
    }
  }

  // Chart data
  const dataMap = {}
  assets.forEach((asset) => {
    const { investType, investAmount } = asset
    dataMap[investType] = (dataMap[investType] || 0) + investAmount
  })

  const getColorForType = (type) => {
    switch (type) {
      case "หุ้นไทย":
        return "#FF6384"
      case "หุ้นต่างประเทศ":
        return "#36A2EB"
      case "เงินฝาก":
        return "#FFCE56"
      case "ทองคำ":
        return "#4BC0C0"
      case "ตราสารหนี้":
        return "#9966FF"
      case "หุ้นกู้":
        return "#FF9F40"
      case "การลงทุนอื่นๆ":
        return "#FF6384"
      default:
        return "#CCCCCC"
    }
  }

  const chartData = {
    labels: Object.keys(dataMap),
    datasets: [
      {
        data: Object.values(dataMap),
        backgroundColor: Object.keys(dataMap).map(getColorForType),
      },
    ],
  }

  const handleCalculate = () => {
    navigate(`/${cfpId}/cashflow-base-calculated/${clientId}`)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <ClientBluePanel />
        <div className="flex-1 p-4 space-y-8">
          {/* Top Part: Chart and Summary */}
          <div className="flex space-x-8">
            <div style={{ width: "300px", height: "300px" }}>
              <Pie data={chartData} />
            </div>
            <div className="flex flex-col justify-center space-y-2">
              <p className="text-lg font-ibm font-bold text-tfpa_blue">
                เงินรวมปัจจุบันในการลงทุน: {totalInvestment.toFixed(2)} บาท
              </p>
              <p className="text-lg font-ibm font-bold text-tfpa_blue">
                ผลตอบแทนต่อปีของพอร์ตที่ลงทุนปัจจุบัน:{" "}
                {(annualReturn * 100).toFixed(2)} %
              </p>
            </div>
            {/* Client Income Growth Table */}
            <div className="bg-blue-200 p-4 rounded">
              <h3 className="text-center font-bold mb-2 font-ibm text-tfpa_blue">
                อัตราการเติบโตต่อปีของรายได้
              </h3>
              <table className="min-w-full bg-blue-100 border-blue-200">
                <thead>
                  <tr className="bg-blue-300">
                    <th className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                      ชื่อรายได้
                    </th>
                    <th className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                      อัตราเติบโต (%)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {incomes.map((income) => (
                    <tr key={income.clientIncomeName}>
                      <td className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                        {income.id.clientIncomeName}
                      </td>
                      <td className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                        {(income.clientIncomeAnnualGrowthRate * 100).toFixed(2)}
                        %
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Goal Input Section */}
          <div>
            <h3 className="text-lg mb-2 font-ibm font-bold text-tfpa_blue">
              สร้างเป้าหมาย
            </h3>
            <input
              type="text"
              placeholder="ชื่อเป้าหมาย"
              value={clientGoalName}
              onChange={(e) => setClientGoalName(e.target.value)}
              className="border rounded p-2 mb-2 w-full font-ibm"
            />
            <input
              type="number"
              placeholder="จำนวนเงินเพื่อเป้าหมาย"
              value={clientGoalValue}
              onChange={(e) => setClientGoalValue(e.target.value)}
              className="border rounded p-2 mb-2 w-full font-ibm"
            />
            <input
              type="number"
              placeholder="ระยะเวลาเป้าหมาย (ปี)"
              value={clientGoalPeriod}
              onChange={(e) => setClientGoalPeriod(e.target.value)}
              className="border rounded p-2 mb-2 w-full font-ibm"
            />
            <input
              type="number"
              placeholder="อัตราเติบโตของเงินออม (%)"
              value={clientSavingGrowth}
              onChange={(e) => setClientSavingGrowth(e.target.value)}
              className="border rounded p-2 mb-2 w-full font-ibm"
            />
            <button
              onClick={handleCreateGoal}
              className="bg-blue-500 text-white px-4 py-2 rounded font-ibm"
            >
              เพิ่มเป้าหมาย
            </button>
          </div>

          {/* Goals Table */}
          <div>
            <h3 className="text-lg mb-2 font-ibm font-bold text-tfpa_blue">
              เป้าหมายที่มีอยู่
            </h3>
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                    ชื่อเป้าหมาย
                  </th>
                  <th className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                    จำนวนเงินเพื่อเป้าหมาย
                  </th>
                  <th className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                    ระยะเวลาเป้าหมาย (ปี)
                  </th>
                  <th className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                    อัตราเติบโตของเงินออม (%)
                  </th>
                  <th className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody>
                {goals.map((goal) => (
                  <tr key={goal.id.clientGoalName}>
                    <td className="py-2 px-4 border">
                      {goal.id.clientGoalName}
                    </td>
                    <td className="py-2 px-4 border">{goal.clientGoalValue}</td>
                    <td className="py-2 px-4 border">
                      {goal.clientGoalPeriod}
                    </td>
                    <td className="py-2 px-4 border">
                      {(goal.clientSavingGrowth * 100).toFixed(2)}%
                    </td>
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() => handleDeleteGoal(goal)}
                        className="text-red-500 font-ibm"
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculate Button */}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleCalculate}
              className="bg-green-500 text-white px-4 py-2 rounded font-ibm"
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
