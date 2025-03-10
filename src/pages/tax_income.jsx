import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Footer from "../components/footer"
import Header from "../components/cfpHeader"
import CfpClientSidePanel from "../components/cfpClientSidePanel"
import { fetchAndCalculateTaxForClient } from "../utils/taxCalculations"
import { motion } from "framer-motion"

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

const modalVariants = {
  initial: { y: -40, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 20, opacity: 0 },
}

export default function TaxIncomePage() {
  const [clientUuid] = useState(localStorage.getItem("clientUuid") || "")
  const navigate = useNavigate()

  // We'll store incomes in a state that includes both the original & displayed amounts.
  const [incomes, setIncomes] = useState([])
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpense, setTotalExpense] = useState(0)

  // For showing/hiding the 40(8) details modal
  const [show408Details, setShow408Details] = useState(false)

  useEffect(() => {
    if (!clientUuid) return
    fetchData()
  }, [clientUuid])

  async function fetchData() {
    try {
      // 1) Fetch all client incomes from your API
      const res = await fetch(
        `${import.meta.env.VITE_API_KEY}api/clientincome/${clientUuid}`
      )
      if (!res.ok) throw new Error("Failed to fetch incomes")
      const data = await res.json()

      // For UI display, add displayIncomeAmount
      // but keep original clientIncomeAmount for DB updates.
      const adjusted = data.map((inc) => {
        let displayIncomeAmount = inc.clientIncomeAmount
        // If monthly, multiply by 12
        if (inc.clientIncomeFrequency === 1) {
          displayIncomeAmount *= 12
        }
        return {
          ...inc,
          displayIncomeAmount,
        }
      })
      setIncomes(adjusted)

      // 2) Compute totalIncome & totalExpense from your tax logic
      const result = await fetchAndCalculateTaxForClient(clientUuid)
      setTotalIncome(result.totalIncome)
      setTotalExpense(result.totalExpenseDeductions)
    } catch (error) {
      console.error("Error fetching tax income data:", error)
    }
  }

  /**
   * Update ONLY the 40(8) "otherExpense" field in local state & DB.
   * item is the *entire* record from the DB (with displayIncomeAmount added for UI).
   */
  const handleUpdateOtherExpense = async (item, newVal) => {
    const newDeduction = parseInt(newVal, 10) || 0

    // 1) Update local state so input won't revert
    setIncomes((prevIncomes) =>
      prevIncomes.map((inc) => {
        if (
          inc.clientUuid === item.clientUuid &&
          inc.clientIncomeName === item.clientIncomeName
        ) {
          return {
            ...inc,
            clientIncome408TypeOtherExpenseDeduction: newDeduction,
          }
        }
        return inc
      })
    )

    // 2) Build an updated object for the PUT with all necessary fields.
    //    The server expects a complete record (non-null fields).
    //    Notice we do *not* use inc.displayIncomeAmount for the DB:
    const updatedIncome = {
      clientUuid: item.clientUuid,
      clientIncomeName: item.clientIncomeName,
      clientIncomeType: item.clientIncomeType,
      clientIncomeFrequency: item.clientIncomeFrequency,
      clientIncomeAmount: item.clientIncomeAmount, // keep the original amount
      clientIncomeAnnualGrowthRate: item.clientIncomeAnnualGrowthRate,
      clientIncome405Type: item.clientIncome405Type,
      clientIncome406Type: item.clientIncome406Type,
      clientIncome408Type: item.clientIncome408Type,
      // Overwrite only the 408 deduction
      clientIncome408TypeOtherExpenseDeduction: newDeduction,
    }

    // 3) Send PUT request
    try {
      // Make sure we encode the income name if your endpoint requires it.
      const putUrl = `${
        import.meta.env.VITE_API_KEY
      }api/clientincome/${clientUuid}/${encodeURIComponent(
        item.clientIncomeName
      )}`

      const res = await fetch(putUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedIncome),
      })
      if (!res.ok) {
        console.error("Failed to update otherExpenseDeduction in DB")
        return
      }
      // 3) Once PUT is successful, re-fetch totals from your server logic:
      const result = await fetchAndCalculateTaxForClient(clientUuid)
      setTotalIncome(result.totalIncome)
      setTotalExpense(result.totalExpenseDeductions)
    } catch (err) {
      console.error("Error updating 40(8) other expense:", err)
    }
  }

  // Prepare categories structure
  const categories = {
    1: {
      code: "40(1)",
      label: "เงินเดือน ค่าจ้าง เบี้ยเลี้ยง โบนัส บำนาญ ฯลฯ",
      amount: 0,
    },
    2: {
      code: "40(2)",
      label: "ค่านายหน้า เบี้ยประชุม หรือเงินได้จากหน้าที่ / การรับทำงานให้",
      amount: 0,
    },
    3: {
      code: "40(3)",
      label: "เงินได้จากค่าลิขสิทธิ์หรือเงินรายปี",
      amount: 0,
    },
    4: {
      code: "40(4)",
      label: "เงินได้จากการลงทุน",
      amount: 0,
    },
    5: {
      code: "40(5)",
      label: "เงินได้จากการให้เช่าทรัพย์สิน",
      amount: 0,
      subtypes: {
        "บ้าน/โรงเรือน/สิ่งปลูกสร้าง/แพ/ยานพาหนะ": 0,
        ที่ดินที่ใช้ในการเกษตร: 0,
        ที่ดินที่มิได้ใช้ในการเกษตร: 0,
        ทรัพย์สินอื่นๆ: 0,
      },
    },
    6: {
      code: "40(6)",
      label: "เงินได้จากวิชาชีพอิสระ",
      amount: 0,
      subtypes: {
        การประกอบโรคศิลปะ: 0,
        "กฎหมาย/วิศวกรรม/สถาปัตยกรรม/การบัญชี/ประณีตศิลปกรรม": 0,
      },
    },
    7: {
      code: "40(7)",
      label: "เงินได้จากการรับเหมาที่ผู้รับเหมาต้องจัดหาสัมภาระในส่วนสำคัญ",
      amount: 0,
    },
    8: {
      code: "40(8)",
      label: "เงินได้อื่นๆ",
      amount: 0,
      subtypes: {
        "ประเภทที่ (1) (เงินได้ส่วนที่ไม่เกิน 300,000 บาท)": 0,
        "ประเภทที่ (1) (เงินได้ส่วนที่เกิน 300,000 บาท)": 0,
        "ประเภทที่ (2) ถึง (43)": 0,
        "เงินได้ประเภทที่ไม่อยู่ใน (1) ถึง (43)": {
          total: 0,
          items: [], // will store entire inc objects: { ...inc, displayIncomeAmount }
        },
      },
    },
  }

  // Map the numeric “405” code -> string key
  const sub405Map = {
    1: "บ้าน/โรงเรือน/สิ่งปลูกสร้าง/แพ/ยานพาหนะ",
    2: "ที่ดินที่ใช้ในการเกษตร",
    3: "ที่ดินที่มิได้ใช้ในการเกษตร",
    4: "ทรัพย์สินอื่นๆ",
  }

  // Map the numeric “406” code -> string key
  const sub406Map = {
    1: "การประกอบโรคศิลปะ",
    2: "กฎหมาย/วิศวกรรม/สถาปัตยกรรม/การบัญชี/ประณีตศิลปกรรม",
  }

  const sub408Map = {
    1: "ประเภทที่ (1) (เงินได้ส่วนที่ไม่เกิน 300,000 บาท)",
    2: "ประเภทที่ (1) (เงินได้ส่วนที่เกิน 300,000 บาท)",
    3: "ประเภทที่ (2) ถึง (43)",
    4: "เงินได้ประเภทที่ไม่อยู่ใน (1) ถึง (43)",
  }

  // Tally incomes for UI display
  incomes.forEach((inc) => {
    const mainType = inc.clientIncomeType
    if (!categories[mainType]) return

    // Add inc.displayIncomeAmount to the category's total
    categories[mainType].amount += inc.displayIncomeAmount || 0

    if (mainType === 5) {
      // 40(5)
      const sub405Key = sub405Map[inc.clientIncome405Type]
      if (sub405Key && categories[5].subtypes[sub405Key] !== undefined) {
        categories[5].subtypes[sub405Key] += inc.displayIncomeAmount || 0
      }
    } else if (mainType === 6) {
      // 40(6)
      const sub406Key = sub406Map[inc.clientIncome406Type]
      if (sub406Key && categories[6].subtypes[sub406Key] !== undefined) {
        categories[6].subtypes[sub406Key] += inc.displayIncomeAmount || 0
      }
    } else if (mainType === 8) {
      const sub408 = inc.clientIncome408Type
      const subKey = sub408Map[sub408]

      // If the server returns something outside [1..4], guard here:
      if (!subKey) {
        console.warn(`Unrecognized 40(8) subtype: ${sub408}`)
        return
      }

      // เงินได้ประเภทที่ไม่อยู่ใน (1) ถึง (43)
      if (subKey === "เงินได้ประเภทที่ไม่อยู่ใน (1) ถึง (43)") {
        categories[8].subtypes[subKey].total += inc.displayIncomeAmount || 0
        categories[8].subtypes[subKey].items.push(inc)
      } else {
        // For the other subtypes (which are just numbers in your object),
        // simply add to the existing total
        categories[8].subtypes[subKey] += inc.displayIncomeAmount || 0
      }
    }
  })

  function handleNext() {
    navigate(`/tax-deduction/`)
  }

  const incomeAfterExpense = totalIncome - totalExpense

  return (
    <div className="flex flex-col min-h-screen font-ibm">
      <Header />
      <div className="flex flex-1">
        <CfpClientSidePanel />
        <div className="flex-1 p-8 space-y-8">
          {/* Steps Bar */}
          <div className="flex items-center justify-center space-x-8">
            <button
              onClick={() => navigate(`/tax-income/`)}
              className="flex flex-col items-center focus:outline-none"
            >
              <div className="w-10 h-10 bg-tfpa_gold rounded-full flex items-center justify-center text-white font-bold cursor-pointer">
                1
              </div>
              <span className="font-bold text-tfpa_blue">รายได้</span>
            </button>
            <div className="h-px bg-gray-300 w-24"></div>
            <button
              onClick={() => navigate(`/tax-deduction/`)}
              className="flex flex-col items-center focus:outline-none text-gray-400"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold cursor-pointer">
                2
              </div>
              <span className="font-bold">ค่าลดหย่อน</span>
            </button>
            <div className="h-px bg-gray-300 w-24"></div>
            <button
              onClick={() => navigate(`/tax-calculation/`)}
              className="flex flex-col items-center focus:outline-none text-gray-400"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold cursor-pointer">
                3
              </div>
              <span className="font-bold">ผลการคำนวณ</span>
            </button>
          </div>

          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            {/* Show each category & subtypes */}
            <div className="space-y-4">
              {Object.entries(categories).map(([key, cat]) => {
                const is408 = cat.code === "40(8)"
                return (
                  <div key={key}>
                    {/* Main row for the category */}
                    <div className="flex items-center space-x-4">
                      <div className="w-1/2 text-tfpa_blue font-bold flex items-center">
                        {cat.code} {cat.label}
                        {/* If 40(8), show detail button */}
                        {is408 && (
                          <button
                            onClick={() => setShow408Details(true)}
                            className="ml-2 bg-tfpa_blue hover:bg-tfpa_blue_hover text-white px-2 py-1 text-xs rounded-xl font-ibm"
                          >
                            รายละเอียด
                          </button>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 w-1/2">
                        <input
                          type="text"
                          // Sum of displayIncomeAmount
                          value={cat.amount.toLocaleString()}
                          readOnly
                          className="text-tfpa_gold font-bold rounded px-2 py-1 text-right w-24"
                        />
                        <span className="text-tfpa_blue font-bold">บาท</span>
                      </div>
                    </div>

                    {/* 40(5) subtypes */}
                    {cat.code === "40(5)" && cat.subtypes && (
                      <div className="ml-6 mt-2 space-y-1">
                        {Object.entries(cat.subtypes).map(
                          ([subKey, subVal]) => (
                            <div
                              key={subKey}
                              className="flex items-center space-x-4"
                            >
                              <div className="w-1/2 text-tfpa_blue">
                                ┗ {subKey}
                              </div>
                              <div className="flex items-center space-x-2 w-1/2">
                                <input
                                  type="text"
                                  value={subVal.toLocaleString()}
                                  readOnly
                                  className="text-tfpa_blue px-2 py-1 text-right w-24 rounded"
                                />
                                <span className="text-tfpa_blue">บาท</span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {/* 40(6) subtypes */}
                    {cat.code === "40(6)" && cat.subtypes && (
                      <div className="ml-6 mt-2 space-y-1">
                        {Object.entries(cat.subtypes).map(
                          ([subKey, subVal]) => (
                            <div
                              key={subKey}
                              className="flex items-center space-x-4"
                            >
                              <div className="w-1/2 text-tfpa_blue">
                                ┗ {subKey}
                              </div>
                              <div className="flex items-center space-x-2 w-1/2">
                                <input
                                  type="text"
                                  value={subVal.toLocaleString()}
                                  readOnly
                                  className="text-tfpa_blue px-2 py-1 text-right w-24 rounded"
                                />
                                <span className="text-tfpa_blue">บาท</span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {/* 40(8) subtypes */}
                    {cat.code === "40(8)" && cat.subtypes && (
                      <div className="ml-6 mt-2 space-y-1">
                        {Object.entries(cat.subtypes).map(
                          ([subKey, subVal]) => {
                            if (
                              subKey ===
                              "เงินได้ประเภทที่ไม่อยู่ใน (1) ถึง (43)"
                            ) {
                              // subVal is { total, items[] }
                              return (
                                <div key={subKey}>
                                  <div className="flex items-center space-x-4">
                                    <div className="w-1/2 text-tfpa_blue">
                                      ┗ {subKey}
                                    </div>
                                    <div className="flex items-center space-x-2 w-1/2">
                                      <input
                                        type="text"
                                        value={subVal.total.toLocaleString()}
                                        readOnly
                                        className="text-tfpa_blue px-2 py-1 text-right w-24 rounded"
                                      />
                                      <span className="text-tfpa_blue">
                                        บาท
                                      </span>
                                    </div>
                                  </div>
                                  {/* If any "items" exist */}
                                  {subVal.items && subVal.items.length > 0 && (
                                    <div className="ml-8 mt-1 space-y-2">
                                      {subVal.items.map((item, idx) => (
                                        <div
                                          key={idx}
                                          className="flex items-center space-x-4"
                                        >
                                          <div className="w-1/2 text-tfpa_blue">
                                            ┗ {item.clientIncomeName}
                                          </div>
                                          <div className="flex-1 flex flex-wrap items-center space-x-2">
                                            {/* Amount displayed (12x if monthly) */}
                                            <input
                                              type="text"
                                              value={
                                                item.displayIncomeAmount?.toLocaleString() ||
                                                "0"
                                              }
                                              readOnly
                                              className="text-tfpa_blue_hover px-2 py-1 text-right w-24 rounded"
                                            />
                                            <span className="text-tfpa_blue">
                                              บาท
                                            </span>

                                            {/* Editable otherExpenseDeduction */}
                                            <label className="text-tfpa_blue whitespace-nowrap">
                                              หักค่าใช้จ่ายจริงตามความจำเป็น
                                            </label>
                                            <input
                                              type="number"
                                              value={
                                                item.clientIncome408TypeOtherExpenseDeduction ||
                                                0
                                              }
                                              onFocus={(e) => e.target.select()}
                                              onWheel={(e) => e.target.blur()}
                                              onChange={(e) =>
                                                handleUpdateOtherExpense(
                                                  item,
                                                  e.target.value
                                                )
                                              }
                                              className="border border-gray-300 rounded px-2 py-1 w-24 text-right"
                                            />
                                            <span className="text-tfpa_blue">
                                              บาท
                                            </span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )
                            } else {
                              // It's one of the other 3 subKey
                              return (
                                <div
                                  key={subKey}
                                  className="flex items-center space-x-4"
                                >
                                  <div className="w-1/2 text-tfpa_blue">
                                    ┗ {subKey}
                                  </div>
                                  <div className="flex items-center space-x-2 w-1/2">
                                    <input
                                      type="text"
                                      value={
                                        subVal.toLocaleString
                                          ? subVal.toLocaleString()
                                          : subVal
                                      }
                                      readOnly
                                      className="text-tfpa_blue px-2 py-1 text-right w-24 rounded"
                                    />
                                    <span className="text-tfpa_blue">บาท</span>
                                  </div>
                                </div>
                              )
                            }
                          }
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <hr className="border-dashed mt-4 mb-4 border-gray-300" />

            <div className="flex flex-col items-start space-y-2 font-bold text-tfpa_blue">
              <div className="flex space-x-2">
                <span>รวมเงินได้</span>
                <span className="text-tfpa_gold">
                  {totalIncome.toLocaleString()}
                </span>
                <span>บาท</span>
              </div>
              <div className="flex space-x-2">
                <span>หักค่าใช้จ่ายได้</span>
                <span className="text-tfpa_gold">
                  {totalExpense.toLocaleString()}
                </span>
                <span>บาท</span>
              </div>
              <div className="flex space-x-2">
                <span>เงินได้พึงประเมินหลังหักค่าใช้จ่าย</span>
                <span className="text-tfpa_gold">
                  {(totalIncome - totalExpense).toLocaleString()}
                </span>
                <span>บาท</span>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleNext}
                className="bg-tfpa_gold hover:bg-tfpa_gold_hover text-white px-4 py-2 rounded font-bold"
              >
                ถัดไป
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />

      {/* 40(8) Details Modal */}
      {show408Details && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50 font-ibm"
          onClick={() => setShow408Details(false)}
        >
          <motion.div
            className="relative w-full max-w-4xl mx-2 bg-white rounded-lg p-6 overflow-y-auto thin-scroll max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div>
              <h2 className="text-xl font-bold text-tfpa_blue mb-4">
                รายละเอียดเงินได้พึงประเมิน 40(8) และ
                อัตราการหักค่าใช้จ่ายเป็นการเหมาสำหรับภาษี
              </h2>
              <p className="text-sm text-gray-700 mb-4 leading-6">
                <strong>ประเภทที่ (1)</strong> – การแสดงของนักแสดงละคร ภาพยนตร์
                วิทยุหรือโทรทัศน์ นักร้อง นักดนตรี นักกีฬาอาชีพ
                หรือนักแสดงเพื่อความบันเทิงใด ๆ
                <br />
                &emsp;– (ก) สำหรับเงินได้ส่วนที่ไม่เกิน 300,000 บาท
                หักค่าใช้จ่าย 60%
                <br />
                &emsp;– (ข) สำหรับเงินได้ส่วนที่เกิน 300,000 บาท หักค่าใช้จ่าย
                40%
                <br />
                &emsp;โดยการหักค่าใช้จ่ายตาม (ก) และ (ข) รวมกันต้องไม่เกิน
                600,000 บาท
                <br />
                <strong>ประเภทที่ (2)</strong> –
                การขายที่ดินเงินผ่อนหรือให้เช่าซื้อที่ดิน &nbsp;หักค่าใช้จ่าย
                60%
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
                หรือซ่อมเรือที่มิใช่ซ่อมเครื่องจักร เครื่องกล
                &nbsp;หักค่าใช้จ่าย 60%
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
                <strong>ประเภทที่ (11)</strong> – การทำสบู่ แชมพู
                หรือเครื่องสำอาง &nbsp;หักค่าใช้จ่าย 60%
                <br />
                <strong>ประเภทที่ (12)</strong> – การทำวรรณกรรม
                &nbsp;หักค่าใช้จ่าย 60%
                <br />
                <strong>ประเภทที่ (13)</strong> – การค้าเครื่องเงิน ทอง นาก เพชร
                พลอย หรืออัญมณีอื่น ๆ รวมทั้งการขายส่วนประกอบ
                &nbsp;หักค่าใช้จ่าย 60%
                <br />
                <strong>ประเภทที่ (14)</strong> – การทำกิจการสถานพยาบาล
                ตามกฎหมายว่าด้วยสถานพยาบาลเฉพาะ ที่มีเตียงรับผู้ป่วยค้างคืน
                รวมทั้งการรักษาพยาบาลและการจำหน่ายยา &nbsp;หักค่าใช้จ่าย 60%
                <br />
                <strong>ประเภทที่ (15)</strong> – การโม่หรือย่อยหิน
                &nbsp;หักค่าใช้จ่าย 60%
                <br />
                <strong>ประเภทที่ (16)</strong> – การทำป่าไม้ สวนยาง
                หรือไม้ยืนต้น &nbsp;หักค่าใช้จ่าย 60%
                <br />
                <strong>ประเภทที่ (17)</strong> – การขนส่ง
                หรือรับจ้างด้วยยานพาหนะ &nbsp;หักค่าใช้จ่าย 60%
                <br />
                <strong>ประเภทที่ (18)</strong> – การทำบล็อก และตรา
                การรับพิมพ์หนังสือเย็บเล่มจด เอกสาร รวมทั้งการขายส่วนประกอบ
                &nbsp;หักค่าใช้จ่าย 60%
                <br />
                <strong>ประเภทที่ (19)</strong> – การทำเหมืองแร่
                &nbsp;หักค่าใช้จ่าย 60%
                <br />
                <strong>ประเภทที่ (20)</strong> –
                การทำเครื่องดื่มตามกฎหมายว่าด้วยภาษีสรรพสามิต
                &nbsp;หักค่าใช้จ่าย 60%
                <br />
                <strong>ประเภทที่ (21)</strong> – การทำเครื่องกระเบื้อง
                เครื่องเคลือบ เครื่องซีเมนต์ หรือดินเผา &nbsp;หักค่าใช้จ่าย 60%
                <br />
                <strong>ประเภทที่ (22)</strong> – การทำหรือจำหน่ายกระแสไฟฟ้า
                &nbsp;หักค่าใช้จ่าย 60%
                <br />
                <strong>ประเภทที่ (23)</strong> – การทำน้ำแข็ง
                &nbsp;หักค่าใช้จ่าย 60%
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
                รางวัลที่เจ้าของม้าได้จากการส่งม้าเข้าแข่ง &nbsp;หักค่าใช้จ่าย
                60%
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
                <strong>ประเภทที่ (42)</strong> – การทำนาเกลือ
                &nbsp;หักค่าใช้จ่าย 60%
                <br />
                <strong>ประเภทที่ (43)</strong> –
                การขายเรือกำปั่นหรือเรือมีระวางตั้งแต่ 6 ตันขึ้นไป เรือกลไฟ
                หรือเรือยนต์มีระวางตั้งแต่ 5 ตันขึ้นไป หรือแพ
                &nbsp;หักค่าใช้จ่าย 60%
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
          </motion.div>
        </div>
      )}
    </div>
  )
}
