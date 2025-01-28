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
  const [PortfolioReturn, setPortfolioReturn] = useState("")
  const [NetIncome, setNetIncome] = useState("")

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
      setTotalInvestment(gData.totalInvestment?.toString() || "")
      setPortfolioReturn(
        gData.portReturn !== undefined
          ? (gData.portReturn * 100).toFixed(2)
          : ""
      )

      const totalInvestAmount = gData.totalInvestment
      const portReturn = gData.portReturn

      // Fetch assets
      const assetsResponse = await fetch(
        `${import.meta.env.VITE_API_KEY}api/portassets/${clientUuid}`
      )
      if (!assetsResponse.ok) {
        throw new Error("Failed to fetch assets")
      }
      const assetsData = await assetsResponse.json()
      setAssets(assetsData)

      // Calculate goal
      const { fvOfCurrentInvestment: fv, GoalAnnualSaving: saving } =
        calculateGoal(gData, totalInvestAmount, portReturn)
      setFvOfCurrentInvestment(fv)
      setGoalAnnualSaving(saving)
    } catch (error) {
      console.error("Error fetching data:", error)
      // Optionally, you can set default values or handle the error state here
    }
  }

  const CalculatedGoalBasedEfficient = () => {
    return (
      Goal && (
        <div className="flex flex-col items-center bg-tfpa_blue text-center p-6 text-2xl rounded-3xl space-y-6 text-white font-bold">
          <div>เป้าหมาย: {Goal.goalName}</div>
          <div>เงินลงทุนและกระแสเงินสดของลูกค้า</div>
          <div
            className={`w-[70%] py-2 p-0 rounded-3xl text-xl ${
              GoalAnnualSaving <= Number(Goal.netIncome)
                ? "bg-green-300 text-green-950"
                : "bg-red-300 text-red-950"
            }`}
          >
            {GoalAnnualSaving <= Number(Goal.netIncome)
              ? '"เพียงพอต่อเป้าหมาย"'
              : '"ไม่เพียงพอต่อเป้าหมาย"'}
          </div>
        </div>
      )
    )
  }

  const CalculateGoalBasedFinance = () => {
    return (
      Goal && (
        <div className="bg-tfpa_blue text-center p-6 text-xl rounded-3xl space-y-6 text-white font-bold">
          <div>สถานะการเงินในปัจจุบันของลูกค้า</div>
          <div className="text-lg grid grid-cols-2 text-start mx-8">
            <div>
              เงินรวมปัจจุบันในการลงทุน:{" "}
              {Number(Goal.totalInvestment).toLocaleString("en-us", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              บาท
            </div>
            <div>
              กระเเสเงินสดสุทธิเฉลี่ยต่อปี:{" "}
              {Number(NetIncome).toLocaleString("en-us", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              บาท
            </div>
            <div>
              ผลตอบเเทนต่อปีของพอร์ตที่ลงทุนในปัจจุบัน:{" "}
              {PortfolioReturn.toLocaleString()}%
            </div>
            <div>
              อัตราการเติบโตของกระเเสเงินสดสุทธิต่อปี:{" "}
              {(Goal.netIncomeGrowth * 100).toFixed(2).toLocaleString()}%
            </div>
            <div>
              เงินรวมปัจจุบันในการลงทุนในอีก {Goal.goalPeriod.toLocaleString()}{" "}
              ปี: {fvOfCurrentInvestment.toLocaleString()} บาท
            </div>
          </div>
        </div>
      )
    )
  }

  const CalculateGoalBasedGoalDetails = () => {
    return (
      Goal && (
        <div className="bg-tfpa_blue text-center p-6 text-xl rounded-3xl space-y-6 text-white font-bold">
          <div>รายละเอียดเป้าหมาย</div>
          <div className="text-lg grid grid-cols-2 text-start mx-8">
            <div className="">
              จำนวนเงินเพื่อเป้าหมาย:{" "}
              {Number(Goal.goalValue).toLocaleString("en-us", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              บาท
            </div>
            <div className="">
              ระยะเวลาเป้าหมาย: {Goal.goalPeriod.toLocaleString()} ปี
            </div>
          </div>
        </div>
      )
    )
  }

  const handleNavigateRetirement = () => {
    navigate(`/retirement-goal/`)
  }

  const handleNavigateBack = () => {
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
          <div className="flex space-x-4 justify-end">
            <button
              onClick={handleNavigateBack}
              className="bg-gray-300 hover:bg-gray-400 text-tfpa_blue px-4 py-2 rounded font-ibm font-bold"
            >
              กลับ
            </button>
          </div>

          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <div className="flex flex-col gap-8 mx-32">
              <CalculatedGoalBasedEfficient />
              <div className="text-tfpa_gold text-xl font-bold grid grid-cols-2 text-start mx-12">
                <span>
                  จำนวนเงินที่ลูกค้าต้องเก็บออมเพิ่มต่อปี:{" "}
                  {GoalAnnualSaving < 0
                    ? 0
                    : Number(GoalAnnualSaving).toLocaleString("en-us", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                  บาท
                </span>
                <span>
                  เฉลี่ยเดือนละ:{" "}
                  {GoalAnnualSaving < 0
                    ? 0
                    : Number(GoalAnnualSaving / 12).toLocaleString("en-us", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                  บาท
                </span>
              </div>
              <CalculateGoalBasedFinance />
              <CalculateGoalBasedGoalDetails />
              {/* Dashboard Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleDashboard}
                  className="bg-tfpa_blue hover:bg-tfpa_blue_hover text-white px-4 py-2 rounded font-bold"
                >
                  Dashboard
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
