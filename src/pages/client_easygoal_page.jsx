import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "../components/clientHeader.jsx";
import Footer from "../components/footer.jsx";
import wallpaper from "../assets/EasyGoal.png"

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 1 },
};

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.4,
};

export default function EasyGoal() {
  const navigate = useNavigate();

  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [timeFrame, setTimeFrame] = useState("");
  const [currentSavings, setCurrentSavings] = useState("");
  const [expectedReturn, setExpectedReturn] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const target = parseFloat(targetAmount);
    const years = parseFloat(timeFrame);
    const savings = parseFloat(currentSavings);
    const returnRate = parseFloat(expectedReturn) / 100;

    navigate(`/client-easygoal-result`, {
      state: { goalName, target, years, savings, returnRate },
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="flex-1 relative z-10 flex flex-col justify-center"
      >
        <main className="container mx-auto py-12 flex-1 relative overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${wallpaper})` }}
          />
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          
          {/* Content */}
          <form
            onSubmit={handleSubmit}
            className="relative bg-white bg-opacity-90 rounded-lg shadow-lg p-6 max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-tfpa_blue mb-4 text-center">
              วางแผนเป้าหมายทางการเงินได้ง่าย ๆ เพื่ออนาคตที่ชัดเจน
            </h2>
            <p className="text-gray-600 mb-8 text-center">
              สำรวจเป้าหมายทางการเงินของคุณในไม่กี่ขั้นตอน พร้อมคำแนะนำที่นำไปใช้ได้ทันที
            </p>
  
            <InputField label="ชื่อเป้าหมาย" value={goalName} setValue={setGoalName} tooltip="ชื่อของเป้าหมายที่คุณต้องการบรรลุ เช่น ซื้อบ้าน, รถยนต์, เกษียณอายุ" />
            <InputField label="จำนวนเงิน (บาท)" value={targetAmount} setValue={setTargetAmount} tooltip="จำนวนเงินที่คุณต้องใช้เพื่อบรรลุเป้าหมายนี้" />
            <InputField label="ระยะเวลา (ปี)" value={timeFrame} setValue={setTimeFrame} tooltip="จำนวนปีที่คุณต้องการบรรลุเป้าหมายนี้" />
            <InputField label="เงินรวมปัจจุบันในการลงทุน (บาท)" value={currentSavings} setValue={setCurrentSavings} tooltip="จำนวนเงินที่คุณมีอยู่ในการลงทุนปัจจุบันเพื่อใช้สำหรับเป้าหมายนี้ เช่น เงินฝาก หรือ การลงทุนในสินทรัพย์อื่นๆ" />
            <InputField label="ผลตอบแทนต่อปีของการลงทุน (%)" value={expectedReturn} setValue={setExpectedReturn} tooltip="อัตราผลตอบแทนที่คุณคาดหวังจากการลงทุน" />
  
            <div className="text-center">
              <button type="submit" className="bg-tfpa_gold text-white font-bold py-2 px-6 rounded-lg hover:bg-yellow-600">
                คำนวณ
              </button>
            </div>
          </form>
        </main>
      </motion.div>
      <Footer />
    </div>
  );  
}

function InputField({ label, value, setValue, tooltip, suffix }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="mb-4 relative">
      <label className="block text-gray-700 font-medium">
        {label}
        <span
          className="ml-2 cursor-pointer text-blue-500 relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
      >
        ℹ️
        {showTooltip && (
          <div className="absolute left-0 top-6 w-56 p-2 bg-gray-700 text-white text-sm rounded-md shadow-lg z-10">
            {tooltip}
          </div>
        )}
      </span>
      </label>
      <div className="flex items-center">
        <input
          type="text"
          className="w-full p-2 border rounded-lg"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
      </div>
    </div>
  );
}

