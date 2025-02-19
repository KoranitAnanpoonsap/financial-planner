import { useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts"
import Header from "../components/clientHeader.jsx"
import Footer from "../components/footer.jsx"

// Page transition variants
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

// Helper function to determine gauge color and financial advice
const getFinancialAdvice = (type, value) => {
  let advice = { status: "", message: "", color: "#f87171" } // Default: Red (Needs Improvement)

  if (type === "liquidity") {
    if (value >= 3)
      advice = {
        status: '"คุณมีสภาพคล่องที่ดีเยี่ยม"',
        message:
          "รักษาระดับสภาพคล่องทางการเงินให้อยู่ในเกณฑ์ที่ดีและมั่นคงอยู่เสมอ เพื่อให้สามารถบริหารจัดการกระแสเงินสดได้อย่างมีประสิทธิภาพ พร้อมรองรับค่าใช้จ่ายที่ไม่คาดคิดและสร้างโอกาสทางการเงินในอนาคตได้อย่างมั่นใจ",
        color: "#10b981",
        scaledValue: 100,
      }
    else if (value >= 1)
      advice = {
        status: '"คุณมีสภาพคล่องปานกลาง"',
        message:
          "พยายามเพิ่มสินทรัพย์ที่มีสภาพคล่องสูงเพื่อเสริมสร้างความมั่นคงทางการเงิน ควบคู่ไปกับการบริหารรายรับและรายจ่ายให้สมดุล เพื่อให้มีความพร้อมในการรับมือกับเหตุการณ์ไม่คาดฝัน และลดความเสี่ยงด้านสภาพคล่องในระยะยาว",
        color: "#facc15",
        scaledValue: 50,
      }
    else
      advice = {
        status: '"คุณควรเพื่มสภาพคล่องของตัวเอง"',
        message:
          "ควรทบทวนพฤติกรรมการใช้จ่ายและวางแผนการเงินให้รอบคอบมากขึ้น โดยเน้นการลดรายจ่ายที่ไม่จำเป็น และเพิ่มการออมเงินสำรองฉุกเฉินให้เพียงพอ เพื่อป้องกันปัญหาสภาพคล่องทางการเงินในอนาคตและลดความเสี่ยงทางการเงินที่อาจเกิดขึ้น",
        color: "#f87171",
        scaledValue: 20,
      }
  }

  if (type === "debt") {
    if (value < 0.2)
      advice = {
        status: '"คุณมีหนี้ในระดับที่ดี"',
        message:
          "ควบคุมภาระหนี้ให้อยู่ในระดับที่เหมาะสม โดยบริหารจัดการการชำระหนี้อย่างมีวินัย และรักษาสัดส่วนหนี้ต่อรายได้ให้อยู่ในเกณฑ์ที่ปลอดภัย เพื่อให้สามารถใช้ประโยชน์จากสินเชื่ออย่างมีประสิทธิภาพโดยไม่เป็นภาระทางการเงินในระยะยาว",
        color: "#10b981",
        scaledValue: 100,
      }
    else if (value < 0.4)
      advice = {
        status: '"คุณมีหนี้ในระดับปานกลาง"',
        message:
          "ระมัดระวังการก่อหนี้เพิ่มโดยไม่จำเป็น และพยายามลดภาระหนี้สินลงอย่างต่อเนื่อง ควรวางแผนการชำระหนี้อย่างเป็นระบบ และปรับโครงสร้างหนี้หากจำเป็น เพื่อป้องกันไม่ให้หนี้สินกลายเป็นภาระทางการเงินที่มากเกินไปในอนาคต",
        color: "#facc15",
        scaledValue: 50,
      }
    else
      advice = {
        status: '"คุณมีความเสี่ยงด้านการชำระหนี้"',
        message:
          "ควรทบทวนและลดค่าใช้จ่ายที่ไม่จำเป็นเพื่อลดภาระหนี้สิน พร้อมทั้งพิจารณาการรีไฟแนนซ์หรือปรับโครงสร้างหนี้เพื่อให้การชำระหนี้เป็นไปอย่างมีประสิทธิภาพมากขึ้น ควรให้ความสำคัญกับการลดหนี้เป็นอันดับแรก เพื่อป้องกันความเสี่ยงด้านการเงินและเพิ่มความมั่นคงในระยะยาว",
        color: "#f87171",
        scaledValue: 20,
      }
  }

  if (type === "savings") {
    if (value >= 0.2)
      advice = {
        status: '"คุณเป็นคนที่มีการออมอยู่ในระดับที่ยอดเยี่ยม"',
        message:
          "การออมของคุณอยู่ในระดับที่ดี ซึ่งเป็นรากฐานสำคัญของความมั่นคงทางการเงิน ควรนำเงินออมไปต่อยอดด้วยการลงทุนที่เหมาะสมกับเป้าหมายและความเสี่ยงที่ยอมรับได้ เพื่อให้เงินเติบโตและสร้างโอกาสทางการเงินที่ดีขึ้นในอนาคต",
        color: "#10b981",
        scaledValue: 100,
      }
    else if (value >= 0.1)
      advice = {
        status: '"คุณเป็นคนที่มีการออมอยู่ในระดับปานกลาง"',
        message:
          "คุณมีการออมอยู่ในระดับที่พอใช้ได้ แต่ควรเพิ่มอัตราการออมให้สูงขึ้นเพื่อให้สามารถบรรลุเป้าหมายทางการเงินในอนาคตได้อย่างมั่นคง ลองวางแผนงบประมาณให้รัดกุมขึ้น และพิจารณาลดค่าใช้จ่ายที่ไม่จำเป็น เพื่อเพิ่มสัดส่วนการออมและเสริมสร้างความมั่นคงทางการเงินของคุณ",
        color: "#facc15",
        scaledValue: 50,
      }
    else
      advice = {
        status: '"คุณควรต้องเก็บออมเพิ่ม"',
        message:
          "ปัจจุบันอัตราการออมของคุณยังอยู่ในระดับที่ต่ำ ซึ่งอาจส่งผลต่อความมั่นคงทางการเงินในระยะยาว ควรพยายามเพิ่มสัดส่วนการออมด้วยการควบคุมค่าใช้จ่ายที่ไม่จำเป็น และกำหนดเป้าหมายการออมที่ชัดเจน เพื่อให้มีเงินสำรองเพียงพอสำหรับอนาคตและลดความเสี่ยงทางการเงิน",
        color: "#f87171",
        scaledValue: 20,
      }
  }

  return advice
}

// Gauge Chart Component
const GaugeChart = ({ value, label, type }) => {
  const advice = getFinancialAdvice(type, value)
  const data = [{ value: advice.scaledValue }]

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center">
      <h3 className="text-tfpa_blue text-lg font-semibold mb-2">{label}</h3>
      <div className="w-44 h-44 flex justify-center items-center">
        <RadialBarChart
          width={180}
          height={180}
          cx="50%"
          cy="50%"
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
      </div>
      <p className="text-xl font-bold mt-2" style={{ color: advice.color }}>
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
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="flex-1"
      >
        <main className="container mx-auto py-12">
          <section className="bg-tfpa_blue text-white p-6 text-center rounded-lg mb-8">
            <h2 className="text-2xl font-bold">ผลการตรวจสุขภาพการเงินของคุณ</h2>
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

          <section className="bg-white p-6 rounded-lg inset-shadow ring-1 ring-gray-700 mt-6">
            <h3 className="text-tfpa_blue text-xl text-center font-semibold mb-4">คำแนะนำทางการเงิน</h3>
            <p className="text-gray-700 mb-4">
              <strong>ด้านสภาพคล่องพื้นฐาน:</strong>{" "} <br></br>
              {getFinancialAdvice("liquidity", value1).message}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>ด้านการชำระหนี้:</strong>{" "} <br></br>
              {getFinancialAdvice("debt", value2).message}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>ด้านการออม:</strong>{" "} <br></br>
              {getFinancialAdvice("savings", value3).message}
            </p>
          </section>

          <div className="text-center mt-6">
            <button
              onClick={() => navigate(`/client-healthcheck-page`)}
              className="bg-tfpa_gold text-white font-bold py-2 px-6 rounded-lg hover:bg-tfpa_blue_hover"
            >
              กรอกข้อมูลใหม่
            </button>
          </div>
        </main>
      </motion.div>
      <Footer />
    </div>
  )
}
