import React from "react"
import { Link } from "react-router-dom"
import Header from "../components/clientHeader.jsx"
import Footer from "../components/footer.jsx"
import exampleImage1 from "../assets/retirement.png"
import exampleImage2 from "../assets/tax_planning.jpg"
import exampleImage3 from "../assets/insurance.jpg"
import exampleImage4 from "../assets/debtplanning.png"
import exampleImage5 from "../assets/educationfee.jpg"
import exampleImage6 from "../assets/heritage.png"
import { motion } from "framer-motion"

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

export default function FinancialPlanningPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <main className="flex-grow font-ibm">
          <Banner />
          <ContentSection />
          <ExamplesSection />
          <CtaSection />
        </main>
      </motion.div>
      <Footer />
    </div>
  )
}

// Banner Section
const Banner = () => (
  <section className="bg-tfpa_blue p-16 text-center text-white">
    <h1 className="text-4xl font-bold mb-4">ทำไมการวางแผนการเงินถึงสำคัญ?</h1>
    <p className="text-xl">
      สร้างความมั่นคงทางการเงินผ่านการวางแผนอย่างเป็นระบบ
    </p>
  </section>
)

// Content Section
const ContentSection = () => (
  <section className="bg-white py-12">
    <div className="container mx-auto px-4 max-w-4xl">
      <div className="space-y-6 text-gray-700">
        <p className="text-lg">
          การวางแผนการเงินคือการสร้างงบประมาณเพื่อจัดการรายได้และรายจ่าย
          สร้างกองทุนฉุกเฉินสำหรับพฤติกรรมที่ไม่คาดคิด
          และจัดการหนี้อย่างมีประสิทธิภาพ
        </p>

        <p className="text-lg">
          นอกจากนี้ยังรวมถึงการมีประกันที่เพียงพอ การวางแผนเพื่อการเกษียณ
          และการลงทุนเพื่อเพิ่มความมั่นคงในระยะยาว การลดการก่อหนี้
          การวางแผนค่าใช้จ่ายด้านการศึกษา
          และการวางแผนมรดกเพื่อจัดสรรทรัพย์สินตามที่ต้องการ
        </p>

        <p className="text-lg">
          การตรวจสอบและปรับแผนการเงินอย่างสม่ำเสมอทำให้แน่ใจว่าแผนสอดคล้องกับเป้าหมาย
          และการเปลี่ยนแปลงในชีวิต เพื่อสร้างความมั่นคงทางการเงินในอนาคต
        </p>
      </div>
    </div>
  </section>
)

// Examples Section
const ExamplesSection = () => {
  const examples = [
    {
      title: "การวางแผนเพื่อการเกษียณ",
      description: "เตรียมความพร้อมสำหรับชีวิตหลังเกษียณอย่างมั่นคง",
      imageSrc: exampleImage1, // Import your images
    },
    {
      title: "การวางแผนการจ่ายภาษี",
      description: "จัดการภาษีอย่างมีประสิทธิภาพและถูกต้อง",
      imageSrc: exampleImage2,
    },
    {
      title: "การวางแผนการทำประกัน",
      description: "คุ้มครองความเสี่ยงที่อาจเกิดขึ้นในชีวิต",
      imageSrc: exampleImage3,
    },
    {
      title: "การวางแผนจัดการหนี้สิน",
      description: "ลดภาระหนี้และจัดการการชำระเงินอย่างเป็นระบบ",
      imageSrc: exampleImage4,
    },
    {
      title: "การวางแผนค่าใช้จ่ายด้านการศึกษา",
      description: "เตรียมทุนการศึกษาสำหรับลูกหลาน",
      imageSrc: exampleImage5,
    },
    {
      title: "การวางแผนมรดก",
      description: "จัดสรรทรัพย์สินตามความต้องการอย่างถูกต้อง",
      imageSrc: exampleImage6,
    },
  ]

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-tfpa_blue mb-8">
          ตัวอย่างการวางแผนทางการเงิน
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examples.map((example, index) => (
            <ContentCard
              key={index}
              title={example.title}
              description={example.description}
              imageSrc={example.imageSrc}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// Updated Content Card Component with Image
const ContentCard = ({ title, description, imageSrc }) => (
  <div className="bg-tfpa_blue rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
    <div className="p-6">
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-white mb-4">{description}</p>
    </div>
    <div className="h-48 w-full overflow-hidden">
      <img
        src={imageSrc}
        alt={title}
        className="w-full h-full object-cover hover:scale-105 transition-transform"
      />
    </div>
  </div>
)

const CtaSection = () => (
  <section className="bg-white py-16">
    <div className="container mx-auto px-4 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-tfpa_blue mb-6">
          ทดสอบการวางแผน & สุขภาพทางการเงินของคุณ
        </h2>
        <p className="text-gray-700 text-lg mb-8">
          {/* ให้ผู้เชี่ยวชาญด้านการวางแผนการเงินของเราช่วยคุณสร้างแผนที่เหมาะสมกับความต้องการของคุณ */}
        </p>
        <Link
          to="/client-precalculation-page"
          className="bg-tfpa_blue hover:bg-tfpa_blue_hover text-white font-semibold py-3 px-8 rounded-lg transition-colors inline-block"
        >
          ทำการทดสอบด้วยตนเอง
        </Link>
      </div>
    </div>
  </section>
)
