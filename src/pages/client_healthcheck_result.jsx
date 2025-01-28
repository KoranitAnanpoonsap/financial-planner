import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts"
import Header from "../components/clientHeader.jsx"
import Footer from "../components/footer.jsx"

// Helper function to determine gauge color and financial advice
const getFinancialAdvice = (type, value) => {
  let advice = { status: "", message: "", color: "#f87171" } // Default: Red (Needs Improvement)

  if (type === "liquidity") {
    if (value >= 3)
      advice = {
        status: "คุณมีสภาพคล่องที่ดีเยี่ยม",
        message: "รักษาสภาพคล่องที่ดีให้คงอยู่เสมอ.",
        color: "#10b981",
      }
    else if (value >= 1)
      advice = {
        status: "พอใช้",
        message: "พยายามเพิ่มสินทรัพย์สภาพคล่องเพื่อความมั่นคงทางการเงิน.",
        color: "#facc15",
      }
    else
      advice = {
        status: "ยังไม่เพียงพอ",
        message: "ปรับปรุงการใช้จ่ายและสำรองเงินฉุกเฉินเพิ่มขึ้น.",
        color: "#f87171",
      }
  }

  if (type === "debt") {
    if (value < 0.2)
      advice = {
        status: "คุณมีหนี้ในระดับที่ดี",
        message: "ควบคุมหนี้ให้อยู่ในระดับที่เหมาะสม.",
        color: "#10b981",
      }
    else if (value < 0.4)
      advice = {
        status: "พอใช้",
        message: "ระวังการก่อหนี้เพิ่มและพยายามลดภาระหนี้สิน.",
        color: "#facc15",
      }
    else
      advice = {
        status: "คุณมีความเสี่ยงด้านการชำระหนี้",
        message: "ควรลดค่าใช้จ่ายที่ไม่จำเป็นและรีไฟแนนซ์หากจำเป็น.",
        color: "#f87171",
      }
  }

  if (type === "savings") {
    if (value >= 0.2)
      advice = {
        status: "ยอดเยี่ยม",
        message: "การออมของคุณอยู่ในระดับที่ดี! ควรลงทุนต่อยอด.",
        color: "#10b981",
      }
    else if (value >= 0.1)
      advice = {
        status: "ปานกลาง",
        message: "ควรเพิ่มอัตราการออมให้สูงขึ้นเพื่อเป้าหมายอนาคต.",
        color: "#facc15",
      }
    else
      advice = {
        status: "ยังไม่เพียงพอ",
        message: "พยายามเพิ่มอัตราการออมด้วยการควบคุมค่าใช้จ่าย.",
        color: "#f87171",
      }
  }

  return advice
}

// Gauge Chart Component
const GaugeChart = ({ value, label, type }) => {
  const data = [{ value: Math.min(value * 100, 100) }]
  const advice = getFinancialAdvice(type, value)

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center mb-6">
      <h3 className="text-lg font-semibold mb-2">{label}</h3>
      <RadialBarChart
        width={300}
        height={200}
        cx={150}
        cy={150}
        innerRadius="80%"
        outerRadius="100%"
        data={data}
        startAngle={180}
        endAngle={0}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          angleAxisId={0}
          tick={false}
        />
        <RadialBar
          minAngle={15}
          background
          dataKey="value"
          fill={advice.color}
        />
      </RadialBarChart>
      <p className="text-xl font-bold" style={{ color: advice.color }}>
        {advice.status}
      </p>
    </div>
  )
}

export default function FinancialResults() {
  const location = useLocation()
  const navigate = useNavigate()

  const { value1, value2, value3 } = location.state || {
    value1: 0,
    value2: 0,
    value3: 0,
  }

  return (
    <div>
      <Header />
      <main className="container mx-auto py-12">
        <section className="bg-blue-900 text-white p-6 text-center rounded-lg mb-8">
          <h2 className="text-2xl font-bold">
            ผลการตรวจสุขภาพทางการเงินของคุณ
          </h2>
          <p className="text-lg">
            การรู้สถานะทางการเงินของคุณคือก้าวแรกที่สำคัญ
            สร้างแผนการเงินที่ดีเพื่ออนาคตที่ดีกว่า!
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GaugeChart
            value={value1}
            label="ด้านสภาพคล่องพื้นฐาน"
            type="liquidity"
          />
          <GaugeChart value={value2} label="ด้านการชำระหนี้" type="debt" />
          <GaugeChart value={value3} label="ด้านการออม" type="savings" />
        </div>

        <section className="bg-gray-100 p-6 rounded-lg shadow-md mt-6">
          <h3 className="text-xl font-semibold text-center mb-4">
            คำแนะนำทางการเงิน
          </h3>
          <p className="text-gray-700 mb-4">
            <strong>ด้านสภาพคล่อง:</strong>{" "}
            {getFinancialAdvice("liquidity", value1).message}
          </p>
          <p className="text-gray-700 mb-4">
            <strong>ด้านหนี้สิน:</strong>{" "}
            {getFinancialAdvice("debt", value2).message}
          </p>
          <p className="text-gray-700">
            <strong>ด้านการออม:</strong>{" "}
            {getFinancialAdvice("savings", value3).message}
          </p>
        </section>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/client-healthcheck-page")}
            className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700"
          >
            กรอกข้อมูลใหม่
          </button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
