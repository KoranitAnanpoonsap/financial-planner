import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Header from "../components/clientHeader.jsx"
import Footer from "../components/footer.jsx"
import Client_Homepage_pic1 from "../assets/client_homepage_pic1.png"
import Client_Homepage_pic2 from "../assets/financial_planning.jpg"
import logo from "../assets/TFPA_logo.png"

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
            imageSrc={Client_Homepage_pic1}
          />
          <FeatureCard
            title="ขอคำปรึกษาจากนักวางแผนการเงิน"
            imageSrc={Client_Homepage_pic2}
          />
          <FeatureCard
            title="วางแผนการเงินของคุณ"
            imageSrc="/path-to-plan-image.jpg"
          />
        </div>
      </div>
    </section>
  );

  const FeatureCard = ({ title, imageSrc }) => (
    <div className="bg-white shadow rounded-lg p-4 text-center">
      <img src={imageSrc} alt={title} className="w-full h-40 object-cover mb-4" />
      <h3 className="text-lg font-bold">{title}</h3>
    </div>
  );

  const About = () => (
    <section className="bg-orange-100 py-8">
      <div className="container mx-auto text-center">
        <h2 className="text-xl font-bold mb-4">เกี่ยวกับเรา</h2>
        <p className="text-gray-700">
          เราเป็นทีมงานนักวางแผนการเงินที่ได้รับการรับรองจาก CFP...
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