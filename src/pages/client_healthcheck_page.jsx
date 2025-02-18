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

export default function FinancialHealthForm() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    annualExpense: "",
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

    const value1 =
      numericData.annualIncome - (numericData.annualExpense + numericData.annualSavings) !== 0
        ? numericData.liquidAssets / (numericData.annualIncome - (numericData.annualExpense + numericData.annualSavings))
        : 0
    const value2 =
      numericData.annualIncome !== 0
        ? numericData.debtPayments / numericData.annualIncome
        : 0
    const value3 =
      numericData.annualIncome !== 0
        ? numericData.annualSavings / numericData.annualIncome
        : 0

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
                label="รายได้"
                name="annualIncome"
                value={formData.annualIncome}
                onChange={handleInputChange}
                info="รายได้ทั้งหมดที่ได้รับในหนึ่งเดือน เช่น เงินเดือน โบนัส รายได้เสริม"
              />
              <InputField
                label="สินทรัพย์สภาพคล่อง"
                name="liquidAssets"
                value={formData.liquidAssets}
                onChange={handleInputChange}
                info="สินทรัพย์ที่สามารถเปลี่ยนเป็นเงินสดได้ง่าย เช่น เงินฝากธนาคาร"
              />
              <InputField
                label="รายจ่าย"
                name="annualExpense"
                value={formData.annualExpense}
                onChange={handleInputChange}
                info="รายจ่ายทั้งหมดในหนึ่งเดือน เช่น ค่าน้ำ ค่าไฟ ค่าเพื่อบันเทิง"
              />
              <InputField
                label="เงินใช้คืนหนี้สิน"
                name="debtPayments"
                value={formData.debtPayments}
                onChange={handleInputChange}
                info="จำนวนเงินที่ต้องจ่ายคืนสำหรับหนี้สิน เช่น ค่างวดบ้าน รถ หรือสินเชื่อส่วนบุคคล"
              />
              <InputField
                label="เงินออม"
                name="annualSavings"
                value={formData.annualSavings}
                onChange={handleInputChange}
                info="จำนวนเงินที่สามารถออมได้ในแต่ละเดือนหลังจากหักค่าใช้จ่ายทั้งหมด"
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

function InputField({ label, name, value, onChange, info }) {
  return (
    <div className="mb-4 relative">
      <label className="block text-gray-700 font-medium mb-2" htmlFor={name}>
        {label} <span className="text-gray-500">(ต่อเดือน)</span>
        <span className="ml-2 text-blue-600 cursor-pointer relative group">
          ℹ️
          <span className="absolute left-0 bottom-full mb-2 w-60 p-2 text-sm text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
            {info}
          </span>
        </span>
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
