import { useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Header from "../components/clientHeader.jsx"
import Footer from "../components/footer.jsx"

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

export default function EasyGoalResult() {
  const location = useLocation()
  const navigate = useNavigate()
  const { goalName, target, years, savings, returnRate } = location.state || {}

  // Calculate future value of savings per year
  const annualReturn = returnRate // Assuming returnRate is already annual
  let futureSavings = savings * Math.pow(1 + annualReturn, years)

  // Calculate the difference
  const difference = target - futureSavings
  const requiredAnnualSavings = difference > 0 ? difference : 0
  const requiredMonthlySavings = (requiredAnnualSavings / 12).toFixed(2)

  return (
    <div>
      <Header />
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="flex-1"
      >
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
              ผลลัพธ์ของเป้าหมาย {goalName}
            </h3>
            <p className="text-center text-lg mb-4">
              มูลค่าเป้าหมาย: {target.toLocaleString()} บาท
            </p>

            <div className="text-center text-lg">
              {difference > 0 ? (
                <>
                  <p className="mb-4 text-red-600">
                    คุณยังมีเงินไม่เพียงพอสำหรับเป้าหมายนี้
                  </p>
                  <p>คุณต้องออมเพิ่มอีก:</p>
                  <p className="text-3xl font-bold text-red-600">
                    {requiredAnnualSavings.toLocaleString()} บาท/ปี
                  </p>
                  <p className="text-lg font-bold text-red-600">
                    ({Number(requiredMonthlySavings).toLocaleString()}{" "}
                    บาท/เดือน)
                  </p>
                </>
              ) : (
                <>
                  <p className="mb-4 text-green-600">
                    คุณมีเงินเพียงพอสำหรับเป้าหมายนี้!
                  </p>
                  <p>คุณมีเงินเกินกว่าเป้าหมาย:</p>
                  <p className="text-3xl font-bold text-green-600">
                    {Math.abs(difference).toLocaleString()} บาท
                  </p>
                </>
              )}
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
      </motion.div>
      <Footer />
    </div>
  )
}
