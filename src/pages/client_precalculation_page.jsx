import { motion } from "framer-motion"
import Header from "../components/clientHeader.jsx"
import Footer from "../components/footer.jsx"
import FinancialHealthIllustration from "../assets/Financial-Healthcheck.jpg"
import FinancialGoalIllustration from "../assets/EasyGoal.png"
import { useNavigate } from "react-router-dom"

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

export default function FinancialHealthCheck() {
  const navigate = useNavigate()

  const FinancialHealthSection = () => (
    <section className="bg-white rounded-lg shadow-lg p-6 mb-12">
      <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-6">
        <div className="lg:w-1/2">
          <h2 className="text-2xl font-bold text-tfpa_blue mb-4">
            ตรวจสุขภาพทางการเงินของคุณง่าย ๆ ใน 3 นาที!
          </h2>
          <p className="text-gray-600 mb-4">
            สำรวจสุขภาพทางการเงินของคุณพร้อมรับคำแนะนำเบื้องต้น
            รู้จักการเงินตัวเองได้ง่าย ๆ ในไม่กี่นาที
          </p>
          <button
            onClick={() => navigate(`/client-healthcheck-page`)}
            className="bg-tfpa_blue hover:bg-tfpa_blue_hover text-white py-2 px-4 rounded-full inline-block"
          >
            เริ่มตรวจสุขภาพทางการเงินของคุณกันเถอะ
          </button>
        </div>
        <div className="lg:w-1/2 flex justify-center">
          <img
            src={FinancialHealthIllustration}
            alt="Financial Health Illustration"
            className="max-w-full h-auto rounded-xl"
          />
        </div>
      </div>
    </section>
  )

  const FinancialGoalSection = () => (
    <section className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-6">
        <div className="lg:w-1/2 flex justify-center">
          <img
            src={FinancialGoalIllustration}
            alt="Financial Goal Illustration"
            className="max-w-full h-auto rounded-xl"
          />
        </div>
        <div className="lg:w-1/2">
          <h2 className="text-2xl font-bold text-tfpa_blue mb-4">
            วางแผนเป้าหมายทางการเงินได้ง่าย ๆ เพื่ออนาคตที่ชัดเจน
          </h2>
          <p className="text-gray-600 mb-4">
            สำรวจเป้าหมายทางการเงินของคุณในไม่กี่ขั้นตอน พร้อมคำแนะนำ
            นำไปปรับใช้ได้ทันที
          </p>
          <button
            onClick={() => navigate(`/client-easygoal-page`)}
            className="bg-tfpa_blue hover:bg-tfpa_blue_hover text-white py-2 px-4 rounded-full inline-block"
          >
            เริ่มวิเคราะห์เป้าหมายของคุณกันเถอะ
          </button>
        </div>
      </div>
    </section>
  )

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
        <main className="container mx-auto py-12 font-ibm">
          <FinancialHealthSection />
          <FinancialGoalSection />
        </main>
      </motion.div>
      <Footer />
    </div>
  )
}
