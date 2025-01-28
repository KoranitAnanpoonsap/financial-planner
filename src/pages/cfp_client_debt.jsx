import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/cfpHeader"
import Footer from "../components/footer"
import CfpClientSidePanel from "../components/cfpClientSidePanel"
import { motion } from "framer-motion"

// 1) Import react-datepicker and date-fns formatting tools
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { format, parseISO } from "date-fns"

const debtTypes = {
  1: "หนี้บ้าน",
  2: "หนี้รถยนต์",
  3: "หนี้รถจักรยานยนต์",
  4: "หนี้บัตรเครดิต",
  5: "หนี้บัตรกดเงินสด",
  6: "หนี้ผ่อนชำระสินค้า",
  7: "หนี้นอกระบบ",
  8: "หนี้อื่นๆ",
}

const debtTerms = {
  1: "ระยะสั้น",
  2: "ระยะยาว",
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

export default function CFPClientDebtPage() {
  const [clientUuid] = useState(localStorage.getItem("clientUuid") || "")
  const navigate = useNavigate()

  const [debts, setDebts] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [editingDebt, setEditingDebt] = useState(null)

  const [debtType, setDebtType] = useState(0) // 0 represents "เลือก"
  const [debtName, setDebtName] = useState("")
  const [debtTerm, setDebtTerm] = useState(1) // 1 represents "ระยะสั้น"
  const [amount, setAmount] = useState("")
  const [interest, setInterest] = useState("")

  // 2) Store `startDate` as a Date object
  const [startDate, setStartDate] = useState(null)

  const [years, setYears] = useState("")
  const [principal, setPrincipal] = useState("")

  useEffect(() => {
    fetchDebts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientUuid])

  const fetchDebts = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_KEY}api/clientdebt/${clientUuid}`
      )
      if (!res.ok) {
        console.error("Failed to fetch debts")
        return
      }
      const data = await res.json()

      // 3) Convert the incoming date string to a Date object IF you want to
      // store it immediately. Typically, we do this in the table row for display.
      setDebts(data)
    } catch (error) {
      console.error("Error fetching debts:", error)
    }
  }

  const getDebtTypeLabel = (typeValue) => {
    return debtTypes[typeValue] || "ไม่ระบุ"
  }

  const getDebtTermLabel = (termValue) => {
    return debtTerms[termValue] || "ไม่ระบุ"
  }

  const handleCreateOrUpdateDebt = async () => {
    // Validate required fields
    if (
      debtType === 0 ||
      debtName.trim() === "" ||
      debtTerm === 0 ||
      amount === "" ||
      interest === "" ||
      !startDate || // must be a valid Date object
      years === "" ||
      principal === ""
    ) {
      return
    }

    // 4) Convert `startDate` (Date object) to string format for the server, e.g. yyyy-MM-dd
    // We'll do this with date-fns:
    const isoDateString = format(startDate, "yyyy-MM-dd")

    const newDebt = {
      clientUuid: clientUuid,
      clientDebtName: debtName,
      clientDebtType: debtType,
      clientDebtTerm: debtTerm,
      clientDebtAmount: parseFloat(amount),
      clientDebtAnnualInterest: parseFloat(interest) / 100,
      clientStartDateDebt: isoDateString, // e.g. "2025-01-01"
      clientDebtDuration: parseInt(years, 10),
      clientDebtPrincipal: parseFloat(principal),
    }

    let url = `${import.meta.env.VITE_API_KEY}api/clientdebt`
    let method = "POST"

    if (editMode && editingDebt) {
      if (editingDebt.clientDebtName !== debtName) {
        // If the debt name is being updated, delete the old record and create a new one
        const deleteRes = await fetch(
          `${
            import.meta.env.VITE_API_KEY
          }api/clientdebt/${clientUuid}/${encodeURIComponent(
            editingDebt.clientDebtName
          )}`,
          { method: "DELETE" }
        )
        if (!deleteRes.ok) {
          console.error("Failed to delete old debt")
          return
        }
        // Continue with POST
      } else {
        // Just update
        url = `${
          import.meta.env.VITE_API_KEY
        }api/clientdebt/${clientUuid}/${encodeURIComponent(
          editingDebt.clientDebtName
        )}`
        method = "PUT"
      }
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDebt),
      })
      if (!res.ok) {
        console.error("Failed to create/update debt")
        return
      }
      await res.json()
      // Refresh list
      await fetchDebts()
      // Reset fields
      resetFields()
    } catch (error) {
      console.error("Error creating/updating debt:", error)
    }
  }

  const handleDeleteDebt = async (dbt) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_KEY}api/clientdebt/${clientUuid}/${
          dbt.clientDebtName
        }`,
        { method: "DELETE" }
      )
      if (!res.ok) {
        console.error("Failed to delete debt")
        return
      }
      await fetchDebts()
    } catch (error) {
      console.error("Error deleting debt:", error)
    }
  }

  const handleEdit = (dbt) => {
    setEditMode(true)
    setEditingDebt(dbt)
    setDebtType(dbt.clientDebtType)
    setDebtName(dbt.clientDebtName)
    setDebtTerm(dbt.clientDebtTerm)
    setAmount(dbt.clientDebtAmount.toString())
    setInterest((dbt.clientDebtAnnualInterest * 100).toFixed(2).toString())
    // 5) parse the date string into a Date object for the date picker
    if (dbt.clientStartDateDebt) {
      setStartDate(parseISO(dbt.clientStartDateDebt)) // from date-fns
    } else {
      setStartDate(null)
    }
    setYears(dbt.clientDebtDuration.toString())
    setPrincipal(dbt.clientDebtPrincipal.toString())
  }

  const handleCancelEdit = () => {
    resetFields()
  }

  const resetFields = () => {
    setEditMode(false)
    setEditingDebt(null)
    setDebtType(0)
    setDebtName("")
    setDebtTerm(1)
    setAmount("")
    setInterest("")
    setStartDate(null)
    setYears("")
    setPrincipal("")
  }

  const handleBack = () => {
    navigate(`/client-asset/`)
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
              className="flex flex-col items-center focus:outline-none text-gray-400"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <span className="font-bold mt-1">รายได้</span>
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
              <div className="w-10 h-10 bg-tfpa_gold text-white rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <span className="font-bold text-tfpa_blue mt-1">หนี้สิน</span>
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
              5. หนี้สิน
            </h3>
            <div className="space-y-4">
              {/* Debt Type */}
              <div>
                <label className="block text-tfpa_blue font-bold mb-2">
                  ประเภทหนี้สิน
                </label>
                <select
                  value={debtType}
                  onChange={(e) => setDebtType(parseInt(e.target.value, 10))}
                  className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                >
                  <option value={0}>เลือก</option>
                  {Object.entries(debtTypes).map(([key, value]) => (
                    <option key={key} value={parseInt(key, 10)}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              {/* Debt Name */}
              <div>
                <label className="block text-tfpa_blue font-bold mb-2">
                  ชื่อหนี้สิน
                </label>
                <input
                  type="text"
                  value={debtName}
                  onChange={(e) => setDebtName(e.target.value)}
                  className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                />
              </div>

              {/* Debt Term */}
              <div>
                <label className="block text-tfpa_blue font-bold mb-2">
                  ประเภทหนี้สิน (ระยะสั้น/ยาว)
                </label>
                <select
                  value={debtTerm}
                  onChange={(e) => setDebtTerm(parseInt(e.target.value, 10))}
                  className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                >
                  <option value={0}>เลือก</option>
                  {Object.entries(debtTerms).map(([key, label]) => (
                    <option key={key} value={parseInt(key, 10)}>
                      {label}
                    </option>
                  ))}
                </select>
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

              {/* Interest */}
              <div>
                <label className="block text-tfpa_blue font-bold mb-2">
                  ดอกเบี้ยต่อปี (%)
                </label>
                <input
                  type="number"
                  value={interest}
                  onWheel={(e) => e.target.blur()}
                  onChange={(e) => setInterest(e.target.value)}
                  className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                />
              </div>

              {/* Start Date (Use React DatePicker) */}
              <div>
                <label className="block text-tfpa_blue font-bold mb-2">
                  วันที่เริ่มต้นของหนี้สิน (DD/MM/YYYY)
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="dd/MM/yyyy" // Display format
                  className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                  placeholderText="DD/MM/YYYY"
                />
              </div>

              {/* Debt Duration (Years) */}
              <div>
                <label className="block text-tfpa_blue font-bold mb-2">
                  จำนวนปีของหนี้สิน (ปี)
                </label>
                <input
                  type="number"
                  value={years}
                  onWheel={(e) => e.target.blur()}
                  onChange={(e) => setYears(e.target.value)}
                  className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                />
              </div>

              {/* Principal */}
              <div>
                <label className="block text-tfpa_blue font-bold mb-2">
                  เงินต้น (บาท)
                </label>
                <input
                  type="number"
                  value={principal}
                  onWheel={(e) => e.target.blur()}
                  onChange={(e) => setPrincipal(e.target.value)}
                  className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                {editMode ? (
                  <>
                    <button
                      onClick={handleCreateOrUpdateDebt}
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
                    onClick={handleCreateOrUpdateDebt}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-ibm font-bold"
                  >
                    เพิ่ม
                  </button>
                )}
              </div>
            </div>

            {/* Existing Debts Table */}
            <h3 className="text-tfpa_blue font-bold text-lg mt-4">
              หนี้สินที่มีอยู่
            </h3>
            <table className="min-w-full bg-white border border-gray-300 mt-4 mb-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                    ประเภทหนี้สิน
                  </th>
                  <th className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                    ชื่อหนี้สิน
                  </th>
                  <th className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                    ประเภท (ระยะสั้น/ยาว)
                  </th>
                  <th className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                    จำนวน (บาท)
                  </th>
                  <th className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                    ดอกเบี้ยต่อปี (%)
                  </th>
                  <th className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                    วันที่เริ่มต้น
                  </th>
                  <th className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                    จำนวนปี
                  </th>
                  <th className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                    เงินต้น (บาท)
                  </th>
                  <th className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody>
                {debts.map((dbt) => {
                  // 6) Format date in dd/MM/yyyy if present
                  let displayDate = ""
                  if (dbt.clientStartDateDebt) {
                    try {
                      const parsed = parseISO(dbt.clientStartDateDebt)
                      displayDate = format(parsed, "dd/MM/yyyy")
                    } catch (err) {
                      console.error("Date parse error:", err)
                      displayDate = dbt.clientStartDateDebt
                    }
                  }

                  return (
                    <tr key={`${dbt.clientUuid}-${dbt.clientDebtName}`}>
                      <td className="py-2 px-4 border">
                        {getDebtTypeLabel(dbt.clientDebtType)}
                      </td>
                      <td className="py-2 px-4 border">{dbt.clientDebtName}</td>
                      <td className="py-2 px-4 border">
                        {getDebtTermLabel(dbt.clientDebtTerm)}
                      </td>
                      <td className="py-2 px-4 border text-right">
                        {dbt.clientDebtAmount.toLocaleString()}
                      </td>
                      <td className="py-2 px-4 border text-right">
                        {(dbt.clientDebtAnnualInterest * 100).toFixed(2)}%
                      </td>
                      <td className="py-2 px-4 border">{displayDate}</td>
                      <td className="py-2 px-4 border text-right">
                        {dbt.clientDebtDuration}
                      </td>
                      <td className="py-2 px-4 border text-right">
                        {dbt.clientDebtPrincipal.toLocaleString()}
                      </td>
                      <td className="py-2 px-4 border">
                        <div className="flex space-x-4">
                          <button
                            onClick={() => handleEdit(dbt)}
                            className="bg-tfpa_blue hover:bg-tfpa_blue_hover text-white px-4 py-1 rounded font-ibm"
                          >
                            แก้ไข
                          </button>
                          <button
                            onClick={() => handleDeleteDebt(dbt)}
                            className="bg-red-500 hover:bg-red-700 text-white px-4 py-1 rounded font-ibm"
                          >
                            ลบ
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {debts.length === 0 && (
                  <tr>
                    <td className="py-2 px-4 border text-center" colSpan="9">
                      ไม่มีหนี้สินที่บันทึกไว้
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
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
