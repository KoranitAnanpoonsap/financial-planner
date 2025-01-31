import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/clientHeader.jsx";
import Footer from "../components/footer.jsx";
import Client_Homepage_pic1 from "../assets/importance_of_planning.jpg";
import Client_Homepage_pic2 from "../assets/plan_by_yourself.jpg";
import Client_Homepage_pic3 from "../assets/plan_with_cfp.jpeg";

export default function ClientHomePage() {
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
  );
}

// Banner Section
const Banner = () => (
  <section className="bg-tfpa_gold p-8 text-center text-white">
    <h2 className="text-2xl font-bold">
      CFP<sup>®</sup> Professionals deliver “The Standard of Excellence”
    </h2>
    <p className="mt-4 text-lg">
      เป้าหมายชีวิตสำเร็จได้ด้วยนักวางแผนการเงิน CFP<sup>®</sup>
    </p>
  </section>
);

// Features Section
const Features = () => (
  <section className="bg-blue-50 py-8">
    <div className="container mx-auto">
      <h2 className="text-center text-xl font-bold text-tfpa_blue mb-6">
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

// Feature Card Component
const FeatureCard = ({ title, link, imageSrc }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white shadow-lg rounded-lg p-4 cursor-pointer h-full flex flex-col justify-between"
      onClick={() => navigate(link)}
    >
      <img
        src={imageSrc}
        alt={title}
        className="rounded-lg mb-4 w-full h-48 object-cover"
      />
      <h3 className="text-lg font-semibold text-tfpa_blue hover:underline flex-grow flex items-center">
        <Link to={link} className="w-full text-center">
          {title}
        </Link>
      </h3>
    </div>
  );
};

// About Section
const About = () => (
  <section className="bg-tfpa_gold p-8">
    <div className="container mx-auto text-center">
      <h2 className="text-xl font-bold text-white mb-4">เกี่ยวกับเรา</h2>
      <p className="text-white">
      เราเป็นทีมงานนักวางแผนการเงินที่ได้รับการรับรองจาก CFP (Certified Financial Planner) ซึ่งเป็นมาตรฐานระดับสากลที่ยืนยันถึงความเชี่ยวชาญและความน่าเชื่อถือในการให้บริการทางการเงิน ด้วยความมุ่งมั่นในการช่วยเหลือคุณสร้างความมั่นคงทางการเงิน ทีมของเราพร้อมที่จะให้คำปรึกษาและแนะนำวิธีการวางแผนการเงินที่เหมาะสมกับเป้าหมายและความต้องการเฉพาะตัวของคุณ
      ไม่ว่าคุณจะต้องการวางแผนเพื่อการเกษียณอายุ การลงทุน การจัดการหนี้สิน หรือการวางแผนภาษี เรามีประสบการณ์และความรู้ที่จะช่วยให้คุณตัดสินใจทางการเงินได้อย่างมั่นใจ เราเชื่อมั่นว่าการวางแผนการเงินที่ดีไม่เพียงแต่สร้างความมั่นคงในปัจจุบัน แต่ยังปูทางสู่อนาคตที่มั่นคงและประสบความสำเร็จอีกด้วย
      </p>
    </div>
  </section>
);

// FAQ Section
const FAQ = () => (
  <section className="bg-white py-8">
    <div className="container mx-auto">
      <h2 className="text-xl font-bold text-center text-tfpa_blue mb-6">FAQ</h2>
      <FaqItem question="TFPA คืออะไร?" />
      <FaqItem question="ประโยชน์ของการวางแผนทางการเงิน?" />
      <FaqItem question="ทำไมฉันจึงต้องไปปรึกษานักวางแผนการเงิน?" />
    </div>
  </section>
);

// FAQ Item Component
const FaqItem = ({ question }) => (
  <details className="border-b py-4">
    <summary className="text-tfpa_blue cursor-pointer text-lg font-semibold">
      {question}
    </summary>
    <p className="mt-2 text-gray-700">
      เนื้อหาของคำตอบเกี่ยวกับ {question}
    </p>
  </details>
);
