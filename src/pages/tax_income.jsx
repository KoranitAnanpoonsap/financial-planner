import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
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
  const [cfpId] = useState(Number(localStorage.getItem("cfpId")) || "")
  const [clientId] = useState(Number(localStorage.getItem("clientId")) || "")
  const navigate = useNavigate()

  // States
  const [incomes, setIncomes] = useState([])
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpense, setTotalExpense] = useState(0)

  // On mount or whenever clientId changes
  useEffect(() => {
    if (!clientId) return
    fetchData()
  }, [clientId])

  // Fetch data
  const fetchData = async () => {
    try {
      const incomesRes = await fetch(
        `http://localhost:8080/api/clientincome/${clientId}`
      )
      if (!incomesRes.ok) throw new Error("Failed to fetch incomes")
      const incomesData = await incomesRes.json()

      // Adjust annual amounts if frequency is monthly, etc.
      const adjustedIncomes = incomesData.map((inc) => {
        let amount = inc.clientIncomeAmount
        if (inc.clientIncomeFrequency === "ทุกเดือน") {
          amount = amount * 12
        }
        return {
          ...inc,
          clientIncomeAmount: amount,
        }
      })
      setIncomes(adjustedIncomes)

      // Also fetch totalIncome, totalExpense from your tax logic
      const result = await fetchAndCalculateTaxForClient(clientId)
      setTotalIncome(result.totalIncome)
      setTotalExpense(result.totalExpenseDeductions)
    } catch (error) {
      console.error(error)
    }
  }

  // We separate data by main type (40(1) ... 40(8))
  // and for 40(5) and 40(6), further separate by subtypes
  const categories = {
    "40(1) เงินเดือน": {
      code: "40(1)",
      label: "เงินเดือน ค่าจ้าง เบี้ยเลี้ยง โบนัส บำนาญ ฯลฯ",
      amount: 0,
    },
    "40(2) รับจ้างทำงาน": {
      code: "40(2)",
      label: "ค่านายหน้า เบี้ยประชุม หรือเงินได้จากหน้าที่ / การรับทำงานให้",
      amount: 0,
    },
    "40(3) ค่าลิขสิทธิ์ สิทธิบัตร": {
      code: "40(3)",
      label: "เงินได้จากค่าลิขสิทธิ์หรือเงินรายปี",
      amount: 0,
    },
    "40(4) ดอกเบี้ย เงินปันผล": {
      code: "40(4)",
      label: "เงินได้จากการออกการลงทุน",
      amount: 0,
    },
    "40(5) ค่าเช่าทรัพย์สิน": {
      code: "40(5)",
      label: "เงินได้จากการให้เช่าทรัพย์สิน",
      amount: 0,
      // Subtypes from your specification
      subtypes: {
        "บ้าน/โรงเรือน/สิ่งปลูกสร้าง/แพ/ยานพาหนะ": 0,
        ที่ดินที่ใช้ในการเกษตร: 0,
        ที่ดินที่มิได้ใช้ในการเกษตร: 0,
        ทรัพย์สินอื่นๆ: 0,
      },
    },
    "40(6) วิชาชีพอิสระ": {
      code: "40(6)",
      label: "เงินได้จากวิชาชีพอิสระ",
      amount: 0,
      // Subtypes from your specification
      subtypes: {
        การประกอบโรคศิลปะ: 0,
        "กฎหมาย/วิศวกรรม/สถาปัตยกรรม/การบัญชี/ประณีตศิลปกรรม": 0,
      },
    },
    "40(7) รับเหมาก่อสร้าง": {
      code: "40(7)",
      label: "เงินได้จากการรับเหมาที่ผู้รับเหมาต้องจัดหาสัมภาระในส่วนสำคัญ",
      amount: 0,
    },
    "40(8) รายได้อื่นๆ": {
      code: "40(8)",
      label: "เงินได้อื่นๆ",
      amount: 0,
    },
  }

  // Tally amounts in categories
  incomes.forEach((inc) => {
    const mainType = inc.clientIncomeType // e.g. "40(5) ค่าเช่าทรัพย์สิน"
    if (!categories[mainType]) return

    // Increase total for the main type
    categories[mainType].amount += inc.clientIncomeAmount

    // Check subtypes only if 40(5) or 40(6):
    if (mainType === "40(5) ค่าเช่าทรัพย์สิน") {
      // inc.clientIncome405Type might be one of:
      // "บ้าน/โรงเรือน/สิ่งปลูกสร้าง/แพ/ยานพาหนะ", "ที่ดินที่ใช้ในการเกษตร", etc.
      const subtype = inc.clientIncome405Type
      if (categories[mainType].subtypes[subtype] !== undefined) {
        categories[mainType].subtypes[subtype] += inc.clientIncomeAmount
      }
    } else if (mainType === "40(6) วิชาชีพอิสระ") {
      // inc.clientIncome406Type might be one of:
      // "การประกอบโรคศิลปะ", "กฎหมาย/วิศวกรรม/สถาปัตยกรรม/การบัญชี/ประณีตศิลปกรรม"
      const subtype = inc.clientIncome406Type
      if (categories[mainType].subtypes[subtype] !== undefined) {
        categories[mainType].subtypes[subtype] += inc.clientIncomeAmount
      }
    }
  })

  const incomeAfterExpense = totalIncome - totalExpense

  const handleNext = () => {
    navigate(`/tax-deduction/`)
  }

  return (
    <div className="flex flex-col min-h-screen font-ibm">
      <Header />
      <div className="flex flex-1">
        <ClientBluePanel />
        <div className="flex-1 p-8 space-y-8">
          {/* Steps bar */}
          <div className="flex items-center justify-center space-x-8">
            <button
              onClick={() => navigate(`/tax-income/`)}
              className="flex flex-col items-center focus:outline-none"
            >
              <div className="w-10 h-10 bg-tfpa_gold rounded-full flex items-center justify-center text-white font-bold cursor-pointer">
                1
              </div>
              <span className="font-bold text-tfpa_blue">รายได้</span>
            </button>
            <div className="h-px bg-gray-300 w-24"></div>
            <button
              onClick={() => navigate(`/tax-deduction/`)}
              className="flex flex-col items-center focus:outline-none text-gray-400"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold cursor-pointer">
                2
              </div>
              <span className="font-bold">ค่าลดหย่อน</span>
            </button>
            <div className="h-px bg-gray-300 w-24"></div>
            <button
              onClick={() => navigate(`/tax-calculation/`)}
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
              {/* Render each category */}
              {Object.entries(categories).map(([key, cat]) => (
                <div key={key}>
                  <div className="flex items-center space-x-4">
                    <div className="w-1/2 text-tfpa_blue font-bold">
                      {cat.code} {cat.label}
                    </div>
                    <div className="flex items-center space-x-2 w-1/2">
                      <input
                        type="text"
                        value={cat.amount.toLocaleString()}
                        readOnly
                        className="border border-gray-300 rounded px-2 py-1 text-right w-24"
                      />
                      <span className="text-tfpa_blue font-bold">บาท</span>
                    </div>
                  </div>

                  {/* If 40(5) or 40(6), show subtypes */}
                  {cat.code === "40(5)" && cat.subtypes && (
                    <div className="ml-6 mt-2 space-y-1">
                      {Object.entries(cat.subtypes).map(([subKey, subVal]) => (
                        <div
                          key={subKey}
                          className="flex items-center space-x-4"
                        >
                          <div className="w-1/2 text-tfpa_blue">┗ {subKey}</div>
                          <div className="flex items-center space-x-2 w-1/2">
                            <input
                              type="text"
                              value={subVal.toLocaleString()}
                              readOnly
                              className="px-2 py-1 text-right w-24"
                            />
                            <span className="text-tfpa_blue">บาท</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {cat.code === "40(6)" && cat.subtypes && (
                    <div className="ml-6 mt-2 space-y-1">
                      {Object.entries(cat.subtypes).map(([subKey, subVal]) => (
                        <div
                          key={subKey}
                          className="flex items-center space-x-4"
                        >
                          <div className="w-1/2 text-tfpa_blue">┗ {subKey}</div>
                          <div className="flex items-center space-x-2 w-1/2">
                            <input
                              type="text"
                              value={subVal.toLocaleString()}
                              readOnly
                              className="px-2 py-1 text-right w-24"
                            />
                            <span className="text-tfpa_blue">บาท</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                <span className="text-tfpa_blue">บาท</span>
              </div>
              <div className="flex space-x-2">
                <span>หักค่าใช้จ่ายได้</span>
                <span className="text-tfpa_gold">
                  {totalExpense.toLocaleString()}
                </span>
                <span className="text-tfpa_blue">บาท</span>
              </div>
              <div className="flex space-x-2">
                <span>เงินได้พึงประเมินหลังหักค่าใช้จ่าย</span>
                <span className="text-tfpa_gold">
                  {(totalIncome - totalExpense).toLocaleString()}
                </span>
                <span className="text-tfpa_blue">บาท</span>
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
