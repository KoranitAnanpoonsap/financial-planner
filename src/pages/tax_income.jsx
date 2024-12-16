import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Footer from "../components/footer"
import Header from "../components/header"
import ClientBluePanel from "../components/clientBluePanel"
import { fetchAndCalculateTaxForClient } from "../utils/taxCalculations"

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
      setIncomes(incomesData)

      const result = await fetchAndCalculateTaxForClient(clientId)
      setTotalIncome(result.totalIncome)
      setTotalExpense(result.totalExpenseDeductions)
    } catch (error) {
      console.error(error)
    }
  }

  const handleNext = () => {
    navigate(`/${cfpId}/tax-deduction/${clientId}`)
  }

  // Compute expense deduction = totalIncome - incomeAfterDeductions
  const incomeAfterExpense = totalIncome - totalExpense

  // Mapping from Thai type to 40(x) code
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

  // Reverse map from code to Thai type
  const codeToTypeMap = Object.fromEntries(
    Object.entries(typeToCodeMap).map(([thaiType, code]) => [code, thaiType])
  )

  // Income categories
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

  // Create a map from Thai income type to amount
  const incomeMap = {}
  for (const inc of incomes) {
    if (!incomeMap[inc.clientIncomeType]) incomeMap[inc.clientIncomeType] = 0
    if ((inc.clientIncomeFrequency = "ทุกเดือน"))
      incomeMap[inc.clientIncomeType] += inc.clientIncomeAmount * 12
    else incomeMap[inc.clientIncomeType] += inc.clientIncomeAmount
  }

  // getIncomeAmount: given a code like "40(1)", find the Thai type and return the amount
  const getIncomeAmount = (code) => {
    const thaiType = codeToTypeMap[code]
    return thaiType ? incomeMap[thaiType] || 0 : 0
  }

  return (
    <div className="flex flex-col min-h-screen font-ibm">
      <Header />
      <div className="flex flex-1">
        <ClientBluePanel />
        <div className="flex-1 p-8 space-y-8">
          {/* Steps */}
          <div className="flex items-center justify-center space-x-8">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-tfpa_gold rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <span className="font-bold text-tfpa_blue">รายได้</span>
            </div>
            <div className="h-px bg-gray-300 w-24"></div>
            <div className="flex flex-col items-center text-gray-400">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <span className="font-bold">ค่าลดหย่อน</span>
            </div>
            <div className="h-px bg-gray-300 w-24"></div>
            <div className="flex flex-col items-center text-gray-400">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <span className="font-bold">ผลการคำนวณ</span>
            </div>
          </div>

          {/* Income list */}
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

          {/* Dotted line */}
          <hr className="border-dashed border-gray-300" />

          {/* Summary */}
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
        </div>
      </div>
      <Footer />
    </div>
  )
}
