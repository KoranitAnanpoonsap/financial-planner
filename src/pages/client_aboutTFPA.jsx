import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/clientHeader.jsx";
import Footer from "../components/footer.jsx";
import wallpaper from "../assets/planner.jpg"

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
  <section className="relative bg-cover bg-center" style={{ backgroundImage: `url(${wallpaper})` }}>
    <div className="absolute inset-0 bg-tfpa_blue opacity-70"></div>
    <div className="relative z-10 max-w-6xl mx-auto px-4 py-10 text-white text-center">
      <h1 className="text-tfpa_gold text-4xl font-bold mb-4">
        เกี่ยวกับสมาคมนักวางแผนการเงิน
      </h1>
      <p className="text-xl">
        Thai Financial Planners Association
      </p>
    </div>
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
        <h2 className="text-3xl font-bold text-center text-tfpa_blue mb-8">
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
      <h3 className="text-xl font-semibold text-tfpa_blue text-center">
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
    'ประวัติสมาคม',
    'สมาชิกผู้ร่วมก่อตั้ง',
    'โครงสร้างสมาคม'
  ];

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-tfpa_blue mb-8">
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