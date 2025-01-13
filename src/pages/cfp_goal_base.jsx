import { useEffect, useState, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Footer from "../components/footer.jsx"
import Header from "../components/header.jsx"
import ClientBluePanel from "../components/clientBluePanel.jsx"
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
  const [cfpId] = useState(Number(localStorage.getItem("cfpId")) || "")
  const [clientId] = useState(Number(localStorage.getItem("clientId")) || "")
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

  // Ref for debounce timer
  const debounceTimer = useRef(null)

  useEffect(() => {
    fetchAllData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId])

  const fetchAllData = async () => {
    try {
      const [assetsRes, generalGoalRes] = await Promise.all([
        fetch(`http://localhost:8080/api/portassets/${clientId}`),
        fetch(`http://localhost:8080/api/generalgoal/${clientId}`),
      ])

      if (!assetsRes.ok) throw new Error("Failed to fetch assets")
      const assetsData = await assetsRes.json()
      setAssets(assetsData)

      const { totalInvestAmount, portReturn } =
        calculatePortfolioSummary(assetsData)
      setTotalInvestment(totalInvestAmount)
      setPortfolioReturn(portReturn)

      if (generalGoalRes.ok) {
        const gg = await generalGoalRes.json()
        setGeneralGoalExists(true)
        setClientNetIncome(gg.clientNetIncome?.toString() || "")
        setClientNetIncomeGrowth(
          gg.clientNetIncomeGrowth !== undefined
            ? (gg.clientNetIncomeGrowth * 100).toString()
            : ""
        )
        setClientGeneralGoalName(gg.clientGeneralGoalName || "")
        setClientGeneralGoalValue(gg.clientGeneralGoalValue?.toString() || "")
        setClientGeneralGoalPeriod(gg.clientGeneralGoalPeriod?.toString() || "")
      } else {
        // No general goal yet
        setGeneralGoalExists(false)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  useEffect(() => {
    // Function to validate inputs
    const isValid = () => {
      return (
        clientNetIncome !== "" &&
        clientNetIncomeGrowth !== "" &&
        clientGeneralGoalName.trim() !== "" &&
        clientGeneralGoalValue !== "" &&
        clientGeneralGoalPeriod !== ""
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
    clientNetIncome,
    clientNetIncomeGrowth,
    clientGeneralGoalName,
    clientGeneralGoalValue,
    clientGeneralGoalPeriod,
  ])

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

      await response.json()

      setGeneralGoalExists(true) // now definitely exists
      // Optionally, you can refetch data or provide other feedback mechanisms
    } catch (error) {
      console.error("Error saving general goal:", error)
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

          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
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
            <div className="grid grid-cols-2 gap-8 mt-4">
              <div className="flex flex-col space-y-4">
                <div>
                  <label className="font-ibm font-bold text-tfpa_blue">
                    กระแสเงินสดสุทธิต่อปี (บาท)
                  </label>
                  <input
                    type="number"
                    value={clientNetIncome}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => setClientNetIncome(e.target.value)}
                    className="border rounded p-2 w-full font-ibm mt-1 focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                  />
                </div>
                <div>
                  <label className="font-ibm font-bold text-tfpa_blue">
                    อัตราการเติบโตของกระแสเงินสดสุทธิต่อปี (%)
                  </label>
                  <input
                    type="number"
                    value={clientNetIncomeGrowth}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => setClientNetIncomeGrowth(e.target.value)}
                    className="border rounded p-2 w-full font-ibm mt-1 focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
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
                    className="border rounded p-2 w-full font-ibm mt-1 focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                  />
                </div>
                <div>
                  <label className="font-ibm font-bold text-tfpa_blue">
                    จำนวนเงินเพื่อเป้าหมาย (บาท)
                  </label>
                  <input
                    type="number"
                    value={clientGeneralGoalValue}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => setClientGeneralGoalValue(e.target.value)}
                    className="border rounded p-2 w-full font-ibm mt-1 focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                  />
                </div>
                <div>
                  <label className="font-ibm font-bold text-tfpa_blue">
                    ระยะเวลาเป้าหมาย (ปี)
                  </label>
                  <input
                    type="number"
                    value={clientGeneralGoalPeriod}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => setClientGeneralGoalPeriod(e.target.value)}
                    className="border rounded p-2 w-full font-ibm mt-1 focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                  />
                </div>
              </div>
            </div>

            {/* Calculate Button */}
            <div className="flex justify-end space-x-4 mt-4 mb-4">
              <button
                onClick={handleCalculate}
                className="bg-tfpa_blue hover:bg-tfpa_blue_hover text-white px-4 py-2 rounded font-ibm"
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
