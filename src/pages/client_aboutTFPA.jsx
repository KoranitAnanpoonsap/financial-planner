import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/clientHeader.jsx";
import Footer from "../components/footer.jsx";

export default function FinancialPlannerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Banner />
        <Features />
        <Mission />
      </main>
      <Footer />
    </div>
  );
}

// Banner Section
const Banner = () => (
  <section className="bg-blue-800 p-8 text-center text-white">
    <h1 className="text-4xl font-bold mb-4">
      เที่ยวกับสมาคมนักวางแผนการเงิน
    </h1>
    <p className="text-xl">
      Thai Financial Planners Association
    </p>
  </section>
);

// Features Section
const Features = () => {
  const features = [
    { 
      title: "รายงานประจำปี",
      link: "/annual-report",
    },
    { 
      title: "รับงานกับเรา",
      link: "/careers",
    }
  ];

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">
          สมาคมนักวางแผนการเงิน
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              link={feature.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Feature Card Component
const FeatureCard = ({ title, link }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => navigate(link)}
    >
      <h3 className="text-xl font-semibold text-blue-800 text-center">
        <Link to={link} className="hover:underline">
          {title}
        </Link>
      </h3>
    </div>
  );
};

// Mission Section
const Mission = () => {
  const missionItems = [
    'ประวัติสบาคม',
    'สมาชิกผู้ร่วมก่อตั้งสมาชิกผู้ร่วมก่อตั้ง',
    'โครงสร้างสบาคม'
  ];

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">
          พันธกิจ
        </h2>
        <ul className="space-y-4 max-w-2xl mx-auto">
          {missionItems.map((item, index) => (
            <li 
              key={index}
              className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-800"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};