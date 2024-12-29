import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/header"
import Footer from "../components/footer"
import ClientBluePanel from "../components/clientBluePanel"
import { motion } from "framer-motion"

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 1 },
}

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.3,
}

export default function CFPClientIncomePage() {
  // cfpId and clientId from localStorage
  const [cfpId] = useState(Number(localStorage.getItem("cfpId")) || "")
  const [clientId] = useState(Number(localStorage.getItem("clientId")) || "")
  const navigate = useNavigate()

  const [incomes, setIncomes] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [editingIncome, setEditingIncome] = useState(null)

  const [type, setType] = useState("เลือก")
  const [incomeName, setIncomeName] = useState("")
  const [frequency, setFrequency] = useState("ทุกเดือน") // default
  const [amount, setAmount] = useState("")
  const [growthRate, setGrowthRate] = useState("")
  const [income405Type, setIncome405Type] = useState("") // For 40(5)
  const [income406Type, setIncome406Type] = useState("") // For 40(6)

  // Income types
  const incomeTypes = [
    "40(1) เงินเดือน",
    "40(2) รับจ้างทำงาน",
    "40(3) ค่าลิขสิทธิ์ สิทธิบัตร",
    "40(4) ดอกเบี้ย เงินปันผล",
    "40(5) ค่าเช่าทรัพย์สิน",
    "40(6) วิชาชีพอิสระ",
    "40(7) รับเหมาก่อสร้าง",
    "40(8) รายได้อื่นๆ",
  ]

  // 40(5) subtypes
  const income405SubTypes = [
    "บ้าน/โรงเรือน/สิ่งปลูกสร้าง/แพ/ยานพาหนะ",
    "ที่ดินที่ใช้ในการเกษตร",
    "ที่ดินที่มิได้ใช้ในการเกษตร",
    "ทรัพย์สินอื่นๆ",
  ]

  // 40(6) subtypes
  const income406SubTypes = [
    "การประกอบโรคศิลปะ",
    "กฎหมาย/วิศวกรรม/สถาปัตยกรรม/การบัญชี/ประณีตศิลปกรรม",
  ]

  const frequencies = [
    { label: "ทุกเดือน", value: "ทุกเดือน" },
    { label: "ทุกปี", value: "ทุกปี" },
    { label: "ได้เป็นก้อน", value: "ได้เป็นก้อน" },
  ]

  useEffect(() => {
    fetchIncomes()
  }, [clientId])

  const fetchIncomes = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/clientincome/${clientId}`
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
    const newIncome = {
      id: {
        clientId: parseInt(clientId),
        clientIncomeName: incomeName,
      },
      clientIncomeType: type,
      clientIncomeFrequency: frequency,
      clientIncomeAmount: parseFloat(amount),
      clientIncomeAnnualGrowthRate: parseFloat(growthRate) / 100,

      // Provide the sub-type:
      clientIncome405Type: "",
      clientIncome406Type: "",
    }

    // If user picks 40(5), set clientIncome405Type
    if (type.startsWith("40(5)")) {
      newIncome.clientIncome405Type = income405Type || ""
    }

    // If user picks 40(6), set clientIncome406Type
    if (type.startsWith("40(6)")) {
      newIncome.clientIncome406Type = income406Type || ""
    }

    let url = `http://localhost:8080/api/clientincome`
    let method = "POST"
    if (editMode && editingIncome) {
      url = `http://localhost:8080/api/clientincome/${clientId}/${editingIncome.id.clientIncomeName}`
      method = "PUT"
    }

    try {
      const res = await fetch(url, {
        method: method,
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
      setType("เลือก")
      setIncomeName("")
      setFrequency("ทุกเดือน")
      setAmount("")
      setGrowthRate("")
      setIncome405Type("")
      setIncome406Type("")
      setEditMode(false)
      setEditingIncome(null)
    } catch (error) {
      console.error("Error create/update income:", error)
    }
  }

  const handleDeleteIncome = async (inc) => {
    const { clientId: cId, clientIncomeName } = inc.id
    try {
      const res = await fetch(
        `http://localhost:8080/api/clientincome/${cId}/${clientIncomeName}`,
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
    setIncomeName(inc.id.clientIncomeName)
    setFrequency(inc.clientIncomeFrequency)
    setAmount(inc.clientIncomeAmount.toString())
    setGrowthRate((inc.clientIncomeAnnualGrowthRate * 100).toString())

    // If the user previously set a 40(5) subtype or 40(6) subtype,
    // we load them for editing:
    setIncome405Type(inc.clientIncome405Type || "")
    setIncome406Type(inc.clientIncome406Type || "")
  }

  const handleCancelEdit = () => {
    setEditMode(false)
    setEditingIncome(null)
    setType("เลือก")
    setIncomeName("")
    setFrequency("ทุกเดือน")
    setAmount("")
    setGrowthRate("")
    setIncome405Type("")
    setIncome406Type("")
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
        <ClientBluePanel />
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
              <span className="font-bold">ข้อมูลส่วนตัว</span>
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
              <span className="font-bold text-tfpa_blue">รายได้</span>
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
              <span className="font-bold">รายจ่าย</span>
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
              <span className="font-bold">สินทรัพย์</span>
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
              <span className="font-bold">หนี้สิน</span>
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
                    setType(e.target.value)
                    // Reset any sub-type if not 40(5) or 40(6)
                    if (!e.target.value.startsWith("40(5)")) {
                      setIncome405Type("")
                    }
                    if (!e.target.value.startsWith("40(6)")) {
                      setIncome406Type("")
                    }
                  }}
                  className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                >
                  <option value="เลือก">เลือก</option>
                  {incomeTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* 40(5) subtype dropdown */}
              {type.startsWith("40(5)") && (
                <div>
                  <label className="block text-tfpa_blue font-bold mb-2">
                    ประเภท 40(5)
                  </label>
                  <select
                    value={income405Type}
                    onChange={(e) => setIncome405Type(e.target.value)}
                    className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                  >
                    <option value="">เลือก</option>
                    {income405SubTypes.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* 40(6) subtype dropdown */}
              {type.startsWith("40(6)") && (
                <div>
                  <label className="block text-tfpa_blue font-bold mb-2">
                    ประเภท 40(6)
                  </label>
                  <select
                    value={income406Type}
                    onChange={(e) => setIncome406Type(e.target.value)}
                    className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                  >
                    <option value="">เลือก</option>
                    {income406SubTypes.map((sub) => (
                      <option key={sub} value={sub}>
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
                {frequencies.map((f) => (
                  <div key={f.value} className="flex items-center space-x-2">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        frequency === f.value
                          ? "bg-tfpa_blue"
                          : "border border-tfpa_blue"
                      } cursor-pointer`}
                      onClick={() => setFrequency(f.value)}
                    ></div>
                    <span>{f.label}</span>
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
                  onChange={(e) => setGrowthRate(e.target.value)}
                  className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                />
              </div>

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
                  <tr key={`${inc.id.clientId}-${inc.id.clientIncomeName}`}>
                    <td className="py-2 px-4 border">{inc.clientIncomeType}</td>
                    <td className="py-2 px-4 border">
                      {/* If 40(5), show inc.clientIncome405Type, if 40(6), show inc.clientIncome406Type */}
                      {inc.clientIncomeType.startsWith("40(5)")
                        ? inc.clientIncome405Type
                        : inc.clientIncomeType.startsWith("40(6)")
                        ? inc.clientIncome406Type
                        : "-"}
                    </td>
                    <td className="py-2 px-4 border">
                      {inc.id.clientIncomeName}
                    </td>
                    <td className="py-2 px-4 border">
                      {inc.clientIncomeFrequency}
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
              </tbody>
            </table>

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
    </div>
  )
}
