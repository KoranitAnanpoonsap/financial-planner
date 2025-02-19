import React from "react"
import Header from "../components/clientHeader.jsx"
import Footer from "../components/footer.jsx"
import wallpaper from "../assets/planner.jpg"
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

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="flex-1"
      >
        <main className="flex-grow">
          <Banner />
          <FAQSection />
        </main>
      </motion.div>
      <Footer />
    </div>
  )
}

// Banner Section
const Banner = () => (
  <section
    className="relative bg-cover bg-center"
    style={{ backgroundImage: `url(${wallpaper})` }}
  >
    <div className="absolute inset-0 bg-tfpa_blue opacity-70"></div>
    <div className="relative z-10 max-w-6xl mx-auto px-4 py-10 text-white text-center">
      <h1 className="text-tfpa_gold text-4xl font-bold mb-4">คำถามที่พบบ่อย</h1>
      <p className="text-xl">
        คำถามและข้อกังวลทั่วไปที่ผู้ใช้หรือลูกค้ามีเกี่ยวกับบริการและทรัพยากรที่เรานำเสนอ
      </p>
    </div>
  </section>
)

// FAQ Section
const FAQSection = () => {
  const faqItems = [
    "แนะนำการใช้งานวางแผนพร้อมรับคำแนะนำจากการวางแผนเกษียณ คืออะไร และเหตุใดจึงสำคัญ?",
    "ปัจจัยสำคัญที่ต้องพิจารณาในการวางแผนเกษียณอายุมีอะไรบ้าง?",
    "ฉันจะคำนวณเป้าหมายการออมเพื่อการเกษียณอายุได้อย่างไร",
    "ประโยชน์ของการวางแผนทางการเกษียณ?",
    "ฉันควรเริ่มวางแผนเกษียณเมื่อใด? และสามารถทำได้อย่างไร?",
    "ทำไมฉันจึงต้องปรึกษาทางการเงินกับนักวางแผนการเงิน?",
  ]

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-2xl font-bold text-center text-tfpa_blue mb-8">
          คำถามที่พบบ่อยทั่วไปบางส่วน
        </h2>
        <div className="space-y-6">
          {faqItems.map((question, index) => (
            <FaqItem key={index} question={question} />
          ))}
        </div>
      </div>
    </section>
  )
}

// FAQ Item Component
const FaqItem = ({ question }) => (
  <details className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
    <summary className="text-tfpa_blue cursor-pointer text-lg font-semibold">
      {question}
    </summary>
    <p className="mt-2 text-gray-700 pl-4">
      {/* Add actual answers here when available */}
      วางแผนเกษียณ คืออะไร <br></br>
      การวางแผนเกษียณเป็นวิธีเก็บเงินที่ช่วยให้เรามีเงินพอใช้ในช่วงบั้นปลายชีวิตเมื่อไม่สามารถหารายได้จากการ
      ทำงานอีกแล้ว เพราะลาออกก่อนครบกำหนดเกษียณ (Early Retire)
      หรือเกษียณในกรณีอายุครบ 60 ปี โดยเงินเก็บที่ใช้สำหรับชีวิตหลังเกษียณ
      ควรครอบคลุมทุกค่าใช้จ่าย เช่น ค่าเล่าเรียนของบุตรหลาน หรือค่าใช้จ่ายเล็กๆ
      อย่างค่าน้ำมันรถยนต์, ค่าอาหารในแต่ละมื้อ เป็นต้น
      เพื่อมั่นใจได้ว่าแผนเกษียณ จะรัดกุมเพียงพอ
      จนไม่ต้องทำงานหาเงินเพิ่มในยามที่สุขภาพเริ่มทรุดโทรม <br></br>
      <br></br>
      ทำไมต้องวางแผนเกษียณ <br></br>
      แม้ว่าคุณทำอาชีพรับราชการได้รับเงินบำนาญจากกบข.
      หรือเป็นพนักงานเอกชนที่มีกองทุนสำรองเลี้ยงชีพ แต่การวางแผนเกษียณ
      เราไม่สามารถพึ่งพาเงินจากแหล่งดังกล่าวได้เพียงช่องทางเดียว
      เพราะอัตราเงินเฟ้อเพิ่ม ขึ้นทุกๆ ปี ทำให้มูลค่าของเงินลดลงในอนาคต
      อย่างไม่รู้ตัว และซื้อสินค้าได้น้อยลง แถมยังมีโอกาสใช้เงิน
      มากกว่าสวัสดิการดังกล่าวอีกด้วย
      ด้วยเหตุนี้การวางแผนเกษียณจึงควรวางแผนการเงินควบคู่กันไป
      เพื่อเก็บเงินถึงเป้าหมายให้เร็วที่สุด และมองหาช่องทางลงทุนอื่นๆ
      สำหรับต่อยอดรายได้เพิ่มเติมในกรณีที่ไม่มีแรงหารายได้
      และยังช่วยให้เรามีเงินใช้จ่ายเพิ่มเติมในยามฉุกเฉินด้วย
    </p>
  </details>
)
