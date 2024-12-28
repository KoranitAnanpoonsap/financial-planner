import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Footer from "../components/footer.jsx"
import Header from "../components/header.jsx"
import ClientBluePanel from "../components/clientBluePanel.jsx"
import {
  calculatePortfolioSummary,
  calculateGeneralGoal,
} from "../utils/calculations.js"
import { motion } from "framer-motion"
import PortfolioPieChart from "../components/portfolioPieChart.jsx";

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
  const [cfpId] = useState(Number(localStorage.getItem("cfpId")) || "")
  const [clientId] = useState(Number(localStorage.getItem("clientId")) || "")
  const navigate = useNavigate()

  const [assets, setAssets] = useState([])
  const [totalInvestment, setTotalInvestment] = useState(0)
  const [portfolioReturn, setPortfolioReturn] = useState(0)
  const [generalGoal, setGeneralGoal] = useState(null)
  const [fvOfCurrentInvestment, setFvOfCurrentInvestment] = useState(0)
  const [generalGoalAnnualSaving, setGeneralGoalAnnualSaving] = useState(0)

  useEffect(() => {
    fetchAllData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId])

  const fetchAllData = async () => {
    try {
      // Fetch general goal
      const ggResponse = await fetch(
        `http://localhost:8080/api/generalgoal/${clientId}`
      )
      if (!ggResponse.ok) {
        throw new Error("No general goal data found")
      }
      const ggData = await ggResponse.json()
      setGeneralGoal(ggData)

      // Fetch assets
      const assetsResponse = await fetch(
        `http://localhost:8080/api/portassets/${clientId}`
      )
      if (!assetsResponse.ok) {
        throw new Error("Failed to fetch assets")
      }
      const assetsData = await assetsResponse.json()
      setAssets(assetsData)

      // Calculate portfolio summary
      const { totalInvestAmount, portReturn } =
        calculatePortfolioSummary(assetsData)
      setTotalInvestment(totalInvestAmount)
      setPortfolioReturn(portReturn)

      // Calculate general goal
      const { fvOfCurrentInvestment: fv, generalGoalAnnualSaving: saving } =
        calculateGeneralGoal(ggData, totalInvestAmount, portReturn)
      setFvOfCurrentInvestment(fv)
      setGeneralGoalAnnualSaving(saving)
    } catch (error) {
      console.error("Error fetching data:", error)
      // Optionally, you can set default values or handle the error state here
    }
  }

  const handleNavigateRetirement = () => {
    navigate(`/retirement-goal/`)
  }

  const handleNavigateGeneralGoal = () => {
    navigate(`/goal-base/`)
  }

  const handleDashboard = () => {
    navigate(`/dashboard`)
  }

  const isSufficient = generalGoalAnnualSaving <= 0


  const InvestmentProportion = () => {
    return (
      <div className="w-[300px] h-[300px] bg-gray-50 flex flex-col items-center py-1 gap-1">
        <div className="w-full h-8 bg-tfpa_light_blue flex flex-col items-center justify-center">
          สัดส่วนการลงทุนปัจจุบัน
        </div>
        <div className="">
          <PortfolioPieChart assets={assets} width={200} height={200} percent={true}/>
        </div>
      </div>
    )
  }

  const AnnualNetCashflow = () => {
    return (
        <div className="w-[300px] h-[300px] bg-gray-50 flex flex-col items-center py-1 gap-1">
          <div className="w-full h-8 bg-tfpa_light_blue flex flex-col items-center justify-center">
          </div>
          <div className="flex flex-col items-center justify-center h-full gap-5">
            กระแสเงินสดสุทธิปัจจุบันต่อปี
            <span className="text-[48px] font-bold font-sans">
              {Number(generalGoal.clientNetIncome).toLocaleString()}{" "}
            </span>
          </div>
        </div>
    )
  }

  const CashFlowSufficient = () => {
    return (
        <div className="w-[300px] h-[300px] bg-gray-50 flex flex-col items-center py-1 gap-1">
            <div className="w-full h-8 bg-tfpa_light_blue flex flex-col items-center justify-center">
            </div>
            <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
                กระแสเงินสดเพียงพอ
                <br/>
                ต่อการออมหรือไม่
                <span className="text-[48px] font-bold font-sans">
                  {isSufficient
                      ? "เพียงพอ"
                      : "ไม่เพียงพอ"
                  }
                </span>
            </div>
        </div>
    )
  }

    const InstallmentsCount = () => {
        return (
            <div className="w-[300px] h-[300px] bg-gray-50 flex flex-col items-center py-1 gap-1">
                <div className="w-full h-8 bg-tfpa_light_blue flex flex-col items-center justify-center">
                </div>
                <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
                    จำนวนครั้งที่ต้องเก็บออม
                    <span className="text-[48px] font-bold font-sans">
                        {generalGoal.clientGeneralGoalPeriod}
                    </span>
                </div>
            </div>
        )
    }

    const ApproachGoalBase = () => {
        return (
            <div className="w-[600px] h-[300px] bg-gray-50 flex flex-col py-1 gap-1">
                <div className="w-full h-8 bg-tfpa_light_blue flex flex-col items-center justify-center">
                </div>
                <div className="flex flex-col justify-center h-full">
                    <div className="p-5 text-right">
                        <div className="absolute text-2xl font-bold">
                        {((fvOfCurrentInvestment / generalGoal.clientGeneralGoalValue) * 100).toFixed(2)}%
                        </div>
                        สัดส่วนการลงทุนในปัจจุบันคิดเป็นค่าเงินในอนาคต
                        <br/>
                        เทียบกับจำนวนเงินเป้าหมาย
                        <div className={"flex h-3 bg-[#D9D9D9] rounded-xl"}>
                            <div className={"flex h-3 bg-tfpa_light_blue mb-2 rounded-xl"}
                                 style={{
                                     width: ((fvOfCurrentInvestment / generalGoal.clientGeneralGoalValue) * 100).toFixed(2) < 100 ? ((fvOfCurrentInvestment / generalGoal.clientGeneralGoalValue) * 100).toFixed(2) + "%" : "100%",
                                 }}>
                            </div>
                        </div>
                    </div>
                    <div className="p-5 text-right">
                        <div className="absolute text-2xl font-bold">
                        {((Number(generalGoal.clientNetIncome) / Math.abs(generalGoalAnnualSaving))*100).toFixed(2)}%
                        </div>
                        สัดส่วนกระเเสเงินสดต่อปี
                        <br/>
                        เทียบกับจำนวนเงินที่ต้องเก็บออมต่อปี
                        <div className={"flex h-3 bg-[#D9D9D9] rounded-xl"}>
                            <div className={"flex h-3 bg-tfpa_light_blue mb-2 rounded-xl"}
                                 style={{
                                     width: (((Number(generalGoal.clientNetIncome) / Math.abs(generalGoalAnnualSaving))*100).toFixed(2)) < 100 ? (((Number(generalGoal.clientNetIncome) / Math.abs(generalGoalAnnualSaving))*100).toFixed(2)) + "%" : "100%",
                                 }}>
                            </div>
                        </div>
                        {/*<div className={"flex h-2 bg-tfpa_light_blue"}*/}
                        {/*     style={{*/}
                        {/*         width: ((Number(generalGoal.clientNetIncome) / Math.abs(generalGoalAnnualSaving)).toFixed(2)) < 100 ? ((Number(generalGoal.clientNetIncome) / Math.abs(generalGoalAnnualSaving)).toFixed(2)) : 100 + "%",*/}
                        {/*         borderRightWidth: ((Number(generalGoal.clientNetIncome) / Math.abs(generalGoalAnnualSaving)).toFixed(2) < 100) ? (100 - (Number(generalGoal.clientNetIncome) / Math.abs(generalGoalAnnualSaving)).toFixed(2)) : 0 + "%"*/}
                        {/*     }}>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen font-ibm">
            <Header/>
            <div className="flex flex-1">
                <ClientBluePanel/>
                <div className="flex-1 p-4 space-y-8">
                    {/* Top buttons */}
                    <div className="flex space-x-4 justify-center">
                        <button
                            className="bg-tfpa_gold px-4 py-2 rounded font-bold text-white"
                            onClick={handleNavigateGeneralGoal}
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
            {generalGoal && (
                <>
                  {/* Goal Name */}
                  <h1 className="text-center text-4xl text-tfpa_blue font-bold">
                    เป้าหมาย: {generalGoal.clientGeneralGoalName}
                  </h1>
                  <div className="flex flex-wrap gap-2 w-full justify-between my-3 px-8 text-tfpa_blue font-bold">
                    <InvestmentProportion />
                    <AnnualNetCashflow />
                    <CashFlowSufficient />
                      <InstallmentsCount />
                      <ApproachGoalBase />
                  </div>
                  <div className="flex flex-wrap gap-2 w-full justify-between my-3 px-8 text-tfpa_blue font-bold">

                  </div>
                  {/* Two columns for details */}
                  {/*<div className="grid grid-cols-2 gap-8">*/}
                  {/*  /!* Left Column: Net Income and Growth *!/*/}
                  {/*  <div className="flex flex-col space-y-4 text-xl">*/}
                  {/*    <div className="flex justify-between">*/}
                  {/*      <span>กระแสเงินสดสุทธิต่อปี</span>*/}
                  {/*      <span>*/}
                  {/*        {Number(generalGoal.clientNetIncome).toLocaleString()}{" "}*/}
                  {/*        บาท*/}
                  {/*      </span>*/}
                  {/*    </div>*/}
                  {/*    <div className="flex justify-between">*/}
                  {/*      <span>อัตราการเติบโตของกระแสเงินสดสุทธิต่อปี</span>*/}
                  {/*      <span>*/}
                  {/*        {(generalGoal.clientNetIncomeGrowth * 100).toFixed(2)} %*/}
                  {/*      </span>*/}
                  {/*    </div>*/}
                  {/*  </div>*/}

                  {/*  /!* Right Column: Goal Value and Period *!/*/}
                  {/*  <div className="flex flex-col space-y-4 text-xl">*/}
                  {/*    <div className="flex justify-between">*/}
                  {/*      <span>จำนวนเงินเพื่อเป้าหมาย</span>*/}
                  {/*      <span>*/}
                  {/*        {Number(*/}
                  {/*          generalGoal.clientGeneralGoalValue*/}
                  {/*        ).toLocaleString()}{" "}*/}
                  {/*        บาท*/}
                  {/*      </span>*/}
                  {/*    </div>*/}
                  {/*    <div className="flex justify-between">*/}
                  {/*      <span>ระยะเวลาเป้าหมาย</span>*/}
                  {/*      <span>{generalGoal.clientGeneralGoalPeriod} ปี</span>*/}
                  {/*    </div>*/}
                  {/*  </div>*/}
                  {/*</div>*/}
                </>
            )}

            {/* Results */}
            {/*<div className="flex flex-col items-center space-y-4 text-xl font-bold mt-4 mb-4">*/}
            {/*  <div className="flex space-x-4 items-center text-tfpa_gold">*/}
            {/*    <span>เงินรวมปัจจุบันในการลงทุนคิดเป็นค่าเงินในอนาคต</span>*/}
            {/*    <span>{fvOfCurrentInvestment.toLocaleString()}</span>*/}
            {/*    <span>บาท</span>*/}
            {/*  </div>*/}

            {/*  <div className="flex space-x-4 items-center text-tfpa_gold">*/}
            {/*    <span>เงินที่ต้องเก็บออมต่อปี</span>*/}
            {/*    <span>*/}
            {/*      {Math.abs(generalGoalAnnualSaving).toLocaleString()}*/}
            {/*    </span>*/}
            {/*    <span>บาท</span>*/}
            {/*  </div>*/}

            {/*  <div*/}
            {/*    className={`px-52 py-2 rounded-3xl ${*/}
            {/*      isSufficient*/}
            {/*        ? "bg-green-300 text-green-950"*/}
            {/*        : "bg-red-300 text-red-950"*/}
            {/*    }`}*/}
            {/*  >*/}
            {/*    {isSufficient*/}
            {/*      ? "เงินที่ออมอยู่ต่อปีมีเพียงพอ"*/}
            {/*      : "เงินที่ออมอยู่ต่อปีมีไม่เพียงพอ"}*/}
            {/*  </div>*/}
            {/*</div>*/}

            {/*/!* Dashboard Button *!/*/}
            {/*<div className="flex justify-center">*/}
            {/*  <button*/}
            {/*    onClick={handleDashboard}*/}
            {/*    className="bg-tfpa_blue hover:bg-tfpa_blue_hover text-white px-4 py-2 rounded font-bold"*/}
            {/*  >*/}
            {/*    Dashboard*/}
            {/*  </button>*/}
            {/*</div>*/}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
