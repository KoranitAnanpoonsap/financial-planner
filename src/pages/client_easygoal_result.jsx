import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Header from "../components/clientHeader.jsx"
import Footer from "../components/footer.jsx"

export default function EasyGoalResult() {
  const location = useLocation()
  const navigate = useNavigate()
  const { goalName, target, years, savings, returnRate } = location.state || {}

  // Calculate required monthly savings
  const months = years * 12
  const monthlyReturn = returnRate / 12 // Convert annual rate to monthly
  let requiredMonthlySavings = 0

  if (returnRate > 0) {
    requiredMonthlySavings =
      (target - savings * Math.pow(1 + monthlyReturn, months)) /
      ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn)
  } else {
    requiredMonthlySavings = (target - savings) / months
  }

  requiredMonthlySavings =
    requiredMonthlySavings > 0 ? requiredMonthlySavings.toFixed(2) : 0

  return (
    <div>
      <Header />
      <main className="container mx-auto py-12">
        {/* Header Section */}
        <section className="bg-blue-900 text-white p-6 text-center rounded-lg mb-8">
          <h2 className="text-2xl font-bold">
            ผลการคำนวณเป้าหมายทางการเงินของคุณ
          </h2>
          <p className="text-lg">
            วางแผนให้มั่นใจ และดำเนินการเพื่ออนาคตที่คุณต้องการ
          </p>
        </section>

        {/* Results Section */}
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-center mb-6">
            ผลลัพธ์ของเป้าหมาย: {goalName}
          </h3>

          <div className="text-center text-lg">
            <p className="mb-4">จำนวนเงินที่ต้องออมรายเดือน:</p>
            <p className="text-3xl font-bold text-green-600">
              {requiredMonthlySavings} บาท
            </p>
          </div>

          {/* Action Buttons */}
          <div className="text-center mt-6">
            <button
              className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-yellow-600"
              onClick={() => navigate(`/client-easygoal-page`)}
            >
              ลองคำนวณใหม่
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
