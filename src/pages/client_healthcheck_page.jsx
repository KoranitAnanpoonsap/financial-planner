import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom" // Import useNavigate
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

export default function FinancialHealthForm() {
  const navigate = useNavigate() // Initialize navigation

  const [formData, setFormData] = useState({
    cashFlow: "",
    liquidAssets: "",
    annualIncome: "",
    debtPayments: "",
    annualSavings: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (/^\d*$/.test(value)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const numericData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, Number(value) || 0])
    )

    // Perform calculations
    const value1 =
      numericData.cashFlow !== 0
        ? numericData.liquidAssets / numericData.cashFlow
        : 0
    const value2 =
      numericData.annualIncome !== 0
        ? numericData.debtPayments / numericData.annualIncome
        : 0
    const value3 =
      numericData.annualIncome !== 0
        ? numericData.annualSavings / numericData.annualIncome
        : 0

    // Navigate to the results page with calculated values
    navigate(`/client-healthcheck-result`, {
      state: { value1, value2, value3 },
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
          <section className="bg-white rounded-lg shadow-lg p-6 mb-12">
            <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">
              ตรวจสุขภาพทางการเงินของคุณง่าย ๆ ใน 3 นาที!
            </h2>
            <p className="text-gray-600 mb-8 text-center">
              กรอกข้อมูลเบื้องต้นเพื่อให้เราช่วยคุณตรวจสอบสุขภาพการเงิน
            </p>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
              <InputField
                label="กระแสเงินสด"
                name="cashFlow"
                value={formData.cashFlow}
                onChange={handleInputChange}
              />
              <InputField
                label="สินทรัพย์สภาพคล่อง"
                name="liquidAssets"
                value={formData.liquidAssets}
                onChange={handleInputChange}
              />
              <InputField
                label="รายรับรวม"
                name="annualIncome"
                value={formData.annualIncome}
                onChange={handleInputChange}
              />
              <InputField
                label="เงินใช้ระคืนหนี้สิน"
                name="debtPayments"
                value={formData.debtPayments}
                onChange={handleInputChange}
              />
              <InputField
                label="เงินออม"
                name="annualSavings"
                value={formData.annualSavings}
                onChange={handleInputChange}
              />
              <button
                type="submit"
                className="w-full bg-yellow-500 text-white font-bold py-2 px-4 rounded-md hover:bg-yellow-600"
              >
                คำนวณ
              </button>
            </form>
          </section>
        </main>
      </motion.div>
      <Footer />
    </div>
  )
}

function InputField({ label, name, value, onChange }) {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-2" htmlFor={name}>
        {label} <span className="text-gray-500">(ต่อเดือน)</span>
      </label>
      <input
        type="text"
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
    </div>
  )
}
