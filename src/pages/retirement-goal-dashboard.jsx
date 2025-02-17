import { useEffect, useState, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Footer from "../components/footer.jsx"
import Header from "../components/cfpHeader.jsx"
import CfpClientSidePanel from "../components/cfpClientSidePanel.jsx"
import { calculateRetirementGoal } from "../utils/calculations.js"
import { motion } from "framer-motion"
import html2canvas from "html2canvas"
import dashboard_image from "../assets/dashboard_image.png"

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

export default function RetirementGoalDashboard() {
  const [clientUuid] = useState(localStorage.getItem("clientUuid") || "")
  const navigate = useNavigate()

  const [retirementGoal, setRetirementGoal] = useState(null)

  // Calculation results
  const [discountRate, setDiscountRate] = useState(0)
  const [fvCurrentExpense, setFvCurrentExpense] = useState(0)
  const [newFvCurrentExpense, setNewFvCurrentExpense] = useState(0)
  const [retirementGoalAmount, setRetirementGoalAmount] = useState(0)
  const [clientCurrentAge, setClientCurrentAge] = useState("") // อายุปัจจุบัน
  const [clientRetirementAge, setClientRetirementAge] = useState("") // อายุเกษียณ
  const [clientLifeExpectancy, setClientLifeExpectancy] = useState("") // อายุยืน
  const [clientExpectedRetiredPortReturn, setClientExpectedRetiredPortReturn] =
    useState("") // ผลตอบแทนต่อปีที่คาดหวัง หลังเกษียณ
  const [inflationRate, setInflationRate] = useState("") // อัตราเงินเฟ้อ

  // Slider state for retiredExpensePortion (0 to 1)
  const [retiredExpensePortion, setRetiredExpensePortion] = useState(1)

  const [localPortionPercent, setLocalPortionPercent] = useState(100)
  const debounceTimer = useRef(null) // Ref for debounce timer

  useEffect(() => {
    fetchRetirementGoalData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientUuid])

  const fetchRetirementGoalData = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_KEY}api/retirementgoal/${clientUuid}`
      )
      if (!res.ok) throw new Error("No retirement goal data")
      const rg = await res.json()
      setRetirementGoal(rg)
      setClientCurrentAge(rg.clientCurrentAge?.toString() || "")
      setClientRetirementAge(rg.clientRetirementAge?.toString() || "")
      setClientLifeExpectancy(rg.clientLifeExpectancy?.toString() || "")
      setClientExpectedRetiredPortReturn(
        rg.clientExpectedRetiredPortReturn !== undefined
          ? (rg.clientExpectedRetiredPortReturn * 100).toFixed(2).toString()
          : ""
      )
      setInflationRate(
        rg.inflationRate !== undefined
          ? (rg.inflationRate * 100).toFixed(2).toString()
          : ""
      )
      const savedPortion =
        rg.clientRetiredExpensePortion != null
          ? rg.clientRetiredExpensePortion
          : 1
      setRetiredExpensePortion(savedPortion)
      setLocalPortionPercent(savedPortion * 100) // Initialize local state

      performCalculation(rg, savedPortion)
    } catch (error) {
      console.error("Error fetching retirement goal data:", error)
    }
  }

  const handlePortionChange = (e) => {
    const portionValue = e.target.value / 100
    setRetiredExpensePortion(portionValue)
    setLocalPortionPercent(e.target.value) // Update local state immediately
    performCalculation(retirementGoal, portionValue)

    // Debounce the server update
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      updateRetiredExpensePortion(portionValue)
    }, 500) // 500ms debounce
  }

  const performCalculation = (rg, portion) => {
    const {
      discountRate,
      fvCurrentExpense,
      newFvCurrentExpense,
      retirementGoal,
    } = calculateRetirementGoal(rg, portion)

    setDiscountRate(discountRate)
    setFvCurrentExpense(fvCurrentExpense)
    setNewFvCurrentExpense(newFvCurrentExpense)
    setRetirementGoalAmount(retirementGoal)
  }

  const updateRetiredExpensePortion = async (portion) => {
    const updatedGoal = {
      ...retirementGoal,
      clientRetiredExpensePortion: portion,
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_KEY}api/retirementgoal/${clientUuid}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedGoal),
        }
      )
      if (!response.ok)
        throw new Error("Failed to update retired expense portion")

      const savedGoal = await response.json()
      setRetirementGoal(savedGoal)

      const updatedPortion =
        savedGoal.clientRetiredExpensePortion != null
          ? savedGoal.clientRetiredExpensePortion
          : 1

      // Only update if there's a change
      if (updatedPortion !== portion) {
        setRetiredExpensePortion(updatedPortion)
        setLocalPortionPercent(updatedPortion * 100)
        performCalculation(savedGoal, updatedPortion)
      }
    } catch (error) {
      console.error("Error updating retired expense portion:", error)
      // Optionally, revert the slider or notify the user
    }
  }

  const handleNavigateGeneralGoal = () => {
    navigate(`/goal-base/`)
  }

  const handleNavigateRetirement = () => {
    navigate(`/retirement-goal/`)
  }

  const handleDashboard = () => {
    navigate(`/dashboard`)
  }

  // Format numbers with appropriate decimal places and locale
  const formatNumber = (number, decimals = 2) =>
    Number(number.toFixed(decimals)).toLocaleString()

  const afterInflationReturnPercent = (discountRate * 100).toFixed(2)
  const portionPercent = (retiredExpensePortion * 100).toFixed(0)

  const DashBoardRetirementMain = () => {
    return (
      <div className="text-3xl flex flex-col w-full items-center border-black border-2 rounded-2xl p-4">
        <div className="m-2 text-4xl">เป้าหมายเกษียณ</div>
        <div className="m-2">
          จำนวนเงินที่ต้องมีทั้งหมด ณ วันเกษียณ{" "}
          {formatNumber(retirementGoalAmount)} บาท
        </div>
        <img
          className="my-2"
          src={dashboard_image}
          alt="Dashboard Picture Image"
        />
      </div>
    )
  }

  const DashboardRetirementPersonalInfo = () => {
    return (
      <div className="text-xl flex flex-row w-full items-start justify-between border-black border-2 rounded-2xl p-4 gap-8">
        <div className="flex flex-col">
          <div className="text-2xl mb-2 text-tfpa_blue_hover">
            ข้อมูลส่วนตัวสำหรับเกษียณ
          </div>
          <div className="m-2">อายุปัจจุบัน: {clientCurrentAge} ปี</div>
          {/*<div className="m-2">ระยะเวลาเป้าหมาย: {Goal.goalPeriod} ปี</div>*/}
          <div className="m-2">อายุเกษียณ: {clientRetirementAge} ปี</div>
          <div className="m-2">อายุยืน: {clientLifeExpectancy} ปี</div>
        </div>
        <div className="flex h-full items-center">
          <img
            className="w-60 rounded-xl"
            src="src/assets/dashboard_retirement_image.jpg"
            alt="Dashboard Retirement Image"
          />
        </div>
      </div>
    )
  }

  const DashBoardRetirementFinance = () => {
    return (
      <div className="text-xl flex flex-col w-full items-start border-black border-2 rounded-2xl p-4 min-w-[300px]">
        <div className="text-2xl text-tfpa_blue_hover mb-2">
          รายละเอียดการเงินหลังเกษียณ
        </div>
        <div className="m-2">
          รายจ่ายต่อปี ณ วันเกษียณ: {formatNumber(newFvCurrentExpense)} บาท
        </div>
        <div className="m-2">
          ผลตอบแทนต่อปีที่คาดหวังหลังเกษียณ: {clientExpectedRetiredPortReturn}%
        </div>
        <div className="m-2">อัตราเงินเฟ้อ: {inflationRate}%</div>
      </div>
    )
  }

  const handleNavigateBack = () => {
    navigate(`/retirement-goal-calculated/`)
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
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <>
              <div className="flex space-x-4 justify-end">
                <button
                  onClick={handleNavigateBack}
                  className="bg-gray-300 hover:bg-gray-400 text-tfpa_blue px-4 py-2 rounded font-ibm font-bold"
                >
                  กลับ
                </button>
              </div>
              <div
                className="font-prompt flex flex-wrap gap-2 w-full justify-center mx-3 p-8 text-tfpa_blue font-bold"
                id="print"
              >
                <div className="text-4xl mb-4">
                  "เกษียณในฝัน เป็นจริงได้... แค่เริ่มวางแผน"
                </div>
                <DashBoardRetirementMain />
                <div className="flex flex-row w-full gap-4 flex-wrap lg:flex-nowrap">
                  <DashboardRetirementPersonalInfo />
                  <DashBoardRetirementFinance />
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
            </>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
