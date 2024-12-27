import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
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

  const incomeTypes = [
    "เงินเดือน",
    "รับจ้างทำงาน",
    "ค่าลิขสิทธิ์ สิทธิบัตร",
    "ดอกเบี้ย เงินปันผล",
    "ค่าเช่าทรัพย์สิน",
    "วิชาชีพอิสระ",
    "รับเหมาก่อสร้าง",
    "รายได้อื่นๆ",
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
    const res = await fetch(
      `http://localhost:8080/api/clientincome/${clientId}`
    )
    if (!res.ok) {
      console.error("Failed to fetch incomes")
      return
    }
    const data = await res.json()
    setIncomes(data)
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
    }

    let url = `http://localhost:8080/api/clientincome`
    let method = "POST"
    if (editMode && editingIncome) {
      url = `http://localhost:8080/api/clientincome/${clientId}/${editingIncome.id.clientIncomeName}`
      method = "PUT"
    }

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
    setEditMode(false)
    setEditingIncome(null)
  }

  const handleDeleteIncome = async (inc) => {
    const { clientId: cId, clientIncomeName } = inc.id
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
  }

  const handleEdit = (inc) => {
    setEditMode(true)
    setEditingIncome(inc)
    setType(inc.clientIncomeType)
    setIncomeName(inc.id.clientIncomeName)
    setFrequency(inc.clientIncomeFrequency)
    setAmount(inc.clientIncomeAmount.toString())
    setGrowthRate((inc.clientIncomeAnnualGrowthRate * 100).toString())
  }

  const handleCancelEdit = () => {
    setEditMode(false)
    setEditingIncome(null)
    setType("เลือก")
    setIncomeName("")
    setFrequency("ทุกเดือน")
    setAmount("")
    setGrowthRate("")
  }

  const handleBack = () => {
    navigate(`/client-info/`)
  }

  const handleNext = () => {
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
            <button
              onClick={() => navigate(`/client-income/`)}
              className="flex flex-col items-center focus:outline-none text-gray-400"
            >
              <div className="w-10 h-10 bg-tfpa_gold text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <span className="font-bold text-tfpa_blue">รายได้</span>
            </button>
            <div className="h-px bg-gray-300 w-24"></div>
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
              <div>
                <label className="block text-tfpa_blue font-bold mb-2">
                  ประเภทรายได้
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
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
                    ประเภทการลงทุน
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
