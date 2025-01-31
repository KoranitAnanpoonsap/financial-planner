import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/clientHeader.jsx";
import Footer from "../components/footer.jsx";

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Banner />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}

// Banner Section
const Banner = () => (
  <section className="bg-blue-800 p-8 text-center text-white">
    <h1 className="text-4xl font-bold mb-4">คำถามที่พบบ่อย</h1>
    <p className="text-xl">คำถามและข้อกังวลทั่วไปที่ผู้ใช้หรือลูกค้ามีเกี่ยวกับบริการและทรัพยากรที่เรานำเสนอ</p>
  </section>
);

// FAQ Section
const FAQSection = () => {
  const faqItems = [
    "แนะนำการใช้งานวางแผนพร้อมรับคำแนะนำจากการวางแผนเกษียณ คืออะไร และเหตุใดจึงสำคัญ?",
    "ปัจจัยสำคัญที่ต้องพิจารณาในการวางแผนเกษียณอายุมีอะไรบ้าง?",
    "ฉันจะคำนวณเป้าหมายการออมเพื่อการเกษียณอายุได้อย่างไร",
    "ประโยชน์ของการวางแผนทางการเกษียณ?",
    "ฉันควรเริ่มวางแผนเกษียณเมื่อใด? และสามารถทำได้อย่างไร?",
    "ทำไมฉันจึงต้องปรึกษาทางการเงินกับนักวางแผนการเงิน?"
  ];

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-8">
          คำถามที่พบบ่อยทั่วไปบางส่วน
        </h2>
        <div className="space-y-6">
          {faqItems.map((question, index) => (
            <FaqItem key={index} question={question} />
          ))}
        </div>
      </div>
    </section>
  );
};

// FAQ Item Component
const FaqItem = ({ question }) => (
  <details className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
    <summary className="text-blue-800 cursor-pointer text-lg font-semibold">
      {question}
    </summary>
    <p className="mt-2 text-gray-700 pl-4">
      {/* Add actual answers here when available */}
      เนื้อหาของคำตอบเกี่ยวกับคำถามนี้จะแสดงในส่วนนี้
    </p>
  </details>
);