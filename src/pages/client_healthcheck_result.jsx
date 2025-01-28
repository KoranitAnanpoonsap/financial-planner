import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/clientHeader.jsx";
import Footer from "../components/footer.jsx";

export default function HealthcheckResults() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve state data
  const { value1, value2, value3 } = location.state || {};

  return (
    <div>
      <Header />
      <main className="container mx-auto py-12">
        <section className="bg-white rounded-lg shadow-lg p-6 mb-12 text-center">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">
            ผลลัพธ์การตรวจสุขภาพทางการเงิน
          </h2>
          <p className="text-gray-600 mb-4">
            ตรวจสอบดัชนีทางการเงินของคุณจากข้อมูลที่คุณกรอก
          </p>
          <div className="bg-gray-100 p-6 rounded-lg">
            <p className="text-lg font-semibold">อัตราสภาพคล่อง: {value1.toFixed(2)}</p>
            <p className="text-lg font-semibold">อัตราหนี้สินต่อรายรับ: {value2.toFixed(2)}</p>
            <p className="text-lg font-semibold">อัตราการออม: {value3.toFixed(2)}</p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700"
          >
            กลับไปหน้าแรก
          </button>
        </section>
      </main>
      <Footer />
    </div>
  );
}
