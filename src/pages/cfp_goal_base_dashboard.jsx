import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Footer from "../components/footer.jsx"
import Header from "../components/cfpHeader.jsx"
import CfpClientSidePanel from "../components/cfpClientSidePanel.jsx"
import { calculateGoal } from "../utils/calculations.js"
import { motion } from "framer-motion"
import html2canvas from "html2canvas"

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 1 },
}

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 1,
}

export default function CFPGoalBaseDashboard() {
  const [clientUuid] = useState(localStorage.getItem("clientUuid") || "")
  const navigate = useNavigate()
  const [TotalInvestment, setTotalInvestment] = useState("")
  const [PortfolioReturn, setPortfolioReturn] = useState("")

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

  const handleNavigateRetirement = () => {
    navigate(`/retirement-goal/`)
  }

  const handleNavigateBack = () => {
    navigate(`/goal-base-calculated/`)
  }

  const DashBoardGoalBasedEfficient = () => {
    return (
      <div className="text-3xl flex flex-col w-full items-center border-black border-2 rounded-2xl p-4">
        <div className="mb-8">เป้าหมาย: {Goal.goalName}</div>
        <div className="m-2">จากสถานะทางการเงินในปัจจุบัน</div>
        {GoalAnnualSaving <= Number(Goal.netIncome).toLocaleString() ? (
          <div className="text-[green] m-2">
            "คุณมีศักยภาพที่จะบรรลุเป้าหมายนี้ได้สําเร็จ"
          </div>
        ) : (
          <div className="text-[red] m-2">
            "ยังไม่เพียงพอที่จะบรรลุเป้าหมายนี้ได้สําเร็จภายในระยะเวลาที่กําหนด"
          </div>
        )}
        <img
          className="my-2"
          src="/src/assets/dashboard_image.png"
          alt="Dashboard Picture Image"
        />
      </div>
    )
  }

  const DashBoardGoalBasedGoalDetail = () => {
    return (
      <div className="text-xl flex flex-col w-full items-start border-black border-2 rounded-2xl p-4 min-w-[300px]">
        <div className="text-2xl mb-2">รายละเอียดเป้าหมาย</div>
        <div className="m-2">
          จํานวนเงินเพื่อเป้าหมาย:{" "}
          {Goal.goalValue.toLocaleString("en-th", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          บาท
        </div>
        <div className="m-2">ระยะเวลาเป้าหมาย: {Goal.goalPeriod} ปี</div>
        <div className="m-2 flex flex-row gap-x-8 flex-wrap">
          <div>
            จํานวนเงินที่ต้องเก็บออมต่อปี{" "}
            {GoalAnnualSaving.toLocaleString("en-th", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            บาท
          </div>
          <div>
            เฉลี่ยเดือนละ{" "}
            {(GoalAnnualSaving / 12).toLocaleString("en-th", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            บาท
          </div>
        </div>
      </div>
    )
  }

  const DashBoardGoalBasedPortfolio = () => {
    return (
      <div className="text-xl flex flex-col w-full items-start border-black border-2 rounded-2xl p-4 min-w-[300px]">
        <div className="text-2xl mb-2">สถานะการเงินในปัจจุบัน</div>
        <div className="m-2">
          กระเเสเงินสดสุทธิต่อปี:{" "}
          {Number(Goal.netIncome).toLocaleString("en-th", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          บาท
        </div>
        <div className="m-2">
          เงินรวมปัจจุบันในการลงทุน:{" "}
          {Number(TotalInvestment).toLocaleString("en-th", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          บาท
        </div>
        <div className="m-2">
          ผลตอบแทนต่อปีของพอร์ตที่ลงทุนปัจจุบัน:{" "}
          {Number(PortfolioReturn).toLocaleString("en-th", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          %
        </div>
      </div>
    )
  }

  function print() {
    const element = document.getElementById("print")
    html2canvas(element).then((canvas) => {
      // Append the canvas to the body or save it as an image
      document.body.appendChild(canvas)
      const link = document.createElement("a")
      link.download = "dashboard.png"
      link.href = canvas.toDataURL("image/png")
      canvas.remove()
      link.click()
      document.delete(link)
    })
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
            {/* Blue Box with Goal Info */}
            {Goal && (
              <>
                <div
                  className="font-prompt flex flex-wrap gap-2 w-full justify-center mx-3 p-8 text-tfpa_blue font-bold"
                  id="print"
                >
                  <DashBoardGoalBasedEfficient />
                  <div className="flex flex-row w-full gap-4 flex-wrap lg:flex-nowrap">
                    <DashBoardGoalBasedGoalDetail />
                    <DashBoardGoalBasedPortfolio />
                  </div>
                </div>
                <center>
                  <button
                    onClick={print}
                    className="bg-tfpa_blue hover:bg-tfpa_blue_hover text-white px-8 py-2 text-2xl font-bold rounded-2xl"
                  >
                    Print
                  </button>
                </center>
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
