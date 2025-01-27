import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Header from "../components/clientHeader.jsx"
import Footer from "../components/footer.jsx"
import Client_Homepage_pic1 from "../assets/importance_of_planning.jpg"
import Client_Homepage_pic2 from "../assets/plan_by_yourself.jpg"
import Client_Homepage_pic3 from "../assets/plan_with_cfp.jpeg"

export default function ClientHomePage() {
  const Banner = () => (
    <section className="bg-orange-100 p-8 text-center">
      <h2 className="text-2xl font-bold">
        CFP<sup>®</sup> Professionals deliver “The Standard of Excellence”
      </h2>
      <p className="mt-4 text-lg">
        เป้าหมายชีวิตสำเร็จได้ด้วยนักวางแผนการเงิน CFP<sup>®</sup>
      </p>
    </section>
  );

  const Features = () => (
    <section className="bg-blue-50 py-8">
      <div className="container mx-auto">
        <h2 className="text-center text-xl font-bold text-blue-700 mb-6">
          เป้าหมายชัด สุขภาพการเงินดี มาลองเช็ก ง่าย ๆ ด้วยตัวเอง
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            title="ความสำคัญของการวางแผนการเงิน"
            link="/financial-planning-importance"
            imageSrc={Client_Homepage_pic1}
          />
          <FeatureCard
            title="วางแผนการเงินของคุณ"
            link="/client-precalculation-page"
            imageSrc={Client_Homepage_pic2}
          />
          <FeatureCard
            title="ขอคำปรึกษาจากนักวางแผนการเงิน"
            link="/financial-advisor-consultation"
            imageSrc={Client_Homepage_pic3}
          />
        </div>
      </div>
    </section>
  );
  
  const FeatureCard = ({ title, link, imageSrc }) => (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <img src={imageSrc} alt={title} className="rounded-lg mb-4" />
      <h3 className="text-lg font-semibold text-blue-800 hover:underline">
        <a href={link}>{title}</a>
      </h3>
    </div>
  );

  const About = () => (
    <section className="bg-orange-100 py-8">
      <div className="container mx-auto text-center">
        <h2 className="text-xl font-bold mb-4">เกี่ยวกับเรา</h2>
        <p className="text-gray-700">
        เราเป็นทีมงานนักวางแผนการเงินที่ได้รับการรับรองจาก CFP (Certified Financial Planner) ซึ่งเป็นมาตรฐานระดับสากลที่ยืนยันถึงความเชี่ยวชาญและความน่าเชื่อถือในการให้บริการทางการเงิน ด้วยความมุ่งมั่นในการช่วยเหลือคุณสร้างความมั่นคงทางการเงิน ทีมของเราพร้อมที่จะให้คำปรึกษาและแนะนำวิธีการวางแผนการเงินที่เหมาะสมกับเป้าหมายและความต้องการเฉพาะตัวของคุณ
        ไม่ว่าคุณจะต้องการวางแผนเพื่อการเกษียณอายุ การลงทุน การจัดการหนี้สิน หรือการวางแผนภาษี เรามีประสบการณ์และความรู้ที่จะช่วยให้คุณตัดสินใจทางการเงินได้อย่างมั่นใจ เราเชื่อมั่นว่าการวางแผนการเงินที่ดีไม่เพียงแต่สร้างความมั่นคงในปัจจุบัน แต่ยังปูทางสู่อนาคตที่มั่นคงและประสบความสำเร็จอีกด้วย
        </p>
      </div>
    </section>
  );

  const FAQ = () => (
    <section className="bg-white py-8">
      <div className="container mx-auto">
        <h2 className="text-xl font-bold text-center mb-6">FAQ</h2>
        <FaqItem question="TFPA คืออะไร?" />
        <FaqItem question="ประโยชน์ของการวางแผนทางการเงิน?" />
        <FaqItem question="ทำไมฉันจึงต้องไปปรึกษานักวางแผนการเงิน?" />
      </div>
    </section>
  );

  const FaqItem = ({ question }) => (
    <details className="border-b py-4">
      <summary className="text-blue-600 cursor-pointer">{question}</summary>
      <p className="mt-2 text-gray-700">
        เนื้อหาของคำตอบเกี่ยวกับ {question}
      </p>
    </details>
  );

  return (
    <div>
        <Header />
        <main>
          <Banner />
          <Features />
          <About />
          <FAQ />
        </main>
        <Footer />
      </div>
  )
}