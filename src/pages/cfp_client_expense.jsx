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

export default function CFPClientExpensePage() {
  const { clientId, cfpId } = useParams()
  const navigate = useNavigate()

  const [expenses, setExpenses] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)

  const [type, setType] = useState("เลือก")
  const [expenseName, setExpenseName] = useState("")
  const [frequency, setFrequency] = useState("ทุกเดือน") // default
  const [amount, setAmount] = useState("")
  const [growthRate, setGrowthRate] = useState("")
  const [debtExpense, setDebtExpense] = useState(false)
  const [nonMortgageDebtExpense, setNonMortgageDebtExpense] = useState(false)
  const [savingExpense, setSavingExpense] = useState(false)

  const expenseTypes = [
    "รายจ่ายคงที่",
    "รายจ่ายผันแปร",
    "รายจ่ายเพื่อการออม",
    "รายจ่ายอื่นๆ",
  ]

  const frequencies = [
    { label: "ทุกเดือน", value: "ทุกเดือน" },
    { label: "ทุกปี", value: "ทุกปี" },
    { label: "จ่ายเป็นก้อน", value: "จ่ายเป็นก้อน" },
  ]

  useEffect(() => {
    fetchExpenses()
  }, [clientId])

  const fetchExpenses = async () => {
    const res = await fetch(
      `http://localhost:8080/api/clientexpense/${clientId}`
    )
    if (!res.ok) {
      console.error("Failed to fetch expenses")
      return
    }
    const data = await res.json()
    setExpenses(data)
  }

  const handleCreateOrUpdateExpense = async () => {
    const newExpense = {
      id: {
        clientId: parseInt(clientId),
        clientExpenseName: expenseName,
      },
      clientExpenseType: type,
      clientExpenseFrequency: frequency,
      clientExpenseAmount: parseFloat(amount),
      clientExpenseAnnualGrowthRate: parseFloat(growthRate) / 100,
      clientDebtExpense: debtExpense,
      clientNonMortgageDebtExpense: nonMortgageDebtExpense,
      clientSavingExpense: savingExpense,
    }

    let url = `http://localhost:8080/api/clientexpense`
    let method = "POST"
    if (editMode && editingExpense) {
      url = `http://localhost:8080/api/clientexpense/${clientId}/${editingExpense.id.clientExpenseName}`
      method = "PUT"
    }

    const res = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newExpense),
    })

    if (!res.ok) {
      console.error("Failed to create/update expense")
      return
    }

    await res.json()

    // Refresh list
    await fetchExpenses()

    // Reset fields
    resetFields()
  }

  const handleDeleteExpense = async (exp) => {
    const { clientId: cId, clientExpenseName } = exp.id
    const res = await fetch(
      `http://localhost:8080/api/clientexpense/${cId}/${clientExpenseName}`,
      { method: "DELETE" }
    )
    if (!res.ok) {
      console.error("Failed to delete expense")
      return
    }

    // Refresh list
    await fetchExpenses()
  }

  const handleEdit = (exp) => {
    setEditMode(true)
    setEditingExpense(exp)
    setType(exp.clientExpenseType)
    setExpenseName(exp.id.clientExpenseName)
    setFrequency(exp.clientExpenseFrequency)
    setAmount(exp.clientExpenseAmount.toString())
    setGrowthRate((exp.clientExpenseAnnualGrowthRate * 100).toString())
    setDebtExpense(exp.clientDebtExpense)
    setNonMortgageDebtExpense(exp.clientNonMortgageDebtExpense)
    setSavingExpense(exp.clientSavingExpense)
  }

  const handleCancelEdit = () => {
    resetFields()
  }

  const resetFields = () => {
    setEditMode(false)
    setEditingExpense(null)
    setType("เลือก")
    setExpenseName("")
    setFrequency("ทุกเดือน")
    setAmount("")
    setGrowthRate("")
    setDebtExpense(false)
    setNonMortgageDebtExpense(false)
    setSavingExpense(false)
  }

  const handleBack = () => {
    navigate(`/${cfpId}/client-income/${clientId}`)
  }

  const handleNext = () => {
    // Navigate to next page (e.g. cfp client asset page)
    navigate(`/${cfpId}/client-asset/${clientId}`)
  }

  const handleTypeChange = (newType) => {
    setType(newType)
    // Set defaults based on type
    if (newType === "รายจ่ายคงที่") {
      // savingExpense = false, others unchanged (assume default false)
      setDebtExpense(false)
      setNonMortgageDebtExpense(false)
      setSavingExpense(false)
    } else if (newType === "รายจ่ายผันแปร") {
      // all three default to no
      setDebtExpense(false)
      setNonMortgageDebtExpense(false)
      setSavingExpense(false)
    } else if (newType === "รายจ่ายเพื่อการออม") {
      // debtExpense = no, nonMortgageDebtExpense = no, savingExpense = yes
      setDebtExpense(false)
      setNonMortgageDebtExpense(false)
      setSavingExpense(true)
    } else if (newType === "รายจ่ายอื่นๆ") {
      // savingExpense = no, (assume debtExpense and nonMortgageDebtExpense remain no)
      setDebtExpense(false)
      setNonMortgageDebtExpense(false)
      setSavingExpense(false)
    }
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
              onClick={() => navigate(`/${cfpId}/client-info/${clientId}`)}
              className="flex flex-col items-center focus:outline-none text-gray-400"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <span className="font-bold">ข้อมูลส่วนตัว</span>
            </button>
            <div className="h-px bg-gray-300 w-24"></div>
            <button
              onClick={() => navigate(`/${cfpId}/client-income/${clientId}`)}
              className="flex flex-col items-center focus:outline-none text-gray-400"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <span className="font-bold">รายได้</span>
            </button>
            <div className="h-px bg-gray-300 w-24"></div>
            <button
              onClick={() => navigate(`/${cfpId}/client-expense/${clientId}`)}
              className="flex flex-col items-center focus:outline-none text-gray-400"
            >
              <div className="w-10 h-10 bg-tfpa_gold text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <span className="font-bold text-tfpa_blue">รายจ่าย</span>
            </button>
            <div className="h-px bg-gray-300 w-24"></div>
            <button
              onClick={() => navigate(`/${cfpId}/client-asset/${clientId}`)}
              className="flex flex-col items-center focus:outline-none text-gray-400"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <span className="font-bold">สินทรัพย์</span>
            </button>
            <div className="h-px bg-gray-300 w-24"></div>
            <button
              onClick={() => navigate(`/${cfpId}/client-debt/${clientId}`)}
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
            <h3 className="text-tfpa_blue font-bold text-lg mb-4">
              3. รายจ่าย
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-tfpa_blue font-bold mb-2">
                  ประเภทรายจ่าย
                </label>
                <select
                  value={type}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                >
                  <option value="เลือก">เลือก</option>
                  {expenseTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-tfpa_blue font-bold mb-2">
                  ชื่อรายจ่าย
                </label>
                <input
                  type="text"
                  value={expenseName}
                  onChange={(e) => setExpenseName(e.target.value)}
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

              <div className="mt-4">
                <label className="block text-tfpa_blue font-bold mb-2">
                  เป็นเงินชำระคืนหนี้สิน?
                </label>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        debtExpense ? "bg-tfpa_blue" : "border border-tfpa_blue"
                      } cursor-pointer`}
                      onClick={() => setDebtExpense(true)}
                    ></div>
                    <span>ใช่</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        !debtExpense
                          ? "bg-tfpa_blue"
                          : "border border-tfpa_blue"
                      } cursor-pointer`}
                      onClick={() => setDebtExpense(false)}
                    ></div>
                    <span>ไม่ใช่</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-tfpa_blue font-bold mb-2">
                  เป็นเงินชำระคืนหนี้ไม่รวมจดจำนอง?
                </label>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        nonMortgageDebtExpense
                          ? "bg-tfpa_blue"
                          : "border border-tfpa_blue"
                      } cursor-pointer`}
                      onClick={() => setNonMortgageDebtExpense(true)}
                    ></div>
                    <span>ใช่</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        !nonMortgageDebtExpense
                          ? "bg-tfpa_blue"
                          : "border border-tfpa_blue"
                      } cursor-pointer`}
                      onClick={() => setNonMortgageDebtExpense(false)}
                    ></div>
                    <span>ไม่ใช่</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-tfpa_blue font-bold mb-2">
                  เป็นรายจ่ายเพื่อการออม?
                </label>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        savingExpense
                          ? "bg-tfpa_blue"
                          : "border border-tfpa_blue"
                      } cursor-pointer`}
                      onClick={() => setSavingExpense(true)}
                    ></div>
                    <span>ใช่</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        !savingExpense
                          ? "bg-tfpa_blue"
                          : "border border-tfpa_blue"
                      } cursor-pointer`}
                      onClick={() => setSavingExpense(false)}
                    ></div>
                    <span>ไม่ใช่</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 mt-4 mb-4">
                {editMode ? (
                  <>
                    <button
                      onClick={handleCreateOrUpdateExpense}
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
                    onClick={handleCreateOrUpdateExpense}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-ibm font-bold"
                  >
                    เพิ่ม
                  </button>
                )}
              </div>
            </div>

            <h3 className="text-tfpa_blue font-bold text-lg mt-4">
              รายจ่ายที่มีอยู่
            </h3>
            <table className="min-w-full bg-white border border-gray-300 mt-4 mb-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                    ประเภทค่าใช้จ่าย
                  </th>
                  <th className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                    ชื่อค่าใช้จ่าย
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
                {expenses.map((exp) => (
                  <tr key={`${exp.id.clientId}-${exp.id.clientExpenseName}`}>
                    <td className="py-2 px-4 border">
                      {exp.clientExpenseType}
                    </td>
                    <td className="py-2 px-4 border">
                      {exp.id.clientExpenseName}
                    </td>
                    <td className="py-2 px-4 border">
                      {exp.clientExpenseFrequency}
                    </td>
                    <td className="py-2 px-4 border text-right">
                      {exp.clientExpenseAmount.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border text-right">
                      {(exp.clientExpenseAnnualGrowthRate * 100).toFixed(2)}%
                    </td>
                    <td className="py-2 px-4 border">
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleEdit(exp)}
                          className="bg-tfpa_blue hover:bg-tfpa_blue_hover text-white px-4 py-1 rounded font-ibm"
                        >
                          แก้ไข
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(exp)}
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
