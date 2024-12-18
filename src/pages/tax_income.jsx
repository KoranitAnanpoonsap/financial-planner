import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Footer from "../components/footer"
import Header from "../components/header"
import ClientBluePanel from "../components/clientBluePanel"
import { fetchAndCalculateTaxForClient } from "../utils/taxCalculations"
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

export default function TaxIncomePage() {
  const { clientId, cfpId } = useParams()
  const navigate = useNavigate()

  const [incomes, setIncomes] = useState([])
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpense, setTotalExpense] = useState(0)

  useEffect(() => {
    fetchData()
  }, [clientId])

  const fetchData = async () => {
    try {
      const incomesRes = await fetch(
        `http://localhost:8080/api/clientincome/${clientId}`
      )
      if (!incomesRes.ok) throw new Error("Failed to fetch incomes")
      const incomesData = await incomesRes.json()

      // Adjust income amounts for frequency
      const adjustedIncomes = incomesData.map((inc) => {
        if (inc.clientIncomeFrequency === "ทุกเดือน") {
          inc.clientIncomeAmount = inc.clientIncomeAmount * 12
        }
        return inc
      })
      setIncomes(adjustedIncomes)

      // Calculate total income and expense
      const result = await fetchAndCalculateTaxForClient(clientId)
      setTotalIncome(result.totalIncome)
      setTotalExpense(result.totalExpenseDeductions)
    } catch (error) {
      console.error(error)
    }
  }

  // Group incomes by type
  const incomeByType = incomes.reduce((map, inc) => {
    const type = inc.clientIncomeType
    if (!map[type]) map[type] = 0
    map[type] += inc.clientIncomeAmount
    return map
  }, {})

  const handleNext = () => {
    navigate(`/${cfpId}/tax-deduction/${clientId}`)
  }

  const incomeAfterExpense = totalIncome - totalExpense

  const typeToCodeMap = {
    เงินเดือน: "40(1)",
    รับจ้างทำงาน: "40(2)",
    "ค่าลิขสิทธิ์ สิทธิบัตร": "40(3)",
    "ดอกเบี้ย เงินปันผล": "40(4)",
    ค่าเช่าทรัพย์สิน: "40(5)",
    วิชาชีพอิสระ: "40(6)",
    รับเหมาก่อสร้าง: "40(7)",
    รายได้อื่นๆ: "40(8)",
  }

  const codeToTypeMap = Object.fromEntries(
    Object.entries(typeToCodeMap).map(([thaiType, code]) => [code, thaiType])
  )

  const incomeCategories = [
    { code: "40(1)", desc: "เงินเดือน ค่าจ้าง เบี้ยเลี้ยง โบนัส บำนาญ ฯลฯ" },
    {
      code: "40(2)",
      desc: "ค่านายหน้า เบี้ยประชุม หรือเงินได้จากหน้าที่ หรือการรับทำงานให้",
    },
    { code: "40(3)", desc: "เงินได้จากค่าลิขสิทธิ์หรือเงินรายปี" },
    { code: "40(4)", desc: "เงินได้จากการออกการลงทุน" },
    { code: "40(5)", desc: "เงินได้หรือประโยชน์จากการให้เช่าทรัพย์สิน" },
    { code: "40(6)", desc: "เงินได้จากวิชาชีพอิสระ" },
    {
      code: "40(7)",
      desc: "เงินได้จากการรับเหมาที่ผู้รับเหมาต้องจัดหาสัมภาระในส่วนสำคัญ",
    },
    { code: "40(8)", desc: "เงินได้อื่นๆ" },
  ]

  const getIncomeAmount = (code) => {
    const thaiType = codeToTypeMap[code]
    return thaiType ? incomeByType[thaiType] || 0 : 0
  }

  return (
    <div className="flex flex-col min-h-screen font-ibm">
      <Header />
      <div className="flex flex-1">
        <ClientBluePanel />
        <div className="flex-1 p-8 space-y-8">
          <div className="flex items-center justify-center space-x-8">
            <button
              onClick={() => navigate(`/${cfpId}/tax-income/${clientId}`)}
              className="flex flex-col items-center focus:outline-none"
            >
              <div className="w-10 h-10 bg-tfpa_gold rounded-full flex items-center justify-center text-white font-bold cursor-pointer">
                1
              </div>
              <span className="font-bold text-tfpa_blue">รายได้</span>
            </button>
            <div className="h-px bg-gray-300 w-24"></div>
            <button
              onClick={() => navigate(`/${cfpId}/tax-deduction/${clientId}`)}
              className="flex flex-col items-center focus:outline-none text-gray-400"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold cursor-pointer">
                2
              </div>
              <span className="font-bold">ค่าลดหย่อน</span>
            </button>
            <div className="h-px bg-gray-300 w-24"></div>
            <button
              onClick={() => navigate(`/${cfpId}/tax-calculation/${clientId}`)}
              className="flex flex-col items-center focus:outline-none text-gray-400"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold cursor-pointer">
                3
              </div>
              <span className="font-bold">ผลการคำนวณ</span>
            </button>
          </div>

          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <div className="space-y-4">
              {incomeCategories.map((cat, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-1/2 text-tfpa_blue font-bold">
                    {cat.code} {cat.desc}
                  </div>
                  <div className="flex items-center space-x-2 w-1/2">
                    <input
                      type="text"
                      value={getIncomeAmount(cat.code).toLocaleString()}
                      readOnly
                      className="border border-gray-300 rounded px-2 py-1 text-right w-24"
                    />
                    <span className="text-tfpa_blue font-bold">บาท</span>
                  </div>
                </div>
              ))}
            </div>

            <hr className="border-dashed mt-4 mb-4 border-gray-300" />
            <div className="flex flex-col items-start space-y-2 font-bold text-tfpa_blue">
              <div className="flex space-x-2">
                <span>รวมเงินได้</span>
                <span className="text-tfpa_gold">
                  {totalIncome.toLocaleString()}
                </span>
                <span className="text-tfpa_blue"> บาท</span>
              </div>
              <div className="flex space-x-2">
                <span>หักค่าใช้จ่ายได้</span>
                <span className="text-tfpa_gold">
                  {totalExpense.toLocaleString()}
                </span>
                <span className="text-tfpa_blue"> บาท</span>
              </div>
              <div className="flex space-x-2">
                <span>เงินได้พึงประเมินหลังหักค่าใช้จ่าย</span>
                <span className="text-tfpa_gold">
                  {incomeAfterExpense.toLocaleString()}
                </span>
                <span className="text-tfpa_blue"> บาท</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="bg-tfpa_gold text-white px-4 py-2 rounded font-bold"
              >
                ถัดไป
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
