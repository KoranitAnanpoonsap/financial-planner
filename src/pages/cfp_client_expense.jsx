import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/cfpHeader"
import Footer from "../components/footer"
import CfpClientSidePanel from "../components/cfpClientSidePanel"
import { motion } from "framer-motion"

// Define mappings for expense types and frequencies
const expenseTypes = [
  { value: 1, label: "รายจ่ายคงที่" },
  { value: 2, label: "รายจ่ายผันแปร" },
  { value: 3, label: "รายจ่ายเพื่อการออม" },
  { value: 4, label: "รายจ่ายอื่นๆ" },
]

const frequencies = [
  { value: 1, label: "ทุกเดือน" },
  { value: 2, label: "ทุกปี" },
  { value: 3, label: "จ่ายเป็นก้อน" },
]

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

export default function CFPClientExpensePage() {
  const [clientUuid] = useState(localStorage.getItem("clientUuid") || "")
  const navigate = useNavigate()

  const [expenses, setExpenses] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)

  const [type, setType] = useState(0) // 0 represents "เลือก"
  const [expenseName, setExpenseName] = useState("")
  const [frequency, setFrequency] = useState(1) // 1 represents "ทุกเดือน"
  const [amount, setAmount] = useState("")
  const [growthRate, setGrowthRate] = useState("")
  const [debtExpense, setDebtExpense] = useState(false)
  const [nonMortgageDebtExpense, setNonMortgageDebtExpense] = useState(false)
  const [savingExpense, setSavingExpense] = useState(false)

  useEffect(() => {
    fetchExpenses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientUuid])

  const fetchExpenses = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_KEY}api/clientexpense/${clientUuid}`
      )
      if (!res.ok) {
        console.error("Failed to fetch expenses")
        return
      }
      const data = await res.json()
      setExpenses(data)
    } catch (error) {
      console.error("Error fetching expenses:", error)
    }
  }

  // Helper functions to get labels from values
  const getExpenseTypeLabel = (typeValue) => {
    const type = expenseTypes.find((t) => t.value === typeValue)
    return type ? type.label : "ไม่ระบุ"
  }

  const getFrequencyLabel = (frequencyValue) => {
    const freq = frequencies.find((f) => f.value === frequencyValue)
    return freq ? freq.label : "ไม่ระบุ"
  }

  const handleCreateOrUpdateExpense = async () => {
    const newExpense = {
      clientUuid: clientUuid,
      clientExpenseName: expenseName,
      clientExpenseType: type,
      clientExpenseFrequency: frequency,
      clientExpenseAmount: parseFloat(amount),
      clientExpenseAnnualGrowthRate: parseFloat(growthRate) / 100,
      clientDebtExpense: debtExpense,
      clientNonMortgageDebtExpense: nonMortgageDebtExpense,
      clientSavingExpense: savingExpense,
    }

    let url = `${import.meta.env.VITE_API_KEY}api/clientexpense`
    let method = "POST"

    if (editMode && editingExpense) {
      if (editingExpense.clientExpenseName !== expenseName) {
        // If the expense name is being updated, delete the old record and create a new one
        await fetch(
          `${import.meta.env.VITE_API_KEY}api/clientexpense/${clientUuid}/${
            editingExpense.clientExpenseName
          }`,
          { method: "DELETE" }
        )
      } else {
        url = `${import.meta.env.VITE_API_KEY}api/clientexpense/${clientUuid}/${
          editingExpense.clientExpenseName
        }`
        method = "PUT"
      }
    }

    try {
      const res = await fetch(url, {
        method,
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
    } catch (error) {
      console.error("Error create/update expense:", error)
    }
  }

  const handleDeleteExpense = async (exp) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_KEY}api/clientexpense/${clientUuid}/${
        exp.clientExpenseName
      }`,
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
    setExpenseName(exp.clientExpenseName)
    setFrequency(exp.clientExpenseFrequency)
    setAmount(exp.clientExpenseAmount.toString())
    setGrowthRate(
      (exp.clientExpenseAnnualGrowthRate * 100).toFixed(2).toString()
    )
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
    setType(0)
    setExpenseName("")
    setFrequency(1)
    setAmount("")
    setGrowthRate("")
    setDebtExpense(false)
    setNonMortgageDebtExpense(false)
    setSavingExpense(false)
  }

  const handleBack = () => {
    navigate(`/client-income/`)
  }

  const handleNext = () => {
    // Navigate to next page (e.g. cfp client asset page)
    navigate(`/client-asset/`)
  }

  const handleTypeChange = (newType) => {
    setType(newType)
    // Set defaults based on type
    if (newType === 1 || newType === 2 || newType === 4) {
      // For "รายจ่ายคงที่", "รายจ่ายผันแปร", "รายจ่ายอื่นๆ"
      setDebtExpense(false)
      setNonMortgageDebtExpense(false)
      setSavingExpense(false)
    } else if (newType === 3) {
      // For "รายจ่ายเพื่อการออม"
      setDebtExpense(false)
      setNonMortgageDebtExpense(false)
      setSavingExpense(true)
    }
  }

  return (
    <div className="flex flex-col min-h-screen font-ibm">
      <Header />
      <div className="flex flex-1">
        <CfpClientSidePanel />
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
              <span className="font-bold mt-1">ข้อมูลส่วนตัว</span>
            </button>
            <div className="h-px bg-gray-300 w-24"></div>
            <button
              onClick={() => navigate(`/client-income/`)}
              className="flex flex-col items-center focus:outline-none text-gray-400"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <span className="font-bold mt-1">รายได้</span>
            </button>
            <div className="h-px bg-gray-300 w-24"></div>
            <button
              onClick={() => navigate(`/client-expense/`)}
              className="flex flex-col items-center focus:outline-none text-gray-400"
            >
              <div className="w-10 h-10 bg-tfpa_gold text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <span className="font-bold text-tfpa_blue mt-1">รายจ่าย</span>
            </button>
            <div className="h-px bg-gray-300 w-24"></div>
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
            <h3 className="text-tfpa_blue font-bold text-lg mb-4">
              3. รายจ่าย
            </h3>
            <div className="space-y-4">
              {/* Expense Type */}
              <div>
                <label className="block text-tfpa_blue font-bold mb-2">
                  ประเภทรายจ่าย
                </label>
                <select
                  value={type}
                  onChange={(e) =>
                    handleTypeChange(parseInt(e.target.value, 10))
                  }
                  className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                >
                  <option value={0}>เลือก</option>
                  {expenseTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Expense Name */}
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
                  onWheel={(e) => e.target.blur()}
                  onChange={(e) => setAmount(e.target.value)}
                  className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                />
              </div>

              {/* Growth Rate */}
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

              {/* Debt Expense */}
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

              {/* Non-Mortgage Debt Expense */}
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

              {/* Saving Expense */}
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

              {/* Action Buttons */}
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

            {/* Existing Expenses Table */}
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
                  <tr key={`${exp.clientUuid}-${exp.clientExpenseName}`}>
                    <td className="py-2 px-4 border">
                      {getExpenseTypeLabel(exp.clientExpenseType)}
                    </td>
                    <td className="py-2 px-4 border">
                      {exp.clientExpenseName}
                    </td>
                    <td className="py-2 px-4 border">
                      {getFrequencyLabel(exp.clientExpenseFrequency)}
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
                {expenses.length === 0 && (
                  <tr>
                    <td className="py-2 px-4 border text-center" colSpan="9">
                      ไม่มีรายจ่ายที่บันทึกไว้
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
    </div>
  )
}
