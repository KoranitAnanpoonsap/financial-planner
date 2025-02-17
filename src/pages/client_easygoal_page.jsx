import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
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

export default function EasyGoal() {
  const navigate = useNavigate()

  // State for user input
  const [goalName, setGoalName] = useState("")
  const [targetAmount, setTargetAmount] = useState("")
  const [timeFrame, setTimeFrame] = useState("")
  const [currentSavings, setCurrentSavings] = useState("")
  const [expectedReturn, setExpectedReturn] = useState("")

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    // Convert inputs to numbers
    const target = parseFloat(targetAmount)
    const years = parseFloat(timeFrame)
    const savings = parseFloat(currentSavings)
    const returnRate = parseFloat(expectedReturn) / 100 // Convert % to decimal

    // Navigate to result page with entered values
    navigate(`/client-easygoal-result`, {
      state: { goalName, target, years, savings, returnRate },
    })
  }

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
              วางแผนเป้าหมายทางการเงินได้ง่าย ๆ เพื่ออนาคตที่ชัดเจน
            </h2>
            <p className="text-lg">
              สำรวจเป้าหมายทางการเงินของคุณในไม่กี่ขั้นตอน
              พร้อมคำแนะนำที่นำไปใช้ได้ทันที
            </p>
          </section>

          {/* Form Section */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto"
          >
            <h3 className="text-xl font-semibold text-center mb-6">
              ข้อมูลเบื้องต้นที่จะช่วยให้คุณบรรลุเป้าหมายได้เร็วขึ้น
            </h3>

            {/* Goal Name */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">
                ชื่อเป้าหมาย
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                placeholder="เช่น ซื้อบ้าน, รถยนต์, เกษียณอายุ"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                required
              />
            </div>

            {/* Target Amount */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">
                จำนวนเงินเพื่อเป้าหมายนั้น
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  className="w-full p-2 border rounded-lg"
                  placeholder="0"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  required
                />
                <span className="ml-2">บาท</span>
              </div>
            </div>

            {/* Time Frame */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">
                ระยะเวลาก่อนที่จะถึงเป้าหมายนั้น
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  className="w-full p-2 border rounded-lg"
                  placeholder="0"
                  value={timeFrame}
                  onChange={(e) => setTimeFrame(e.target.value)}
                  required
                />
                <span className="ml-2">ปี</span>
              </div>
            </div>

            {/* Current Savings */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">
                เงินรวมปัจจุบันในการลงทุน
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  className="w-full p-2 border rounded-lg"
                  placeholder="0"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(e.target.value)}
                  required
                />
                <span className="ml-2">บาท</span>
              </div>
            </div>

            {/* Expected Return Rate */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">
                ผลตอบแทนต่อปีของการลงทุน
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  className="w-full p-2 border rounded-lg"
                  placeholder="0"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(e.target.value)}
                  required
                />
                <span className="ml-2">%</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-yellow-600"
              >
                คำนวณ
              </button>
            </div>
          </form>
        </main>
      </motion.div>
      <Footer />
    </div>
  )
}
