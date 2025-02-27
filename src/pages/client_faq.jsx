import React, { useState } from "react"
import Header from "../components/clientHeader.jsx"
import Footer from "../components/footer.jsx"
import wallpaper from "../assets/planner.jpg"
import { motion, AnimatePresence } from "framer-motion"
import { FaChevronDown } from "react-icons/fa"

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
        <main className="flex-grow font-ibm">
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

const FAQSection = () => {
  const faqItems = [
    {
      question: "แนะนำการใช้งานวางแผนพร้อมรับคำแนะนำจากการวางแผนเกษียณ คืออะไร และเหตุใดจึงสำคัญ?",
      answer: [
        "วางแผนเกษียณ คืออะไร",
        "การวางแผนเกษียณเป็นวิธีเก็บเงินที่ช่วยให้เรามีเงินพอใช้ในช่วงบั้นปลายชีวิตเมื่อไม่สามารถหารายได้จากการทำงานอีกแล้ว เพราะลาออกก่อนครบกำหนดเกษียณ (Early Retire) หรือเกษียณในกรณีอายุครบ 60 ปี โดยเงินเก็บที่ใช้สำหรับชีวิตหลังเกษียณ ควรครอบคลุมทุกค่าใช้จ่าย เช่น ค่าเล่าเรียนของบุตรหลาน หรือค่าใช้จ่ายเล็กๆ อย่างค่าน้ำมันรถยนต์, ค่าอาหารในแต่ละมื้อ เป็นต้น เพื่อมั่นใจได้ว่าแผนเกษียณ จะรัดกุมเพียงพอ จนไม่ต้องทำงานหาเงินเพิ่มในยามที่สุขภาพเริ่มทรุดโทรม",
        <br></br>,
        "ทำไมต้องวางแผนเกษียณ",
        "แม้ว่าคุณทำอาชีพรับราชการได้รับเงินบำนาญจากกบข. หรือเป็นพนักงานเอกชนที่มีกองทุนสำรองเลี้ยงชีพ แต่การวางแผนเกษียณ เราไม่สามารถพึ่งพาเงินจากแหล่งดังกล่าวได้เพียงช่องทางเดียว เพราะอัตราเงินเฟ้อเพิ่ม ขึ้นทุกๆ ปี ทำให้มูลค่าของเงินลดลงในอนาคต อย่างไม่รู้ตัว และซื้อสินค้าได้น้อยลง แถมยังมีโอกาสใช้เงิน มากกว่าสวัสดิการดังกล่าวอีกด้วย",
        "ด้วยเหตุนี้การวางแผนเกษียณจึงควรวางแผนการเงินควบคู่กันไป เพื่อเก็บเงินถึงเป้าหมายให้เร็วที่สุด และมองหาช่องทางลงทุนอื่นๆ สำหรับต่อยอดรายได้เพิ่มเติมในกรณีที่ไม่มีแรงหารายได้ และยังช่วยให้เรามีเงินใช้จ่ายเพิ่มเติมในยามฉุกเฉินด้วย"
      ]
    },
    {
      question: "ปัจจัยสำคัญที่ต้องพิจารณาในการวางแผนเกษียณอายุมีอะไรบ้าง?",
      answer: [
        "ปัจจัยสำคัญประกอบด้วย:",
        "- อายุที่ต้องการเกษียณ",
        "- จำนวนเงินเก็บที่ต้องการ",
        "- อัตราเงินเฟ้อ",
        "- ผลตอบแทนการลงทุนที่คาดหวัง",
        "- สุขภาพและอายุขัยที่คาดการณ์",
        "- แผนการใช้ชีวิตหลังเกษียณ"
      ]
    },
    {
      question: "ฉันจะคำนวณเป้าหมายการออมเพื่อการเกษียณอายุได้อย่างไร",
      answer: [
        "ขั้นตอนการคำนวณ:",
        "1. ประเมินค่าใช้จ่ายรายปีหลังเกษียณ",
        "2. คูณด้วยจำนวนปีที่คาดว่าจะใช้ชีวิต",
        "3. หักลบด้วยเงินบำนาญที่คาดจะได้รับ",
        "4. พิจารณาอัตราเงินเฟ้อ",
        "5. ใช้สูตรคำนวณดอกเบี้ยทบต้นเพื่อหากำลังออมที่ต้องการ"
      ]
    },
    {
      question: "ประโยชน์ของการวางแผนทางการเกษียณ?",
      answer: [
        "1. มีความมั่นคงทางการเงิน",
        "2. ลดความเครียดเกี่ยวกับอนาคต",
        "3. สามารถวางแผนการใช้ชีวิตได้ตามต้องการ",
        "4. หลีกเลี่ยงการเป็นภาระลูกหลาน",
        "5. มีเวลาเตรียมตัวสำหรับสถานการณ์ไม่คาดคิด"
      ]
    },
    {
      question: "ฉันควรเริ่มวางแผนเกษียณเมื่อใด? และสามารถทำได้อย่างไร?",
      answer: [
        "ควรเริ่มวางแผนทันทีที่เริ่มทำงาน ยิ่งเริ่มเร็วยิ่งดี เริ่มต้นด้วยการ:",
        "1. กำหนดเป้าหมาย",
        "2. ตรวจสอบสถานะการเงินปัจจุบัน",
        "3. ตั้งงบประมาณ",
        "4. เลือกเครื่องมือการลงทุนที่เหมาะสม",
        "5. ตรวจสอบและปรับปรุงแผนเป็นประจำ"
      ]
    },
    {
      question: "ทำไมฉันจึงต้องปรึกษาทางการเงินกับนักวางแผนการเงิน?",
      answer: [
        "นักวางแผนการเงินมี expertise ในการ:",
        "1. วิเคราะห์สถานะการเงินอย่างเป็นระบบ",
        "2. ช่วยเลือกเครื่องมือการลงทุนที่เหมาะสม",
        "3. ให้คำแนะนำเกี่ยวกับการลดหย่อนภาษี",
        "4. ช่วยสร้างแผนที่ปรับตามการเปลี่ยนแปลงชีวิต",
        "5. ให้มุมมองจากผู้เชี่ยวชาญที่ไม่มีอคติ"
      ]
    }
  ]

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-2xl font-bold text-center text-tfpa_blue mb-8">
          คำถามที่พบบ่อยทั่วไปบางส่วน
        </h2>
        <div className="space-y-6">
          {faqItems.map((item, index) => (
            <FaqItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  )
}

// FAQ Item Component with Animation and Arrow Icon
const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleOpen = () => setIsOpen((prev) => !prev)

  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div
        onClick={toggleOpen}
        className="flex justify-between text-tfpa_blue items-center cursor-pointer"
      >
        <h3 className="text-tfpa_blue text-lg font-semibold">{question}</h3>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaChevronDown />
        </motion.span>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 text-gray-700 overflow-hidden"
          >
            <div className="pl-4">
              {answer.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

