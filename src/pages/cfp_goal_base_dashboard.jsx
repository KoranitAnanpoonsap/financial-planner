import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Footer from "../components/footer.jsx"
import Header from "../components/cfpHeader.jsx"
import CfpClientSidePanel from "../components/cfpClientSidePanel.jsx"
import {
  calculatePortfolioSummary,
  calculateGoal,
} from "../utils/calculations.js"
import { motion } from "framer-motion"
import PortfolioPieChart from "../components/portfolioPieChart.jsx"

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

export default function CFPGoalBaseDashboard() {
  const [clientUuid] = useState(localStorage.getItem("clientUuid") || "")
  const navigate = useNavigate()

  const [assets, setAssets] = useState([])
  const [Goal, setGoal] = useState(null)
  const [fvOfCurrentInvestment, setFvOfCurrentInvestment] = useState(0)
  const [GoalAnnualSaving, setGoalAnnualSaving] = useState(0)

  useEffect(() => {
    fetchAllData()
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

  const handleNavigateRetirement = () => {
    navigate(`/retirement-goal/`)
  }

  const handleNavigateGoal = () => {
    navigate(`/goal-base/`)
  }

  const InvestmentProportion = () => {
    return (
      <div className="w-[300px] h-[300px] bg-gray-50 flex flex-col items-center py-1 gap-1">
        <div className="w-full h-8 bg-tfpa_light_blue flex flex-col items-center justify-center">
          สัดส่วนการลงทุนปัจจุบัน
        </div>
        <div className="">
          <PortfolioPieChart
            assets={assets}
            width={200}
            height={200}
            percent={true}
          />
        </div>
      </div>
    )
  }

  const AnnualNetCashflow = () => {
    return (
      <div className="w-[300px] h-[300px] bg-gray-50 flex flex-col items-center py-1 gap-1">
        <div className="w-full h-8 bg-tfpa_light_blue flex flex-col items-center justify-center"></div>
        <div className="flex flex-col items-center justify-center h-full gap-5">
          กระแสเงินสดสุทธิปัจจุบันต่อปี
          <span className="text-[48px] font-bold font-sans">
            {Number(Goal.netIncome).toLocaleString()}{" "}
          </span>
        </div>
      </div>
    )
  }

  const CashFlowSufficient = () => {
    return (
      <div className="w-[300px] h-[300px] bg-gray-50 flex flex-col items-center py-1 gap-1">
        <div className="w-full h-8 bg-tfpa_light_blue flex flex-col items-center justify-center"></div>
        <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
          กระแสเงินสดเพียงพอ
          <br />
          ต่อการออมหรือไม่
          <span className="text-[48px] font-bold font-sans">
            {GoalAnnualSaving <= Number(Goal.netIncome)
              ? "เพียงพอ"
              : "ไม่เพียงพอ"}
          </span>
        </div>
      </div>
    )
  }

  const InstallmentsCount = () => {
    return (
      <div className="w-[300px] h-[300px] bg-gray-50 flex flex-col items-center py-1 gap-1">
        <div className="w-full h-8 bg-tfpa_light_blue flex flex-col items-center justify-center"></div>
        <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
          จำนวนครั้งที่ต้องเก็บออม
          <span className="text-[48px] font-bold font-sans">
            {Goal.goalPeriod}
          </span>
        </div>
      </div>
    )
  }

  const ApproachGoalBase = () => {
    return (
      <div className="w-[600px] h-[300px] bg-gray-50 flex flex-col py-1 gap-1">
        <div className="w-full h-8 bg-tfpa_light_blue flex flex-col items-center justify-center"></div>
        <div className="flex flex-col justify-center h-full">
          <div className="p-5 text-right">
            <div className="absolute text-2xl font-bold">
              {((fvOfCurrentInvestment / Goal.goalValue) * 100).toFixed(2)}%
            </div>
            สัดส่วนการลงทุนในปัจจุบันคิดเป็นค่าเงินในอนาคต
            <br />
            เทียบกับจำนวนเงินเป้าหมาย
            <div className={"flex h-3 bg-[#D9D9D9] rounded-xl"}>
              <div
                className={"flex h-3 bg-tfpa_light_blue mb-2 rounded-xl"}
                style={{
                  width:
                    ((fvOfCurrentInvestment / Goal.goalValue) * 100).toFixed(
                      2
                    ) < 100
                      ? (
                          (fvOfCurrentInvestment / Goal.goalValue) *
                          100
                        ).toFixed(2) + "%"
                      : "100%",
                }}
              ></div>
            </div>
          </div>
          <div className="p-5 text-right">
            <div className="absolute text-2xl font-bold">
              {(
                (Number(Goal.netIncome) / Math.abs(GoalAnnualSaving)) *
                100
              ).toFixed(2)}
              %
            </div>
            สัดส่วนกระเเสเงินสดต่อปี
            <br />
            เทียบกับจำนวนเงินที่ต้องเก็บออมต่อปี
            <div className={"flex h-3 bg-[#D9D9D9] rounded-xl"}>
              <div
                className={"flex h-3 bg-tfpa_light_blue mb-2 rounded-xl"}
                style={{
                  width:
                    (
                      (Number(Goal.netIncome) / Math.abs(GoalAnnualSaving)) *
                      100
                    ).toFixed(2) < 100
                      ? (
                          (Number(Goal.netIncome) /
                            Math.abs(GoalAnnualSaving)) *
                          100
                        ).toFixed(2) + "%"
                      : "100%",
                }}
              ></div>
            </div>
            {/*<div className={"flex h-2 bg-tfpa_light_blue"}*/}
            {/*     style={{*/}
            {/*         width: ((Number(Goal.netIncome) / Math.abs(GoalAnnualSaving)).toFixed(2)) < 100 ? ((Number(Goal.netIncome) / Math.abs(GoalAnnualSaving)).toFixed(2)) : 100 + "%",*/}
            {/*         borderRightWidth: ((Number(Goal.netIncome) / Math.abs(GoalAnnualSaving)).toFixed(2) < 100) ? (100 - (Number(Goal.netIncome) / Math.abs(GoalAnnualSaving)).toFixed(2)) : 0 + "%"*/}
            {/*     }}>*/}
            {/*</div>*/}
          </div>
        </div>
      </div>
    )
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
              <>
                {/* Goal Name */}
                <h1 className="text-center text-4xl text-tfpa_blue font-bold">
                  เป้าหมาย: {Goal.goalName}
                </h1>
                <div className="flex flex-wrap gap-2 w-full justify-between my-3 px-8 text-tfpa_blue font-bold">
                  <InvestmentProportion />
                  <AnnualNetCashflow />
                  <CashFlowSufficient />
                  <InstallmentsCount />
                  <ApproachGoalBase />
                </div>
                <div className="flex flex-wrap gap-2 w-full justify-between my-3 px-8 text-tfpa_blue font-bold"></div>
              </>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
