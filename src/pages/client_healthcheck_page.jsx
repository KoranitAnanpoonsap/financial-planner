import React, { useState } from 'react';
import Header from "../components/clientHeader.jsx";
import Footer from "../components/footer.jsx";

export default function FinancialHealthForm() {
  const [formData, setFormData] = useState({
    cashFlow: 0,
    liquidAssets: 0,
    annualIncome: 0,
    debtPayments: 0,
    annualSavings: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: Number(value),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
    // Perform calculations or API calls here
  };

  const InputField = ({ label, name }) => (
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-2" htmlFor={name}>
        {label} <span className="text-gray-500">(ต่อเดือน)</span>
      </label>
      <input
        type="number"
        name={name}
        id={name}
        value={formData[name] || 0}
        onChange={handleInputChange}
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
    </div>
  );

  return (
    <div>
      <Header />
      <main className="container mx-auto py-12">
        <section className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">
            ตรวจสุขภาพทางการเงินของคุณง่าย ๆ ใน 3 นาที!
          </h2>
          <p className="text-gray-600 mb-8 text-center">
            กรอกข้อมูลเบื้องต้นเพื่อให้เราช่วยคุณตรวจสอบสุขภาพการเงิน
          </p>
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
            <InputField label="กระแสเงินสด" name="cashFlow" />
            <InputField label="สินทรัพย์สภาพคล่อง" name="liquidAssets" />
            <InputField label="รายรับรวม" name="annualIncome" />
            <InputField label="เงินใช้ระคืนหนี้สิน" name="debtPayments" />
            <InputField label="เงินออม" name="annualSavings" />
            <button
              type="submit"
              className="w-full bg-yellow-500 text-white font-bold py-2 px-4 rounded-md hover:bg-yellow-600"
            >
              คำนวณ
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}