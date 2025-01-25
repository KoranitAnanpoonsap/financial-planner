import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Footer from "../components/footer.jsx"
import Header from "../components/cfpHeader.jsx"
import CfpClientSidePanel from "../components/cfpClientSidePanel.jsx"
import { calculateGoal } from "../utils/calculations.js"
import { motion } from "framer-motion"

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 1 },
}

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.4,
}

export default function CFPGoalBaseCalculated() {
  const [clientUuid] = useState(localStorage.getItem("clientUuid") || "")
  const navigate = useNavigate()

  const [Goal, setGoal] = useState(null)
  const [fvOfCurrentInvestment, setFvOfCurrentInvestment] = useState(0)
  const [GoalAnnualSaving, setGoalAnnualSaving] = useState(0)

  useEffect(() => {
    fetchAllData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientUuid])

  const fetchAllData = async () => {
    try {
      // Fetch goal
      const gResponse = await fetch(
        `${import.meta.env.VITE_API_KEY}api/calculategoal/${clientUuid}`
      )
      if (!gResponse.ok) {
        throw new Error("No goal data found")
      }
      const gData = await gResponse.json()
      setGoal(gData)

      // Calculate goal
      const { fvOfCurrentInvestment: fv, GoalAnnualSaving: saving } =
        calculateGoal(gData)
      setFvOfCurrentInvestment(fv)
      setGoalAnnualSaving(saving)
    } catch (error) {
      console.error("Error fetching data:", error)
      // Optionally, you can set default values or handle the error state here
    }
  }

  const handleNavigateRetirement = () => {
    navigate(`/retirement-goal/`)
  }

  const handleNavigateGoal = () => {
    navigate(`/goal-base/`)
  }

  const handleDashboard = () => {
    navigate(`/goal-base-dashboard/`)
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
              className="bg-tfpa_gold px-4 py-2 rounded font-bold text-white"
              onClick={handleNavigateGoal}
            >
              เป้าหมายทั่วไป
            </button>
            <button
              className="bg-gray-200 px-4 py-2 rounded font-bold text-tfpa_blue"
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
            {/* Blue Box with Goal Info */}
            {Goal && (
              <div className="bg-tfpa_blue p-6 rounded-3xl space-y-6 text-white font-bold mx-32">
                {/* Goal Name */}
                <h2 className="text-center text-2xl">{Goal.goalName}</h2>

                {/* Two columns for details */}
                <div className="grid grid-cols-2 gap-8">
                  {/* Left Column: Net Income and Growth */}
                  <div className="flex flex-col space-y-4 text-xl">
                    <div className="flex justify-between">
                      <span>กระแสเงินสดสุทธิต่อปี</span>
                      <span>{Number(Goal.netIncome).toLocaleString()} บาท</span>
                    </div>
                    <div className="flex justify-between">
                      <span>อัตราการเติบโตของกระแสเงินสดสุทธิต่อปี</span>
                      <span>{(Goal.netIncomeGrowth * 100).toFixed(2)} %</span>
                    </div>
                  </div>

                  {/* Right Column: Goal Value and Period */}
                  <div className="flex flex-col space-y-4 text-xl">
                    <div className="flex justify-between">
                      <span>จำนวนเงินเพื่อเป้าหมาย</span>
                      <span>{Number(Goal.goalValue).toLocaleString()} บาท</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ระยะเวลาเป้าหมาย</span>
                      <span>{Goal.goalPeriod} ปี</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            {Goal && (
              <div className="flex flex-col items-center space-y-4 text-xl font-bold mt-4 mb-4">
                <div className="flex space-x-4 items-center text-tfpa_gold">
                  <span>เงินรวมปัจจุบันในการลงทุนคิดเป็นค่าเงินในอนาคต</span>
                  <span>{fvOfCurrentInvestment.toLocaleString()}</span>
                  <span>บาท</span>
                </div>

                <div className="flex space-x-4 items-center text-tfpa_gold">
                  <span>เงินที่ต้องเก็บออมต่อปี</span>
                  <span>
                    {GoalAnnualSaving < 0
                      ? 0
                      : GoalAnnualSaving.toLocaleString()}
                  </span>
                  <span>บาท</span>
                </div>

                <div
                  className={`px-52 py-2 rounded-3xl ${
                    GoalAnnualSaving <= Number(Goal.netIncome)
                      ? "bg-green-300 text-green-950"
                      : "bg-red-300 text-red-950"
                  }`}
                >
                  {GoalAnnualSaving <= Number(Goal.netIncome)
                    ? "เงินที่ออมอยู่ต่อปีมีเพียงพอ"
                    : "เงินที่ออมอยู่ต่อปีมีไม่เพียงพอ"}
                </div>
              </div>
            )}

            {/* Dashboard Button */}
            <div className="flex justify-center">
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
