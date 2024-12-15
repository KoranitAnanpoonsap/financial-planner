import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Footer from "../components/footer.jsx"
import Header from "../components/header.jsx"
import ClientBluePanel from "../components/clientBluePanel.jsx"
import {
  calculatePortfolioSummary,
  calculateGeneralGoal,
} from "../utils/calculations.js"

export default function CFPGoalBaseCalculated() {
  const { clientId, cfpId } = useParams()
  const navigate = useNavigate()

  const [assets, setAssets] = useState([])
  const [totalInvestment, setTotalInvestment] = useState(0)
  const [portfolioReturn, setPortfolioReturn] = useState(0)

  const [generalGoal, setGeneralGoal] = useState(null)

  const [fvOfCurrentInvestment, setFvOfCurrentInvestment] = useState(0)
  const [generalGoalAnnualSaving, setGeneralGoalAnnualSaving] = useState(0)

  useEffect(() => {
    fetchAllData()
  }, [clientId])

  const fetchAllData = async () => {
    try {
      // Fetch general goal
      const ggRes = await fetch(
        `http://localhost:8080/api/generalgoal/${clientId}`
      )
      if (!ggRes.ok) {
        throw new Error("No general goal data found")
      }
      const ggData = await ggRes.json()
      setGeneralGoal(ggData)

      // Fetch assets
      const assetsRes = await fetch(
        `http://localhost:8080/api/portassets/${clientId}`
      )
      if (!assetsRes.ok) {
        throw new Error("Failed to fetch assets")
      }
      const assetsData = await assetsRes.json()
      setAssets(assetsData)

      // Calculate portfolio summary
      const { totalInvestAmount, portReturn } =
        calculatePortfolioSummary(assetsData)
      setTotalInvestment(totalInvestAmount)
      setPortfolioReturn(portReturn)

      // Now do the general goal calculation
      const { fvOfCurrentInvestment: fv, generalGoalAnnualSaving: saving } =
        calculateGeneralGoal(ggData, totalInvestAmount, portReturn)
      setFvOfCurrentInvestment(fv)
      setGeneralGoalAnnualSaving(saving)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const handleNavigateRetirement = () => {
    navigate(`/${cfpId}/retirement-goal/${clientId}`)
  }

  const handleDashboard = () => {
    navigate(`/${cfpId}/dashboard`)
  }

  if (!generalGoal) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <ClientBluePanel />
          <div className="flex-1 p-4 font-ibm">
            <p>Loading or no general goal found...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const isSufficient = generalGoalAnnualSaving <= 0

  return (
    <div className="flex flex-col min-h-screen font-ibm">
      <Header />
      <div className="flex flex-1">
        <ClientBluePanel />
        <div className="flex-1 p-4 space-y-8">
          {/* Top buttons */}
          <div className="flex space-x-4 justify-center">
            <button className="bg-tfpa_gold px-4 py-2 rounded font-bold text-white">
              เป้าหมายทั่วไป
            </button>
            <button
              className="bg-gray-200 px-4 py-2 rounded font-bold text-tfpa_blue"
              onClick={handleNavigateRetirement}
            >
              เป้าหมายเกษียณ
            </button>
          </div>

          {/* Blue Box with Goal Info */}
          <div className="bg-tfpa_blue p-6 rounded-3xl space-y-6 text-white font-bold mx-32">
            {/* Goal Name at the top, centered */}
            <h2 className="text-center text-2xl">
              {generalGoal.clientGeneralGoalName}
            </h2>

            {/* Two columns for details */}
            <div className="grid grid-cols-2 gap-8">
              {/* Left Column: Net Income and Growth */}
              <div className="flex flex-col space-y-4 text-xl">
                <div className="flex space-x-2 items-center justify-between">
                  <span>กระแสเงินสดสุทธิต่อปี</span>
                  <span>
                    {Number(generalGoal.clientNetIncome).toLocaleString()} บาท
                  </span>
                </div>
                <div className="flex space-x-2 items-center justify-between">
                  <span>อัตราการเติบโตของกระแสเงินสดสุทธิต่อปี</span>
                  <span>
                    {(generalGoal.clientNetIncomeGrowth * 100).toFixed(2)} %
                  </span>
                </div>
              </div>

              {/* Right Column: Goal Value and Period */}
              <div className="flex flex-col space-y-4 text-xl">
                <div className="flex space-x-2 items-center justify-between">
                  <span>จำนวนเงินเพื่อเป้าหมาย</span>
                  <span>
                    {Number(
                      generalGoal.clientGeneralGoalValue
                    ).toLocaleString()}{" "}
                    บาท
                  </span>
                </div>
                <div className="flex space-x-2 items-center justify-between">
                  <span>ระยะเวลาเป้าหมาย</span>
                  <span>{generalGoal.clientGeneralGoalPeriod} ปี</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex flex-col items-center space-y-4 text-xl font-bold">
            <div className="flex space-x-4 items-center text-tfpa_gold">
              <span>เงินรวมปัจจุบันในการลงทุนคิดเป็นค่าเงินในอนาคต</span>
              <span>{fvOfCurrentInvestment.toLocaleString()}</span>
              <span>บาท</span>
            </div>

            <div className="flex space-x-4 items-center text-tfpa_gold">
              <span>เงินที่ต้องเก็บออมต่อปี</span>
              <span>{Math.abs(generalGoalAnnualSaving).toLocaleString()}</span>
              <span>บาท</span>
            </div>

            {isSufficient ? (
              <div className="bg-green-300 px-52 py-2 rounded-3xl text-green-950">
                เงินที่ออมอยู่ต่อปีมีเพียงพอ
              </div>
            ) : (
              <div className="bg-red-300 px-52 py-2 rounded-3xl text-red-950">
                เงินที่ออมอยู่ต่อปีมีไม่เพียงพอ
              </div>
            )}
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
