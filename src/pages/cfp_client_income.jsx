import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Footer from "../components/footer"
import Header from "../components/cfpHeader"
import CfpClientSidePanel from "../components/cfpClientSidePanel"
import { motion } from "framer-motion"

// Mapping for income types
const incomeTypes = {
  1: "40(1) เงินเดือน",
  2: "40(2) รับจ้างทำงาน",
  3: "40(3) ค่าลิขสิทธิ์ สิทธิบัตร",
  4: "40(4) ดอกเบี้ย เงินปันผล",
  5: "40(5) ค่าเช่าทรัพย์สิน",
  6: "40(6) วิชาชีพอิสระ",
  7: "40(7) รับเหมาก่อสร้าง",
  8: "40(8) รายได้อื่นๆ",
}

// Mapping for 40(5) subtypes
const income405SubTypes = {
  1: "บ้าน/โรงเรือน/สิ่งปลูกสร้าง/แพ/ยานพาหนะ",
  2: "ที่ดินที่ใช้ในการเกษตร",
  3: "ที่ดินที่มิได้ใช้ในการเกษตร",
  4: "ทรัพย์สินอื่นๆ",
}

// Mapping for 40(6) subtypes
const income406SubTypes = {
  1: "การประกอบโรคศิลปะ",
  2: "กฎหมาย/วิศวกรรม/สถาปัตยกรรม/การบัญชี/ประณีตศิลปกรรม",
}

// Mapping for 40(8) subtypes
const income408SubTypes = {
  1: "ประเภทที่ (1) (เงินได้ส่วนที่ไม่เกิน 300,000 บาท)",
  2: "ประเภทที่ (1) (เงินได้ส่วนที่เกิน 300,000 บาท)",
  3: "ประเภทที่ (2) ถึง (43)",
  4: "เงินได้ประเภทที่ไม่อยู่ใน (1) ถึง (43)",
}

// Mapping for frequencies
const frequencyTypes = {
  1: "ทุกเดือน",
  2: "ทุกปี",
  3: "ได้เป็นก้อน",
}

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 1 },
}

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.4,
}

