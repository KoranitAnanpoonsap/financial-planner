import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Footer from "../components/footer"
import Header from "../components/header"
import ClientBluePanel from "../components/clientBluePanel"
import { fetchAndCalculateTaxForClient } from "../utils/taxCalculations"

export default function TaxCalculationPage() {
  const { clientId, cfpId } = useParams()
  const navigate = useNavigate()

  const [taxToPay, setTaxToPay] = useState(0)
  const [totalIncome, setTotalIncome] = useState(0)
  const [incomeAfterDeductions, setIncomeAfterDeductions] = useState(0)

  // Assume we can also do more tax planning (RMF, SSF, etc.)
  // For simplicity, let's just display results from calculation.

  useEffect(() => {
    fetchData()
  }, [clientId])

  const fetchData = async () => {
    try {
      const result = await fetchAndCalculateTaxForClient(clientId)
      setTaxToPay(result.taxToPay)
      setTotalIncome(result.totalIncome)
      setIncomeAfterDeductions(result.incomeAfterDeductions)
    } catch (error) {
      console.error(error)
    }
  }

  const handleBack = () => {
    navigate(`/${cfpId}/tax-deduction/${clientId}`)
  }

  return (
    <div className="flex flex-col min-h-screen font-ibm">
      <Header />
      <div className="flex flex-1">
        <ClientBluePanel />
        <div className="flex-1 p-4 space-y-8">
          {/* Display final calculation similar to image */}
          {/* Steps */}
          <div className="flex items-center justify-center space-x-8">
            <div className="flex flex-col items-center text-gray-400">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <span className="font-bold">รายได้</span>
            </div>
            <div className="h-px bg-gray-300 w-24"></div>
            <div className="flex flex-col items-center text-gray-400">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <span className="font-bold">ค่าลดหย่อน</span>
            </div>
            <div className="h-px bg-gray-300 w-24"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-tfpa_gold rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <span className="font-bold text-tfpa_blue">ผลการคำนวณ</span>
            </div>
          </div>
          <h2 className="text-xl font-bold text-tfpa_blue">ผลการคำนวณภาษี</h2>
          <div className="bg-tfpa_gold p-4 rounded space-y-4 text-tfpa_blue font-bold">
            <div className="flex items-center space-x-2 text-xl">
              <span>ภาษีที่ต้องจ่าย:</span>
              <span>{taxToPay.toLocaleString()}</span>
              <span>บาท</span>
            </div>
            <div className="flex items-center space-x-2 text-lg">
              <span>รายได้ทั้งปี:</span>
              <span>{totalIncome.toLocaleString()} บาท</span>
            </div>
            <div className="flex items-center space-x-2 text-lg">
              <span>รายได้สุทธิ:</span>
              <span>{incomeAfterDeductions.toLocaleString()} บาท</span>
            </div>
          </div>

          {/* Tax planning section similar to image */}
          {/* Add fields for RMF, SSF, etc. and recalculate if changed (not shown here for brevity) */}

          <div className="flex justify-end">
            <button
              onClick={handleBack}
              className="bg-gray-200 text-tfpa_blue px-4 py-2 rounded font-bold"
            >
              กลับ
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
