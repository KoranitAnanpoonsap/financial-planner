import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

export default function ClientHomePage() {
  const Header = () => (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto flex justify-between items-center py-4">
        <div className="flex items-center space-x-4">
          <img
            src="/path-to-logo.png"
            alt="TFPA Logo"
            className="h-12"
          />
          <h1 className="text-xl font-bold">Thai Financial Planners Association</h1>
        </div>
        <nav className="space-x-4">
          <Link to="/" className="text-blue-500 hover:underline">
            หน้าหลัก
          </Link>
          <Link to="/about" className="text-blue-500 hover:underline">
            เกี่ยวกับสมาคม
          </Link>
          <Link to="/planners" className="text-blue-500 hover:underline">
            รายชื่อนักวางแผนการเงิน
          </Link>
          <Link to="/plans" className="text-blue-500 hover:underline">
            วางแผน
          </Link>
          <Link to="/faq" className="text-blue-500 hover:underline">
            FAQ
          </Link>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Login
          </button>
        </nav>
      </div>
    </header>
  );

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
            imageSrc="/path-to-budget-image.jpg"
          />
          <FeatureCard
            title="ขอคำปรึกษาจากนักวางแผนการเงิน"
            imageSrc="/path-to-advisor-image.jpg"
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

  const Footer = () => (
    <footer className="bg-blue-900 text-white py-6">
      <div className="container mx-auto text-center">
        <p>Copyright © 2024 Thai Financial Planners Association</p>
        <p>โทรศัพท์: 0 2009 9393 | Website: www.tfpa.or.th</p>
      </div>
    </footer>
  );

  return (
    <Router>
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
    </Router>
  )
}
