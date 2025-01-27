import React, { useState } from "react";
import Header from "../components/clientHeader.jsx";
import Footer from "../components/footer.jsx";

export default function FinancialHealthForm() {
  const [formData, setFormData] = useState({
    cashFlow: "",
    liquidAssets: "",
    annualIncome: "",
    debtPayments: "",
    annualSavings: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Allow only numbers (or an empty string) and update state
    if (/^\d*$/.test(value)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value, // Keep as a string to avoid React delays
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert strings to numbers when processing the form data
    const numericData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, Number(value) || 0])
    );

    console.log("Form data submitted:", numericData);
    // Perform calculations or API calls here
  };

  const InputField = ({ label, name }) => (
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-2" htmlFor={name}>
        {label} <span className="text-gray-500">(ต่อเดือน)</span>
      </label>
      <input
        type="text" // Keep as text to handle input validation
        name={name}
        id={name}
        value={formData[name]} // Controlled input
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