export default function CFPClientIncomePage() {
  const [clientUuid] = useState(localStorage.getItem("clientUuid") || "")
  const navigate = useNavigate()

  const [incomes, setIncomes] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [editingIncome, setEditingIncome] = useState(null)

  const [type, setType] = useState(0) // 0 represents "เลือก"
  const [incomeName, setIncomeName] = useState("")
  const [frequency, setFrequency] = useState(1) // 1 represents "ทุกเดือน"
  const [amount, setAmount] = useState("")
  const [growthRate, setGrowthRate] = useState("")
  const [income405Type, setIncome405Type] = useState(0) // 0 represents "เลือก"
  const [income406Type, setIncome406Type] = useState(0) // 0 represents "เลือก"
  const [income408Type, setIncome408Type] = useState(0) // 0 represents "เลือก"

  // For showing/hiding the 40(8) details modal
  const [show408Details, setShow408Details] = useState(false)

  useEffect(() => {
    fetchIncomes()
  }, [clientUuid])

  const fetchIncomes = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_KEY}api/clientincome/${clientUuid}`
      )
      if (!res.ok) {
        console.error("Failed to fetch incomes")
        return
      }
      const data = await res.json()
      setIncomes(data)
    } catch (error) {
      console.error("Error fetching incomes:", error)
    }
  }

  const handleCreateOrUpdateIncome = async () => {
    // Validate required fields
    if (
      type === 0 ||
      incomeName.trim() === "" ||
      frequency === 0 ||
      amount === "" ||
      growthRate === ""
    ) {
      return
    }

    const newIncome = {
      clientUuid: clientUuid,
      clientIncomeName: incomeName,
      clientIncomeType: type,
      clientIncomeFrequency: frequency,
      clientIncomeAmount: parseFloat(amount),
      clientIncomeAnnualGrowthRate: parseFloat(growthRate) / 100,
      clientIncome405Type: type === 5 ? income405Type : null,
      clientIncome406Type: type === 6 ? income406Type : null,
      clientIncome408Type: type === 8 ? income408Type : null,
    }

    let url = `${import.meta.env.VITE_API_KEY}api/clientincome`
    let method = "POST"

    if (editMode && editingIncome) {
      if (editingIncome.clientIncomeName !== incomeName) {
        // If the income name is being updated, delete the old record and create a new one
        await fetch(
          `${import.meta.env.VITE_API_KEY}api/clientincome/${clientUuid}/${
            editingIncome.clientIncomeName
          }`,
          { method: "DELETE" }
        )
      } else {
        url = `${import.meta.env.VITE_API_KEY}api/clientincome/${clientUuid}/${
          editingIncome.clientIncomeName
        }`
        method = "PUT"
      }
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newIncome),
      })

      if (!res.ok) {
        console.error("Failed to create/update income")
        return
      }

      await res.json()

      // Refresh list
      await fetchIncomes()

      // Reset fields
      handleCancelEdit()
    } catch (error) {
      console.error("Error create/update income:", error)
    }
  }

  const handleDeleteIncome = async (inc) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_KEY}api/clientincome/${clientUuid}/${
          inc.clientIncomeName
        }`,
        { method: "DELETE" }
      )
      if (!res.ok) {
        console.error("Failed to delete income")
        return
      }
      // Refresh list
      await fetchIncomes()
    } catch (error) {
      console.error("Error deleting income:", error)
    }
  }

  const handleEdit = (inc) => {
    setEditMode(true)
    setEditingIncome(inc)
    setType(inc.clientIncomeType)
    setIncomeName(inc.clientIncomeName)
    setFrequency(inc.clientIncomeFrequency)
    setAmount(inc.clientIncomeAmount.toString())
    setGrowthRate(
      (inc.clientIncomeAnnualGrowthRate * 100).toFixed(2).toString()
    )

    setIncome405Type(inc.clientIncome405Type || 0)
    setIncome406Type(inc.clientIncome406Type || 0)
    setIncome408Type(inc.clientIncome408Type || 0)
  }

  const handleCancelEdit = () => {
    setEditMode(false)
    setEditingIncome(null)
    setType(0)
    setIncomeName("")
    setFrequency(1)
    setAmount("")
    setGrowthRate("")
    setIncome405Type(0)
    setIncome406Type(0)
    setIncome408Type(0)
  }

  const handleBack = () => {
    // Navigate back to client info or whichever page
    navigate(`/client-info/`)
  }

  const handleNext = () => {
    // Go to the next page (client-expense, etc.)
    navigate(`/client-expense/`)
  }

  return (
    <div className="flex flex-col min-h-screen font-ibm">
      <Header />
      <div className="flex flex-1">
        <CfpClientSidePanel />
        <div className="flex-1 p-8 space-y-8">
          {/* Steps at the top */}
          <div className="flex items-center justify-center space-x-8 mb-8">
            {/* Step 1 */}
            <button
              onClick={() => navigate(`/client-info/`)}
              className="flex flex-col items-center focus:outline-none text-gray-400"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <span className="font-bold mt-1">ข้อมูลส่วนตัว</span>
            </button>
            <div className="h-px bg-gray-300 w-24"></div>

            {/* Step 2 */}
            <button
              onClick={() => navigate(`/client-income/`)}
              className="flex flex-col items-center focus:outline-none"
            >
              <div className="w-10 h-10 bg-tfpa_gold text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <span className="font-bold text-tfpa_blue mt-1">รายได้</span>
            </button>
            <div className="h-px bg-gray-300 w-24"></div>

            {/* Step 3 */}
            <button
              onClick={() => navigate(`/client-expense/`)}
              className="flex flex-col items-center focus:outline-none text-gray-400"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <span className="font-bold mt-1">รายจ่าย</span>
            </button>
            <div className="h-px bg-gray-300 w-24"></div>

            {/* Step 4 */}
            <button
              onClick={() => navigate(`/client-asset/`)}
              className="flex flex-col items-center focus:outline-none text-gray-400"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <span className="font-bold mt-1">สินทรัพย์</span>
            </button>
            <div className="h-px bg-gray-300 w-24"></div>

            {/* Step 5 */}
            <button
              onClick={() => navigate(`/client-debt/`)}
              className="flex flex-col items-center focus:outline-none text-gray-400"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <span className="font-bold mt-1">หนี้สิน</span>
            </button>
          </div>

          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <h3 className="text-tfpa_blue font-bold text-lg mb-4">2. รายได้</h3>
            <div className="space-y-4">
              {/* Type of income */}
              <div>
                <label className="block text-tfpa_blue font-bold mb-2">
                  ประเภทรายได้
                </label>
                <select
                  value={type}
                  onChange={(e) => {
                    const selectedType = parseInt(e.target.value, 10)
                    setType(selectedType)
                    // Reset any sub-type if not 40(5), 40(6), or 40(8)
                    if (selectedType !== 5) {
                      setIncome405Type(0)
                    }
                    if (selectedType !== 6) {
                      setIncome406Type(0)
                    }
                    if (selectedType !== 8) {
                      setIncome408Type(0)
                    }
                  }}
                  className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                >
                  <option value={0}>เลือก</option>
                  {Object.entries(incomeTypes).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              {/* 40(5) subtype dropdown */}
              {type === 5 && (
                <div>
                  <label className="block text-tfpa_blue font-bold mb-2">
                    ประเภท 40(5)
                  </label>
                  <select
                    value={income405Type}
                    onChange={(e) =>
                      setIncome405Type(parseInt(e.target.value, 10))
                    }
                    className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                  >
                    <option value={0}>เลือก</option>
                    {Object.entries(income405SubTypes).map(([key, sub]) => (
                      <option key={key} value={key}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* 40(6) subtype dropdown */}
              {type === 6 && (
                <div>
                  <label className="block text-tfpa_blue font-bold mb-2">
                    ประเภท 40(6)
                  </label>
                  <select
                    value={income406Type}
                    onChange={(e) =>
                      setIncome406Type(parseInt(e.target.value, 10))
                    }
                    className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                  >
                    <option value={0}>เลือก</option>
                    {Object.entries(income406SubTypes).map(([key, sub]) => (
                      <option key={key} value={key}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* 40(8) subtype dropdown + details button (beside the label) */}
              {type === 8 && (
                <div>
                  {/* "ประเภท 40(8)" label and a details button just a small space apart */}
                  <label className="text-tfpa_blue font-bold mb-2 inline-flex items-center">
                    ประเภท 40(8)
                    <button
                      type="button"
                      onClick={() => setShow408Details(true)}
                      className="ml-2 bg-tfpa_blue hover:bg-tfpa_blue_hover text-white px-2 py-1 text-xs rounded-xl font-ibm"
                    >
                      รายละเอียด
                    </button>
                  </label>
                  <select
                    value={income408Type}
                    onChange={(e) =>
                      setIncome408Type(parseInt(e.target.value, 10))
                    }
                    className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                  >
                    <option value={0}>เลือก</option>
                    {Object.entries(income408SubTypes).map(([key, sub]) => (
                      <option key={key} value={key}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Income name */}
              <div>
                <label className="block text-tfpa_blue font-bold mb-2">
                  ชื่อรายได้
                </label>
                <input
                  type="text"
                  value={incomeName}
                  onChange={(e) => setIncomeName(e.target.value)}
                  className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                />
              </div>

              {/* Frequency */}
              <div className="mb-2 text-tfpa_blue font-bold">ความถี่</div>
              <div className="flex space-x-4">
                {Object.entries(frequencyTypes).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        frequency === parseInt(key, 10)
                          ? "bg-tfpa_blue"
                          : "border border-tfpa_blue"
                      } cursor-pointer`}
                      onClick={() => setFrequency(parseInt(key, 10))}
                    ></div>
                    <span>{label}</span>
                  </div>
                ))}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-tfpa_blue font-bold mb-2">
                  จำนวน (บาท)
                </label>
                <input
                  type="number"
                  value={amount}
                  onWheel={(e) => e.target.blur()}
                  onChange={(e) => setAmount(e.target.value)}
                  className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                />
              </div>

              {/* Growth rate */}
              <div>
                <label className="block text-tfpa_blue font-bold mb-2">
                  อัตราการเติบโต (%)
                </label>
                <input
                  type="number"
                  value={growthRate}
                  onWheel={(e) => e.target.blur()}
                  onChange={(e) => setGrowthRate(e.target.value)}
                  className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                {editMode ? (
                  <>
                    <button
                      onClick={handleCreateOrUpdateIncome}
                      className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded font-ibm font-bold"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-300 hover:bg-gray-400 text-tfpa_blue px-4 py-2 rounded font-ibm font-bold"
                    >
                      ยกเลิก
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleCreateOrUpdateIncome}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-ibm font-bold"
                  >
                    เพิ่ม
                  </button>
                )}
              </div>
            </div>

            {/* Existing Incomes Table */}
            <h3 className="text-tfpa_blue font-bold text-lg mt-4">
              รายได้ที่มีอยู่
            </h3>
            <table className="min-w-full bg-white border border-gray-300 mt-4 mb-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                    ประเภทรายได้
                  </th>
                  <th className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                    ประเภทย่อย
                  </th>
                  <th className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                    ชื่อรายได้
                  </th>
                  <th className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                    ความถี่
                  </th>
                  <th className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                    จำนวน (บาท)
                  </th>
                  <th className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                    อัตราการเติบโต (%)
                  </th>
                  <th className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody>
                {incomes.map((inc) => (
                  <tr key={`${inc.clientUuid}-${inc.clientIncomeName}`}>
                    <td className="py-2 px-4 border">
                      {incomeTypes[inc.clientIncomeType] || "ไม่ระบุ"}
                    </td>
                    <td className="py-2 px-4 border">
                      {inc.clientIncomeType === 5
                        ? income405SubTypes[inc.clientIncome405Type] || "-"
                        : inc.clientIncomeType === 6
                        ? income406SubTypes[inc.clientIncome406Type] || "-"
                        : inc.clientIncomeType === 8
                        ? income408SubTypes[inc.clientIncome408Type] || "-"
                        : "-"}
                    </td>
                    <td className="py-2 px-4 border">{inc.clientIncomeName}</td>
                    <td className="py-2 px-4 border">
                      {frequencyTypes[inc.clientIncomeFrequency] || "ไม่ระบุ"}
                    </td>
                    <td className="py-2 px-4 border text-right">
                      {inc.clientIncomeAmount.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border text-right">
                      {(inc.clientIncomeAnnualGrowthRate * 100).toFixed(2)}%
                    </td>
                    <td className="py-2 px-4 border">
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleEdit(inc)}
                          className="bg-tfpa_blue hover:bg-tfpa_blue_hover text-white px-4 py-1 rounded font-ibm"
                        >
                          แก้ไข
                        </button>
                        <button
                          onClick={() => handleDeleteIncome(inc)}
                          className="bg-red-500 hover:bg-red-700 text-white px-4 py-1 rounded font-ibm"
                        >
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {incomes.length === 0 && (
                  <tr>
                    <td className="py-2 px-4 border text-center" colSpan="9">
                      ไม่มีรายได้ที่บันทึกไว้
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="bg-gray-300 hover:bg-gray-400 text-tfpa_blue px-4 py-2 rounded font-ibm font-bold"
              >
                กลับ
              </button>
              <button
                onClick={handleNext}
                className="bg-tfpa_blue hover:bg-tfpa_blue_hover text-white px-4 py-2 rounded font-ibm font-bold"
              >
                ถัดไป
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />

      {/* 40(8) Details Model */}
      {show408Details && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white w-11/12 md:w-3/4 lg:w-1/2 p-6 rounded shadow-lg overflow-auto max-h-[80vh]">
            <h2 className="text-xl font-bold text-tfpa_blue mb-4">
              รายละเอียดเงินได้พึงประเมิน 40(8) และ
              อัตราการหักค่าใช้จ่ายเป็นการเหมาสำหรับภาษี
            </h2>
            <p className="text-sm text-gray-700 mb-4 leading-6">
              <strong>ประเภทที่ (1)</strong> – การแสดงของนักแสดงละคร ภาพยนตร์
              วิทยุหรือโทรทัศน์ นักร้อง นักดนตรี นักกีฬาอาชีพ
              หรือนักแสดงเพื่อความบันเทิงใด ๆ
              <br />
              &emsp;– (ก) สำหรับเงินได้ส่วนที่ไม่เกิน 300,000 บาท หักค่าใช้จ่าย
              60%
              <br />
              &emsp;– (ข) สำหรับเงินได้ส่วนที่เกิน 300,000 บาท หักค่าใช้จ่าย 40%
              <br />
              &emsp;โดยการหักค่าใช้จ่ายตาม (ก) และ (ข) รวมกันต้องไม่เกิน 600,000
              บาท
              <br />
              <strong>ประเภทที่ (2)</strong> –
              การขายที่ดินเงินผ่อนหรือให้เช่าซื้อที่ดิน &nbsp;หักค่าใช้จ่าย 60%
              <br />
              <strong>ประเภทที่ (3)</strong> – การเก็บค่าต๋ง
              หรือค่าเกมจากการพนัน การแข่งขันหรือการเล่นต่าง ๆ
              &nbsp;หักค่าใช้จ่าย 60%
              <br />
              <strong>ประเภทที่ (4)</strong> – การถ่าย ล้าง อัด
              หรือขยายรูปภาพยนตร์ รวมทั้งการขายส่วนประกอบ &nbsp;หักค่าใช้จ่าย
              60%
              <br />
              <strong>ประเภทที่ (5)</strong> – การทำกิจการคานเรือ อู่เรือ
              หรือซ่อมเรือที่มิใช่ซ่อมเครื่องจักร เครื่องกล &nbsp;หักค่าใช้จ่าย
              60%
              <br />
              <strong>ประเภทที่ (6)</strong> – การทำรองเท้า
              และเครื่องหนังแท้หรือหนังเทียม รวมทั้งการขายส่วนประกอบ
              &nbsp;หักค่าใช้จ่าย 60%
              <br />
              <strong>ประเภทที่ (7)</strong> – การตัด เย็บ ถัก ปักเสื้อผ้า
              หรือสิ่งอื่น ๆ รวมทั้งการขายส่วนประกอบ &nbsp;หักค่าใช้จ่าย 60%
              <br />
              <strong>ประเภทที่ (8)</strong> – การทำ ตกแต่ง
              หรือซ่อมแซมเครื่องเรือน รวมทั้งการขายส่วนประกอบ
              &nbsp;หักค่าใช้จ่าย 60%
              <br />
              <strong>ประเภทที่ (9)</strong> – การทำกิจการโรงแรม หรือภัตตาคาร
              หรือการปรุงอาหารหรือเครื่องดื่มจำหน่าย &nbsp;หักค่าใช้จ่าย 60%
              <br />
              <strong>ประเภทที่ (10)</strong> – การดัด ตัด แต่งผม
              หรือตกแต่งร่างกาย &nbsp;หักค่าใช้จ่าย 60%
              <br />
              <strong>ประเภทที่ (11)</strong> – การทำสบู่ แชมพู หรือเครื่องสำอาง
              &nbsp;หักค่าใช้จ่าย 60%
              <br />
              <strong>ประเภทที่ (12)</strong> – การทำวรรณกรรม
              &nbsp;หักค่าใช้จ่าย 60%
              <br />
              <strong>ประเภทที่ (13)</strong> – การค้าเครื่องเงิน ทอง นาก เพชร
              พลอย หรืออัญมณีอื่น ๆ รวมทั้งการขายส่วนประกอบ &nbsp;หักค่าใช้จ่าย
              60%
              <br />
              <strong>ประเภทที่ (14)</strong> – การทำกิจการสถานพยาบาล
              ตามกฎหมายว่าด้วยสถานพยาบาลเฉพาะ ที่มีเตียงรับผู้ป่วยค้างคืน
              รวมทั้งการรักษาพยาบาลและการจำหน่ายยา &nbsp;หักค่าใช้จ่าย 60%
              <br />
              <strong>ประเภทที่ (15)</strong> – การโม่หรือย่อยหิน
              &nbsp;หักค่าใช้จ่าย 60%
              <br />
              <strong>ประเภทที่ (16)</strong> – การทำป่าไม้ สวนยาง หรือไม้ยืนต้น
              &nbsp;หักค่าใช้จ่าย 60%
              <br />
              <strong>ประเภทที่ (17)</strong> – การขนส่ง หรือรับจ้างด้วยยานพาหนะ
              &nbsp;หักค่าใช้จ่าย 60%
              <br />
              <strong>ประเภทที่ (18)</strong> – การทำบล็อก และตรา
              การรับพิมพ์หนังสือเย็บเล่มจด เอกสาร รวมทั้งการขายส่วนประกอบ
              &nbsp;หักค่าใช้จ่าย 60%
              <br />
              <strong>ประเภทที่ (19)</strong> – การทำเหมืองแร่
              &nbsp;หักค่าใช้จ่าย 60%
              <br />
              <strong>ประเภทที่ (20)</strong> –
              การทำเครื่องดื่มตามกฎหมายว่าด้วยภาษีสรรพสามิต &nbsp;หักค่าใช้จ่าย
              60%
              <br />
              <strong>ประเภทที่ (21)</strong> – การทำเครื่องกระเบื้อง
              เครื่องเคลือบ เครื่องซีเมนต์ หรือดินเผา &nbsp;หักค่าใช้จ่าย 60%
              <br />
              <strong>ประเภทที่ (22)</strong> – การทำหรือจำหน่ายกระแสไฟฟ้า
              &nbsp;หักค่าใช้จ่าย 60%
              <br />
              <strong>ประเภทที่ (23)</strong> – การทำน้ำแข็ง &nbsp;หักค่าใช้จ่าย
              60%
              <br />
              <strong>ประเภทที่ (24)</strong> – การทำกาว แป้งเปียก
              หรือสิ่งที่มีลักษณะทำนองเดียวกัน &nbsp;หักค่าใช้จ่าย 60%
              <br />
              <strong>ประเภทที่ (25)</strong> – การทำลูกโป่ง เครื่องแก้ว
              เครื่องพลาสติก หรือเครื่องยางสำเร็จรูป &nbsp;หักค่าใช้จ่าย 60%
              <br />
              <strong>ประเภทที่ (26)</strong> – การซักรีด หรือย้อมสี
              &nbsp;หักค่าใช้จ่าย 60%
              <br />
              <strong>ประเภทที่ (27)</strong> –
              การขายของนอกจากที่ระบุไว้ในข้ออื่น ซึ่งผู้ขายมิได้เป็นผู้ผลิต
              &nbsp;หักค่าใช้จ่าย 60%
              <br />
              <strong>ประเภทที่ (28)</strong> –
              รางวัลที่เจ้าของม้าได้จากการส่งม้าเข้าแข่ง &nbsp;หักค่าใช้จ่าย 60%
              <br />
              <strong>ประเภทที่ (29)</strong> – การรับสินไถ่ทรัพย์สินที่ขายฝาก
              หรือการได้กรรมสิทธิ์ในทรัพย์สินโดยเด็ดขาดจากการขายฝาก
              &nbsp;หักค่าใช้จ่าย 60%
              <br />
              <strong>ประเภทที่ (30)</strong> – การรมยาง การทำยางแผ่น
              หรือยางอย่างอื่นที่มิใช่ยางสำเร็จรูป &nbsp;หักค่าใช้จ่าย 60%
              <br />
              <strong>ประเภทที่ (31)</strong> – การฟอกหนัง &nbsp;หักค่าใช้จ่าย
              60%
              <br />
              <strong>ประเภทที่ (32)</strong> – การทำน้ำตาล
              หรือน้ำเหลืองของน้ำตาล &nbsp;หักค่าใช้จ่าย 60%
              <br />
              <strong>ประเภทที่ (33)</strong> – การจับสัตว์น้ำ
              &nbsp;หักค่าใช้จ่าย 60%
              <br />
              <strong>ประเภทที่ (34)</strong> – การทำกิจการโรงเลื่อย
              &nbsp;หักค่าใช้จ่าย 60%
              <br />
              <strong>ประเภทที่ (35)</strong> – การกลั่น หรือหีบน้ำมัน
              &nbsp;หักค่าใช้จ่าย 60%
              <br />
              <strong>ประเภทที่ (36)</strong> – การให้เช่าซื้อสังหาริมทรัพย์
              ที่ไม่เข้าลักษณะตามมาตรา 40 (5) แห่งประมวลรัษฎากร
              &nbsp;หักค่าใช้จ่าย 60%
              <br />
              <strong>ประเภทที่ (37)</strong> – การทำกิจการโรงสีข้าว
              &nbsp;หักค่าใช้จ่าย 60%
              <br />
              <strong>ประเภทที่ (38)</strong> –
              การทำเกษตรกรรมประเภทไม้ล้มลุกและธัญชาติ &nbsp;หักค่าใช้จ่าย 60%
              <br />
              <strong>ประเภทที่ (39)</strong> – การอบหรือบ่มใบยาสูบ
              &nbsp;หักค่าใช้จ่าย 60%
              <br />
              <strong>ประเภทที่ (40)</strong> – การเลี้ยงสัตว์ทุกชนิด
              รวมทั้งการขายวัตถุพลอยได้ &nbsp;หักค่าใช้จ่าย 60%
              <br />
              <strong>ประเภทที่ (41)</strong> – การฆ่าสัตว์จำหน่าย
              รวมทั้งการขายวัตถุพลอยได้ &nbsp;หักค่าใช้จ่าย 60%
              <br />
              <strong>ประเภทที่ (42)</strong> – การทำนาเกลือ &nbsp;หักค่าใช้จ่าย
              60%
              <br />
              <strong>ประเภทที่ (43)</strong> –
              การขายเรือกำปั่นหรือเรือมีระวางตั้งแต่ 6 ตันขึ้นไป เรือกลไฟ
              หรือเรือยนต์มีระวางตั้งแต่ 5 ตันขึ้นไป หรือแพ &nbsp;หักค่าใช้จ่าย
              60%
              <br />
              <strong>
                – เงินได้ประเภทที่ไม่ได้ระบุ ให้หักค่าใช้จ่ายจริง
                ตามความจำเป็นและสมควร
              </strong>
            </p>

            <div className="flex justify-end">
              <button
                className="bg-tfpa_blue hover:bg-tfpa_blue_hover text-white px-4 py-2 rounded-xl"
                onClick={() => setShow408Details(false)}
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
