import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Footer from "../components/footer.jsx"
import Header from "../components/header.jsx"
import ClientBluePanel from "../components/clientBluePanel.jsx"
import { calculatePortfolioSummary } from "../utils/calculations.js"
import PortfolioPieChart from "../components/portfolioPieChart.jsx"

export default function CFPCashflowBase() {
  const { clientId } = useParams()
  const { cfpId } = useParams()
  const navigate = useNavigate()

  const [assets, setAssets] = useState([])
  const [totalInvestment, setTotalInvestment] = useState(0)
  const [portfolioReturn, setPortfolioReturn] = useState(0)

  // For client incomes
  const [incomes, setIncomes] = useState([])

  // For goals
  const [goals, setGoals] = useState([])
  const [clientGoalName, setClientGoalName] = useState("")
  const [clientGoalValue, setClientGoalValue] = useState("")
  const [clientGoalPeriod, setClientGoalPeriod] = useState("")
  const [clientSavingGrowth, setClientSavingGrowth] = useState("")

  const [editMode, setEditMode] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)

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

      const { totalInvestAmount, portReturn } = calculatePortfolioSummary(data)
      setTotalInvestment(totalInvestAmount)
      setPortfolioReturn(portReturn)
    } catch (error) {
      console.error("Error fetching assets:", error)
    }
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

  const handleCreateOrUpdateGoal = async () => {
    const newGoal = {
      id: {
        clientId: parseInt(clientId),
        clientGoalName: clientGoalName,
      },
      clientGoalValue: parseFloat(clientGoalValue),
      clientGoalPeriod: parseInt(clientGoalPeriod),
      clientSavingGrowth: parseFloat(clientSavingGrowth) / 100,
    }

    let url = `http://localhost:8080/api/cashflow`
    let method = "POST"
    if (editMode && editingGoal) {
      // Update mode
      url = `http://localhost:8080/api/cashflow/${clientId}/${editingGoal.id.clientGoalName}`
      method = "PUT"
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGoal),
      })

      if (!response.ok) {
        throw new Error("Failed to create/update goal")
      }

      await response.json()

      // Refresh goals
      await fetchGoals()

      // Reset fields
      setClientGoalName("")
      setClientGoalValue("")
      setClientGoalPeriod("")
      setClientSavingGrowth("")
      setEditMode(false)
      setEditingGoal(null)
    } catch (error) {
      console.error("Error creating/updating goal:", error)
    }
  }

  const handleDeleteGoal = async (goal) => {
    const { clientId: gClientId, clientGoalName: gGoalName } = goal.id

    try {
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

  const handleEdit = (goal) => {
    setEditMode(true)
    setEditingGoal(goal)
    setClientGoalName(goal.id.clientGoalName)
    setClientGoalValue(goal.clientGoalValue.toString())
    setClientGoalPeriod(goal.clientGoalPeriod.toString())
    setClientSavingGrowth((goal.clientSavingGrowth * 100).toString())
  }

  const handleCancelEdit = () => {
    setEditMode(false)
    setEditingGoal(null)
    setClientGoalName("")
    setClientGoalValue("")
    setClientGoalPeriod("")
    setClientSavingGrowth("")
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
          <div className="flex justify-center items-center space-x-8">
            <PortfolioPieChart assets={assets} width={300} height={300} />
            <div className="flex flex-col justify-center space-y-2">
              <p className="text-lg font-ibm font-bold text-tfpa_blue">
                เงินรวมปัจจุบันในการลงทุน: {totalInvestment.toLocaleString()}{" "}
                บาท
              </p>
              <p className="text-lg font-ibm font-bold text-tfpa_blue">
                ผลตอบแทนต่อปีของพอร์ตที่ลงทุนปัจจุบัน:{" "}
                {(portfolioReturn * 100).toFixed(2)} %
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
            <h3 className="text-xl mb-2 font-ibm font-bold text-tfpa_blue">
              สร้างเป้าหมาย
            </h3>
            <label className="text-tfpa_blue font-ibm font-bold mb-2">
              ชื่อเป้าหมาย
            </label>
            <input
              type="text"
              placeholder="ชื่อเป้าหมาย"
              value={clientGoalName}
              onChange={(e) => setClientGoalName(e.target.value)}
              className="border rounded p-2 mb-2 w-full font-ibm"
            />
            <label className="text-tfpa_blue font-ibm font-bold mb-2">
              จำนวนเงินเพื่อเป้าหมาย
            </label>
            <input
              type="number"
              placeholder="จำนวนเงินเพื่อเป้าหมาย"
              value={clientGoalValue}
              onChange={(e) => setClientGoalValue(e.target.value)}
              className="border rounded p-2 mb-2 w-full font-ibm"
            />
            <label className="text-tfpa_blue font-ibm font-bold mb-2">
              ระยะเวลาเป้าหมาย (ปี)
            </label>
            <input
              type="number"
              placeholder="ระยะเวลาเป้าหมาย (ปี)"
              value={clientGoalPeriod}
              onChange={(e) => setClientGoalPeriod(e.target.value)}
              className="border rounded p-2 mb-2 w-full font-ibm"
            />
            <label className="text-tfpa_blue font-ibm font-bold mb-2">
              อัตราเติบโตของเงินออม (%)
            </label>
            <input
              type="number"
              placeholder="อัตราเติบโตของเงินออม (%)"
              value={clientSavingGrowth}
              onChange={(e) => setClientSavingGrowth(e.target.value)}
              className="border rounded p-2 mb-2 w-full font-ibm"
            />

            <div className="flex space-x-4">
              {editMode ? (
                <>
                  <button
                    onClick={handleCreateOrUpdateGoal}
                    className="bg-red-500 text-white px-4 py-2 rounded font-ibm font-bold"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-300 text-tfpa_blue px-4 py-2 rounded font-ibm font-bold"
                  >
                    ยกเลิก
                  </button>
                </>
              ) : (
                <button
                  onClick={handleCreateOrUpdateGoal}
                  className="bg-green-500 text-white px-4 py-2 rounded font-ibm font-bold"
                >
                  เพิ่มเป้าหมาย
                </button>
              )}
            </div>
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
                    <td className="py-2 px-4 border">
                      {goal.clientGoalValue.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border">
                      {goal.clientGoalPeriod}
                    </td>
                    <td className="py-2 px-4 border">
                      {(goal.clientSavingGrowth * 100).toFixed(2)}%
                    </td>
                    <td className="py-2 px-4 border">
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleEdit(goal)}
                          className="bg-blue-500 text-white px-4 py-1 rounded font-ibm"
                        >
                          แก้ไข
                        </button>
                        <button
                          onClick={() => handleDeleteGoal(goal)}
                          className="bg-red-500 text-white px-4 py-1 rounded font-ibm"
                        >
                          ลบ
                        </button>
                      </div>
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
