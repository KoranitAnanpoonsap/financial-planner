import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Footer from "../components/footer"
import Header from "../components/cfpHeader"
import CfpClientSidePanel from "../components/cfpClientSidePanel"
import { fetchAndCalculateTaxForClient } from "../utils/taxCalculations"
import { motion } from "framer-motion"

const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 1,
  },
}

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.3,
}

const MARITAL_STATUS = {
  SELECT: 0,
  SINGLE: 1, // โสด
  SPOUSE_SEPARATE: 2, // คู่สมรสมีเงินได้แยกยื่นแบบ
  SPOUSE_COMBINED: 3, // คู่สมรสมีเงินได้ยื่นรวม
  SPOUSE_NO_INCOME: 4, // คู่สมรสไม่มีเงินได้
}

const MARITAL_STATUS_OPTIONS = [
  { value: MARITAL_STATUS.SELECT, label: "เลือก" },
  { value: MARITAL_STATUS.SINGLE, label: "โสด" },
  {
    value: MARITAL_STATUS.SPOUSE_SEPARATE,
    label: "คู่สมรสมีเงินได้แยกยื่นแบบ",
  },
  { value: MARITAL_STATUS.SPOUSE_COMBINED, label: "คู่สมรสมีเงินได้ยื่นรวม" },
  { value: MARITAL_STATUS.SPOUSE_NO_INCOME, label: "คู่สมรสไม่มีเงินได้" },
]

export default function TaxDeductionPage() {
  const [clientUuid] = useState(localStorage.getItem("clientUuid") || "")
  const navigate = useNavigate()
  const [baseForDonation, setBaseForDonation] = useState(0)

  const [deductionData, setDeductionData] = useState({
    maritalStatus: MARITAL_STATUS.SELECT,
    child: 0,
    child2561: 0,
    adoptedChild: 0,
    parentalCare: 0,
    disabledCare: 0,
    prenatalCare: 0,
    parentHealthInsurance: 0,
    lifeInsurance: 0,
    healthInsurance: 0,
    pensionInsurance: 0,
    spouseNoIncomeLifeInsurance: 0,
    rmf: 0,
    ssf: 0,
    govPensionFund: 0,
    pvd: 0,
    nationSavingsFund: 0,
    socialSecurityPremium: 0,
    socialEnterprise: 0,
    thaiEsg: 0,
    generalDonation: 0,
    eduDonation: 0,
    politicalPartyDonation: 0,
  })

  const [exists, setExists] = useState(false)

  // Display values after applying conditions
  const [displayValues, setDisplayValues] = useState({
    maritalStatusDeduction: 0,
    childDeduction: 0,
    child2561Deduction: 0,
    adoptedChildDeduction: 0,
    parentalCareDeduction: 0,
    disabledCareDeduction: 0,
    prenatalCareDeduction: 0,
    parentHealthInsuranceDeduction: 0,
    lifeInsuranceDeduction: 0,
    healthInsuranceDeduction: 0,
    portionPensionInsuranceDeduction: 0,
    pensionInsuranceDeduction: 0,
    spouseNoIncomeLifeInsuranceDeduction: 0,
    rmfDeduction: 0,
    ssfDeduction: 0,
    govPensionFundDeduct: 0,
    pvdDeduct: 0,
    nationSavingsFundDeduct: 0,
    socialSecurityPremiumDeduct: 0,
    socialEnterpriseDeduct: 0,
    thaiEsgDeduct: 0,
    generalDonationDeduct: 0,
    eduDonationDeduct: 0,
    politicalPartyDonationDeduct: 0,
    beforeDonationDeduct: 0,
    totalDeduction: 0,
  })

  const [totalIncome, setTotalIncome] = useState(0)
  const [expenseDeductions, setExpenseDeductions] = useState(0)

  useEffect(() => {
    fetchDeduction()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientUuid])

  useEffect(() => {
    if (exists && totalIncome > 0) {
      calculateDeductions(deductionData, totalIncome)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deductionData, totalIncome, expenseDeductions, exists])

  const fetchDeduction = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_KEY}api/taxdeduction/${clientUuid}`
      )
      if (res.ok) {
        const data = await res.json()
        setDeductionData(data)
        setExists(true)
      } else {
        setExists(false)
      }

      const result = await fetchAndCalculateTaxForClient(clientUuid)
      setTotalIncome(result.totalIncome)
      setExpenseDeductions(result.totalExpenseDeductions)
    } catch (error) {
      console.error(error)
    }
  }

  const refreshCalculations = async (newData = deductionData) => {
    try {
      const result = await fetchAndCalculateTaxForClient(clientUuid)
      setTotalIncome(result.totalIncome)
      setExpenseDeductions(result.totalExpenseDeductions)

      calculateDeductions(newData, result.totalIncome)
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpdate = async (field, val) => {
    const updated = {
      ...deductionData,
      [field]: val,
      clientUuid: clientUuid,
    }

    setDeductionData(updated)

    const method = exists ? "PUT" : "POST"
    const url = exists
      ? `${import.meta.env.VITE_API_KEY}api/taxdeduction/${clientUuid}`
      : `${import.meta.env.VITE_API_KEY}api/taxdeduction`

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      })
      if (!res.ok) throw new Error("Failed to save tax deduction")
      const saved = await res.json()
      setDeductionData(saved)
      setExists(true)
      await refreshCalculations(saved)
    } catch (error) {
      console.error(error)
    }
  }

  const handleBlur = (field, val) => {
    handleUpdate(field, parseInt(val) || 0)
  }

  // Define handleInputFocus function
  const handleInputFocus = (e) => {
    e.target.select()
  }

  function calculateDeductions(data, totalInc) {
    let msDeduct = 0
    // marital status: 1=โสด, 2=คู่สมรสมีเงินได้แยกยื่นแบบ, 3=คู่สมรสมีเงินได้ยื่นรวม, 4=คู่สมรสไม่มีเงินได้
    if (
      data.maritalStatus === MARITAL_STATUS.SINGLE ||
      data.maritalStatus === MARITAL_STATUS.SPOUSE_SEPARATE
    ) {
      msDeduct = 60000
    } else if (
      data.maritalStatus === MARITAL_STATUS.SPOUSE_COMBINED ||
      data.maritalStatus === MARITAL_STATUS.SPOUSE_NO_INCOME
    ) {
      msDeduct = 120000
    }

    const cDeduct =
      data.maritalStatus === MARITAL_STATUS.SPOUSE_COMBINED
        ? data.child * 60000
        : data.child * 30000
    const c2561Deduct =
      data.maritalStatus === MARITAL_STATUS.SPOUSE_COMBINED
        ? data.child > 0
          ? data.child2561 * 120000
          : 0
        : data.child > 0
        ? data.child2561 * 60000
        : 0
    const legalChildren = data.child + data.child2561
    const adoptedDeduct =
      data.maritalStatus === MARITAL_STATUS.SPOUSE_COMBINED
        ? legalChildren < 3
          ? Math.min(data.adoptedChild, 3 - legalChildren) * 60000
          : 0
        : legalChildren < 3
        ? Math.min(data.adoptedChild, 3 - legalChildren) * 30000
        : 0

    const pCareDeduct = data.parentalCare * 30000
    const dCareDeduct = data.disabledCare * 60000
    const prenatalDeduct = Math.min(data.prenatalCare, 60000)
    const parentHealth = Math.min(data.parentHealthInsurance, 15000)

    let lifeIns = Math.min(data.lifeInsurance, 100000)
    let healthIns = Math.min(data.healthInsurance, 25000)
    if (lifeIns + healthIns > 100000) {
      healthIns -= lifeIns + healthIns - 100000
    }

    let portion_pensionIns = 0
    if (lifeIns + healthIns < 100000) {
      if (100000 - (lifeIns + healthIns) > data.pensionInsurance) {
        portion_pensionIns = data.pensionInsurance
      } else {
        portion_pensionIns = 100000 - (lifeIns + healthIns)
      }
    } else {
      portion_pensionIns = 0
    }

    let pensionIns = Math.min(
      data.pensionInsurance - portion_pensionIns,
      0.15 * totalInc,
      200000
    )

    const spouseNoIncome = Math.min(data.spouseNoIncomeLifeInsurance, 10000)

    const rmf = Math.min(data.rmf, 0.3 * totalInc, 500000)
    const ssf = Math.min(data.ssf, 0.3 * totalInc, 200000)
    const govPension = Math.min(data.govPensionFund, 0.3 * totalInc, 500000)
    const pvd = Math.min(data.pvd, 0.15 * totalInc, 500000)
    const nsf = Math.min(data.nationSavingsFund, 30000)
    const pensionGroup = Math.min(
      rmf + ssf + govPension + pvd + nsf + pensionIns,
      500000
    )

    const ssp = Math.min(data.socialSecurityPremium, 9000)
    const se = Math.min(data.socialEnterprise, 100000)
    const esg = Math.min(data.thaiEsg, 0.3 * totalInc, 300000)

    const beforeDonationSum =
      msDeduct +
      cDeduct +
      c2561Deduct +
      adoptedDeduct +
      pCareDeduct +
      dCareDeduct +
      prenatalDeduct +
      parentHealth +
      lifeIns +
      portion_pensionIns +
      healthIns +
      pensionGroup +
      spouseNoIncome +
      ssp +
      se +
      esg

    const updatedBaseForDonation = Math.max(
      0,
      totalInc - expenseDeductions - beforeDonationSum
    )

    // Calculate donations using the updated baseForDonation
    const genDon = Math.min(data.generalDonation, updatedBaseForDonation * 0.1)
    const eduDon = Math.min(data.eduDonation * 2, updatedBaseForDonation * 0.1)
    const polDon = Math.min(data.politicalPartyDonation, 10000)

    const donationSum = genDon + eduDon + polDon
    const total = beforeDonationSum + donationSum

    setBaseForDonation(updatedBaseForDonation) // Update state for consistency

    setDisplayValues({
      maritalStatusDeduction: msDeduct,
      childDeduction: cDeduct,
      child2561Deduction: c2561Deduct,
      adoptedChildDeduction: adoptedDeduct,
      parentalCareDeduction: pCareDeduct,
      disabledCareDeduction: dCareDeduct,
      prenatalCareDeduction: prenatalDeduct,
      parentHealthInsuranceDeduction: parentHealth,
      lifeInsuranceDeduction: lifeIns,
      healthInsuranceDeduction: healthIns,
      portionPensionInsuranceDeduction: portion_pensionIns,
      pensionInsuranceDeduction: pensionIns,
      spouseNoIncomeLifeInsuranceDeduction: spouseNoIncome,
      rmfDeduction: rmf,
      ssfDeduction: ssf,
      govPensionFundDeduct: govPension,
      pvdDeduct: pvd,
      nationSavingsFundDeduct: nsf,
      socialSecurityPremiumDeduct: ssp,
      socialEnterpriseDeduct: se,
      thaiEsgDeduct: esg,
      generalDonationDeduct: genDon,
      eduDonationDeduct: eduDon,
      politicalPartyDonationDeduct: polDon,
      beforeDonationDeduct: beforeDonationSum,
      totalDeduction: total,
    })
  }

  const handleBack = () => {
    navigate(`/tax-income/`)
  }

  const handleNext = () => {
    navigate(`/tax-calculation/`)
  }

  return (
    <div className="flex flex-col min-h-screen font-ibm">
      <Header />
      <div className="flex flex-1">
        <CfpClientSidePanel />
        <div className="flex-1 p-8 space-y-8">
          {/* Steps */}
          <div className="flex items-center justify-center space-x-8">
            {/* Step 1: รายได้ */}
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

            {/* Step 2: ค่าลดหย่อน */}
            <button
              onClick={() => navigate(`/tax-deduction/`)}
              className="flex flex-col items-center focus:outline-none"
            >
              <div className="w-10 h-10 bg-tfpa_gold rounded-full flex items-center justify-center text-white font-bold cursor-pointer">
                2
              </div>
              <span className="font-bold text-tfpa_blue">ค่าลดหย่อน</span>
            </button>

            <div className="h-px bg-gray-300 w-24"></div>

            {/* Step 3: ผลการคำนวณ */}
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
            {/* First golden box: personal and family */}
            <div className="bg-tfpa_gold p-4 mb-4 rounded space-y-4 text-tfpa_blue font-bold">
              <h3>ค่าลดหย่อนภาษีส่วนตัวและครอบครัว</h3>
            </div>

            {/* Personal and Family Deductions */}
            <div className="space-y-4">
              {/* Header for deduction column */}
              <div className="grid grid-cols-8 items-center gap-x-2">
                <div className="col-span-4"></div>
                <div></div>
                <div className="text-right">
                  <span className="text-tfpa_blue font-bold inline-block w-24">
                    ค่าลดหย่อน
                  </span>
                </div>
              </div>

              {/* Marital Status */}
              <div className="grid grid-cols-8 items-center auto-cols-max gap-x-2">
                <span className="text-tfpa_blue font-bold col-span-4">
                  สถานภาพสมรส
                </span>
                <select
                  value={deductionData.maritalStatus}
                  onChange={(e) => {
                    const value =
                      parseInt(e.target.value, 10) || MARITAL_STATUS.SELECT
                    setDeductionData((prev) => ({
                      ...prev,
                      maritalStatus: value,
                    }))
                  }}
                  onBlur={(e) =>
                    handleUpdate(
                      "maritalStatus",
                      parseInt(e.target.value, 10) || MARITAL_STATUS.SELECT
                    )
                  }
                  className="border col-span-1 border-gray-300 rounded px-2 py-1 w-48 focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                >
                  {MARITAL_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="text-right">
                  <span className="text-tfpa_gold font-bold inline-block w-24">
                    {displayValues.maritalStatusDeduction.toLocaleString()}
                  </span>
                  <span className="text-tfpa_blue font-bold"> บาท</span>
                </div>
              </div>

              {/* Child */}
              <div className="grid grid-cols-8 items-center auto-cols-max gap-x-2">
                <span className="text-tfpa_blue font-bold col-span-4">
                  บุตร จำนวน
                </span>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={deductionData.child}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      const value = Math.max(0, Number(e.target.value))
                      setDeductionData((prev) => {
                        const totalChildren =
                          value + prev.child2561 + prev.adoptedChild
                        return {
                          ...prev,
                          child: value,
                          child2561: value > 0 ? prev.child2561 : 0,
                          adoptedChild:
                            totalChildren > 3
                              ? Math.max(0, 3 - value - prev.child2561)
                              : prev.adoptedChild,
                        }
                      })
                    }}
                    onBlur={(e) => handleBlur("child", e.target.value)}
                    onFocus={handleInputFocus}
                    className="border border-gray-300 rounded px-2 py-1 w-16 text-right"
                  />
                  <span className="text-tfpa_blue font-bold ml-2">คน</span>
                </div>
                <div className="text-right">
                  <span className="text-tfpa_gold font-bold inline-block w-24">
                    {displayValues.childDeduction.toLocaleString()}
                  </span>
                  <span className="text-tfpa_blue font-bold"> บาท</span>
                </div>
              </div>

              {/* Child2561 */}
              <div className="grid grid-cols-8 items-center auto-cols-max gap-x-2">
                <span className="text-tfpa_blue font-bold col-span-4">
                  บุตรตั้งแต่คนที่ 2 เป็นต้นไปที่เกิดในหรือหลังปี พ.ศ. 2561
                  จำนวน
                </span>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={deductionData.child2561}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      const value = Math.max(0, Number(e.target.value))
                      setDeductionData((prev) => {
                        const totalChildren =
                          prev.child + value + prev.adoptedChild
                        return {
                          ...prev,
                          child2561: prev.child > 0 ? value : 0,
                          adoptedChild:
                            totalChildren > 3
                              ? Math.max(0, 3 - prev.child - value)
                              : prev.adoptedChild,
                        }
                      })
                    }}
                    onBlur={(e) => handleBlur("child2561", e.target.value)}
                    onFocus={handleInputFocus}
                    className="border border-gray-300 rounded px-2 py-1 w-16 text-right"
                  />
                  <span className="text-tfpa_blue font-bold ml-2">คน</span>
                </div>
                <div className="text-right">
                  <span className="text-tfpa_gold font-bold inline-block w-24">
                    {displayValues.child2561Deduction.toLocaleString()}
                  </span>
                  <span className="text-tfpa_blue font-bold"> บาท</span>
                </div>
              </div>

              {/* Adopted Child */}
              <div className="grid grid-cols-8 items-center auto-cols-max gap-x-2">
                <span className="text-tfpa_blue font-bold col-span-4">
                  บุตรบุญธรรม จำนวน
                </span>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={deductionData.adoptedChild}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      const value = Math.max(0, Number(e.target.value))
                      setDeductionData((prev) => {
                        const totalChildren =
                          prev.child + prev.child2561 + value
                        return {
                          ...prev,
                          adoptedChild:
                            totalChildren > 3
                              ? Math.max(0, 3 - prev.child - prev.child2561)
                              : value,
                        }
                      })
                    }}
                    onBlur={(e) => handleBlur("adoptedChild", e.target.value)}
                    onFocus={handleInputFocus}
                    className="border border-gray-300 rounded px-2 py-1 w-16 text-right"
                  />
                  <span className="text-tfpa_blue font-bold ml-2">คน</span>
                </div>
                <div className="text-right">
                  <span className="text-tfpa_gold font-bold inline-block w-24">
                    {displayValues.adoptedChildDeduction.toLocaleString()}
                  </span>
                  <span className="text-tfpa_blue font-bold"> บาท</span>
                </div>
              </div>

              {/* Parental Care */}
              <div className="grid grid-cols-8 items-center auto-cols-max gap-x-2">
                <span className="text-tfpa_blue font-bold col-span-4">
                  ค่าอุปการะเลี้ยงดูบิดามารดา อายุเกิน60ปี รายได้ไม่เกิน30,000
                  จำนวน
                </span>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={deductionData.parentalCare}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) =>
                      setDeductionData((prev) => ({
                        ...prev,
                        parentalCare: Math.max(0, Number(e.target.value)),
                      }))
                    }
                    onBlur={(e) => handleBlur("parentalCare", e.target.value)}
                    onFocus={handleInputFocus}
                    className="border border-gray-300 rounded px-2 py-1 w-16 text-right"
                  />
                  <span className="text-tfpa_blue font-bold ml-2">คน</span>
                </div>
                <div className="text-right">
                  <span className="text-tfpa_gold font-bold inline-block w-24">
                    {displayValues.parentalCareDeduction.toLocaleString()}
                  </span>
                  <span className="text-tfpa_blue font-bold"> บาท</span>
                </div>
              </div>

              {/* Disabled Care */}
              <div className="grid grid-cols-8 items-center auto-cols-max gap-x-2">
                <span className="text-tfpa_blue font-bold col-span-4">
                  อุปการะเลี้ยงดูคนพิการหรือทุพพลภาพ จำนวน
                </span>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={deductionData.disabledCare}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) =>
                      setDeductionData((prev) => ({
                        ...prev,
                        disabledCare: Math.max(0, Number(e.target.value)),
                      }))
                    }
                    onBlur={(e) => handleBlur("disabledCare", e.target.value)}
                    onFocus={handleInputFocus}
                    className="border border-gray-300 rounded px-2 py-1 w-16 text-right"
                  />
                  <span className="text-tfpa_blue font-bold ml-2">คน</span>
                </div>
                <div className="text-right">
                  <span className="text-tfpa_gold font-bold inline-block w-24">
                    {displayValues.disabledCareDeduction.toLocaleString()}
                  </span>
                  <span className="text-tfpa_blue font-bold"> บาท</span>
                </div>
              </div>

              {/* Prenatal Care */}
              <div className="grid grid-cols-8 items-center auto-cols-max gap-x-2">
                <span className="text-tfpa_blue font-bold col-span-4">
                  ค่าฝากครรภ์และค่าคลอดบุตร
                </span>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={deductionData.prenatalCare}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) =>
                      setDeductionData((prev) => ({
                        ...prev,
                        prenatalCare:
                          Number(e.target.value) > 60000
                            ? 60000
                            : Math.max(0, Number(e.target.value)),
                      }))
                    }
                    onBlur={(e) => handleBlur("prenatalCare", e.target.value)}
                    onFocus={handleInputFocus}
                    className="border border-gray-300 rounded px-2 py-1 w-24 text-right"
                  />
                  <span className="text-tfpa_blue font-bold ml-2">บาท</span>
                </div>
                <div className="text-right">
                  <span className="text-tfpa_gold font-bold inline-block w-24">
                    {displayValues.prenatalCareDeduction.toLocaleString()}
                  </span>
                  <span className="text-tfpa_blue font-bold"> บาท</span>
                </div>
              </div>

              {/* Parent Health Insurance */}
              <div className="grid grid-cols-8 items-center auto-cols-max gap-x-2">
                <span className="text-tfpa_blue font-bold col-span-4">
                  ประกันสุขภาพบิดามารดา
                </span>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={deductionData.parentHealthInsurance}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) =>
                      setDeductionData((prev) => ({
                        ...prev,
                        parentHealthInsurance:
                          Number(e.target.value) > 15000
                            ? 15000
                            : Math.max(0, Number(e.target.value)),
                      }))
                    }
                    onBlur={(e) =>
                      handleBlur("parentHealthInsurance", e.target.value)
                    }
                    onFocus={handleInputFocus}
                    className="border border-gray-300 rounded px-2 py-1 w-24 text-right"
                  />
                  <span className="text-tfpa_blue font-bold ml-2">บาท</span>
                </div>
                <div className="text-right">
                  <span className="text-tfpa_gold font-bold inline-block w-24">
                    {displayValues.parentHealthInsuranceDeduction.toLocaleString()}
                  </span>
                  <span className="text-tfpa_blue font-bold"> บาท</span>
                </div>
              </div>
            </div>

            {/* Second golden box: Insurance, Savings, and Investments */}
            <div className="bg-tfpa_gold p-4 mt-4 mb-4 rounded space-y-4 text-tfpa_blue font-bold">
              <h3>ค่าลดหย่อนภาษีกลุ่มประกัน เงินออม และการลงทุน</h3>
            </div>

            {/* Insurance, Savings, and Investments Deductions */}
            <div className="space-y-4">
              {/* Header for deduction column */}
              <div className="grid grid-cols-8 items-center auto-cols-max gap-x-2">
                <div className="col-span-4"></div>
                <div></div>
                <div className="text-right">
                  <span className="text-tfpa_blue font-bold inline-block w-24">
                    ค่าลดหย่อน
                  </span>
                </div>
              </div>

              {/* Life Insurance */}
              <div className="grid grid-cols-8 items-center auto-cols-max gap-x-2">
                <span className="text-tfpa_blue font-bold col-span-4">
                  เบี้ยประกันชีวิต
                </span>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={deductionData.lifeInsurance}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) =>
                      setDeductionData((prev) => ({
                        ...prev,
                        lifeInsurance:
                          Number(e.target.value) > 100000
                            ? 100000
                            : Math.max(0, Number(e.target.value)),
                      }))
                    }
                    onBlur={(e) => handleBlur("lifeInsurance", e.target.value)}
                    onFocus={handleInputFocus}
                    className="border border-gray-300 rounded px-2 py-1 w-24 text-right"
                  />
                  <span className="text-tfpa_blue font-bold ml-2">บาท</span>
                </div>
                <div className="text-right">
                  <span className="text-tfpa_gold font-bold inline-block w-24">
                    {displayValues.lifeInsuranceDeduction.toLocaleString()}
                  </span>
                  <span className="text-tfpa_blue font-bold"> บาท</span>
                </div>
              </div>

              {/* -เพิ่มส่วน เบี้ยประกันชีวิตแบบบำนาญ */}
              <div className="grid grid-cols-8 items-center auto-cols-max gap-x-2">
                <span className="text-tfpa_blue font-bold col-span-4">
                  -เพิ่มส่วน เบี้ยประกันชีวิตแบบบำนาญ
                </span>
                <div></div>
                <div className="text-right">
                  <span className="text-tfpa_gold font-bold inline-block w-24">
                    {displayValues.portionPensionInsuranceDeduction.toLocaleString()}
                  </span>
                  <span className="text-tfpa_blue font-bold"> บาท</span>
                </div>
              </div>

              {/* Health Insurance */}
              <div className="grid grid-cols-8 items-center auto-cols-max gap-x-2">
                <span className="text-tfpa_blue font-bold col-span-4">
                  เบี้ยประกันสุขภาพ
                </span>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={deductionData.healthInsurance}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      const inputValue = Math.max(0, Number(e.target.value))
                      setDeductionData((prev) => {
                        let healthIns = Math.min(inputValue, 25000)
                        const lifeIns = prev.lifeInsurance || 0
                        if (lifeIns + healthIns > 100000) {
                          healthIns -= lifeIns + healthIns - 100000
                        }
                        return {
                          ...prev,
                          healthInsurance: healthIns,
                        }
                      })
                    }}
                    onBlur={(e) =>
                      handleBlur("healthInsurance", e.target.value)
                    }
                    onFocus={handleInputFocus}
                    className="border border-gray-300 rounded px-2 py-1 w-24 text-right"
                  />
                  <span className="text-tfpa_blue font-bold ml-2">บาท</span>
                </div>
                <div className="text-right">
                  <span className="text-tfpa_gold font-bold inline-block w-24">
                    {displayValues.healthInsuranceDeduction.toLocaleString()}
                  </span>
                  <span className="text-tfpa_blue font-bold"> บาท</span>
                </div>
              </div>

              {/* Pension Insurance */}
              <div className="grid grid-cols-8 items-center auto-cols-max gap-x-2">
                <span className="text-tfpa_blue font-bold col-span-4">
                  เบี้ยประกันชีวิตแบบบำนาญ
                </span>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={deductionData.pensionInsurance}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) =>
                      setDeductionData((prev) => ({
                        ...prev,
                        pensionInsurance:
                          Number(e.target.value) > 300000
                            ? 300000
                            : Math.max(0, Number(e.target.value)),
                      }))
                    }
                    onBlur={(e) =>
                      handleBlur("pensionInsurance", e.target.value)
                    }
                    onFocus={handleInputFocus}
                    className="border border-gray-300 rounded px-2 py-1 w-24 text-right"
                  />
                  <span className="text-tfpa_blue font-bold ml-2">บาท</span>
                </div>
                <div className="text-right">
                  <span className="text-tfpa_gold font-bold inline-block w-24">
                    {displayValues.pensionInsuranceDeduction.toLocaleString()}
                  </span>
                  <span className="text-tfpa_blue font-bold"> บาท</span>
                </div>
              </div>

              {/* Spouse No Income Life Insurance */}
              <div className="grid grid-cols-8 items-center auto-cols-max gap-x-2">
                <span className="text-tfpa_blue font-bold col-span-4">
                  เบี้ยประกันชีวิต คู่สมรสไม่มีรายได้
                </span>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={deductionData.spouseNoIncomeLifeInsurance}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) =>
                      setDeductionData((prev) => ({
                        ...prev,
                        spouseNoIncomeLifeInsurance:
                          Number(e.target.value) > 10000
                            ? 10000
                            : Math.max(0, Number(e.target.value)),
                      }))
                    }
                    onBlur={(e) =>
                      handleBlur("spouseNoIncomeLifeInsurance", e.target.value)
                    }
                    onFocus={handleInputFocus}
                    className="border border-gray-300 rounded px-2 py-1 w-24 text-right"
                  />
                  <span className="text-tfpa_blue font-bold ml-2">บาท</span>
                </div>
                <div className="text-right">
                  <span className="text-tfpa_gold font-bold inline-block w-24">
                    {displayValues.spouseNoIncomeLifeInsuranceDeduction.toLocaleString()}
                  </span>
                  <span className="text-tfpa_blue font-bold"> บาท</span>
                </div>
              </div>

              {/* RMF */}
              <div className="grid grid-cols-8 items-center auto-cols-max gap-x-2">
                <span className="text-tfpa_blue font-bold col-span-4">
                  กองทุนรวมเพื่อการเลี้ยงชีพ (RMF)
                </span>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={deductionData.rmf}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) =>
                      setDeductionData((prev) => ({
                        ...prev,
                        rmf:
                          Number(e.target.value) >
                          Math.min(0.3 * totalIncome, 500000)
                            ? Math.min(0.3 * totalIncome, 500000)
                            : Math.max(0, Number(e.target.value)),
                      }))
                    }
                    onBlur={(e) => handleBlur("rmf", e.target.value)}
                    onFocus={handleInputFocus}
                    className="border border-gray-300 rounded px-2 py-1 w-24 text-right"
                  />
                  <span className="text-tfpa_blue font-bold ml-2">บาท</span>
                </div>
                <div className="text-right">
                  <span className="text-tfpa_gold font-bold inline-block w-24">
                    {displayValues.rmfDeduction.toLocaleString()}
                  </span>
                  <span className="text-tfpa_blue font-bold"> บาท</span>
                </div>
              </div>

              {/* SSF */}
              <div className="grid grid-cols-8 items-center auto-cols-max gap-x-2">
                <span className="text-tfpa_blue font-bold col-span-4">
                  กองทุนรวมเพื่อการออม (SSF)
                </span>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={deductionData.ssf}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) =>
                      setDeductionData((prev) => ({
                        ...prev,
                        ssf:
                          Number(e.target.value) >
                          Math.min(0.3 * totalIncome, 200000)
                            ? Math.min(0.3 * totalIncome, 200000)
                            : Math.max(0, Number(e.target.value)),
                      }))
                    }
                    onBlur={(e) => handleBlur("ssf", e.target.value)}
                    onFocus={handleInputFocus}
                    className="border border-gray-300 rounded px-2 py-1 w-24 text-right"
                  />
                  <span className="text-tfpa_blue font-bold ml-2">บาท</span>
                </div>
                <div className="text-right">
                  <span className="text-tfpa_gold font-bold inline-block w-24">
                    {displayValues.ssfDeduction.toLocaleString()}
                  </span>
                  <span className="text-tfpa_blue font-bold"> บาท</span>
                </div>
              </div>

              {/* Government Pension Fund */}
              <div className="grid grid-cols-8 items-center auto-cols-max gap-x-2">
                <span className="text-tfpa_blue font-bold col-span-4">
                  กองทุนบำเหน็จบำนาญราชการ (กบข.)
                </span>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={deductionData.govPensionFund}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) =>
                      setDeductionData((prev) => ({
                        ...prev,
                        govPensionFund:
                          Number(e.target.value) >
                          Math.min(0.3 * totalIncome, 500000)
                            ? Math.min(0.3 * totalIncome, 500000)
                            : Math.max(0, Number(e.target.value)),
                      }))
                    }
                    onBlur={(e) => handleBlur("govPensionFund", e.target.value)}
                    onFocus={handleInputFocus}
                    className="border border-gray-300 rounded px-2 py-1 w-24 text-right"
                  />
                  <span className="text-tfpa_blue font-bold ml-2">บาท</span>
                </div>
                <div className="text-right">
                  <span className="text-tfpa_gold font-bold inline-block w-24">
                    {displayValues.govPensionFundDeduct.toLocaleString()}
                  </span>
                  <span className="text-tfpa_blue font-bold"> บาท</span>
                </div>
              </div>

              {/* PVD */}
              <div className="grid grid-cols-8 items-center auto-cols-max gap-x-2">
                <span className="text-tfpa_blue font-bold col-span-4">
                  กองทุนสำรองเลี้ยงชีพ (PVD)
                </span>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={deductionData.pvd}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) =>
                      setDeductionData((prev) => ({
                        ...prev,
                        pvd:
                          Number(e.target.value) >
                          Math.min(0.15 * totalIncome, 500000)
                            ? Math.min(0.15 * totalIncome, 500000)
                            : Math.max(0, Number(e.target.value)),
                      }))
                    }
                    onBlur={(e) => handleBlur("pvd", e.target.value)}
                    onFocus={handleInputFocus}
                    className="border border-gray-300 rounded px-2 py-1 w-24 text-right"
                  />
                  <span className="text-tfpa_blue font-bold ml-2">บาท</span>
                </div>
                <div className="text-right">
                  <span className="text-tfpa_gold font-bold inline-block w-24">
                    {displayValues.pvdDeduct.toLocaleString()}
                  </span>
                  <span className="text-tfpa_blue font-bold"> บาท</span>
                </div>
              </div>

              {/* Nation Savings Fund */}
              <div className="grid grid-cols-8 items-center auto-cols-max gap-x-2">
                <span className="text-tfpa_blue font-bold col-span-4">
                  กองทุนการออมแห่งชาติ (กอช.)
                </span>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={deductionData.nationSavingsFund}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) =>
                      setDeductionData((prev) => ({
                        ...prev,
                        nationSavingsFund:
                          Number(e.target.value) > 30000
                            ? 30000
                            : Math.max(0, Number(e.target.value)),
                      }))
                    }
                    onBlur={(e) =>
                      handleBlur("nationSavingsFund", e.target.value)
                    }
                    onFocus={handleInputFocus}
                    className="border border-gray-300 rounded px-2 py-1 w-24 text-right"
                  />
                  <span className="text-tfpa_blue font-bold ml-2">บาท</span>
                </div>
                <div className="text-right">
                  <span className="text-tfpa_gold font-bold inline-block w-24">
                    {displayValues.nationSavingsFundDeduct.toLocaleString()}
                  </span>
                  <span className="text-tfpa_blue font-bold"> บาท</span>
                </div>
              </div>

              {/* Social Security Premium */}
              <div className="grid grid-cols-8 items-center auto-cols-max gap-x-2">
                <span className="text-tfpa_blue font-bold col-span-4">
                  เบี้ยประกันสังคม
                </span>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={deductionData.socialSecurityPremium}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) =>
                      setDeductionData((prev) => ({
                        ...prev,
                        socialSecurityPremium:
                          Number(e.target.value) > 9000
                            ? 9000
                            : Math.max(0, Number(e.target.value)),
                      }))
                    }
                    onBlur={(e) =>
                      handleBlur("socialSecurityPremium", e.target.value)
                    }
                    onFocus={handleInputFocus}
                    className="border border-gray-300 rounded px-2 py-1 w-24 text-right"
                  />
                  <span className="text-tfpa_blue font-bold ml-2">บาท</span>
                </div>
                <div className="text-right">
                  <span className="text-tfpa_gold font-bold inline-block w-24">
                    {displayValues.socialSecurityPremiumDeduct.toLocaleString()}
                  </span>
                  <span className="text-tfpa_blue font-bold"> บาท</span>
                </div>
              </div>

              {/* Social Enterprise */}
              <div className="grid grid-cols-8 items-center auto-cols-max gap-x-2">
                <span className="text-tfpa_blue font-bold col-span-4">
                  เงินลงทุนธุรกิจ social enterprise
                </span>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={deductionData.socialEnterprise}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) =>
                      setDeductionData((prev) => ({
                        ...prev,
                        socialEnterprise:
                          Number(e.target.value) > 100000
                            ? 100000
                            : Math.max(0, Number(e.target.value)),
                      }))
                    }
                    onBlur={(e) =>
                      handleBlur("socialEnterprise", e.target.value)
                    }
                    onFocus={handleInputFocus}
                    className="border border-gray-300 rounded px-2 py-1 w-24 text-right"
                  />
                  <span className="text-tfpa_blue font-bold ml-2">บาท</span>
                </div>
                <div className="text-right">
                  <span className="text-tfpa_gold font-bold inline-block w-24">
                    {displayValues.socialEnterpriseDeduct.toLocaleString()}
                  </span>
                  <span className="text-tfpa_blue font-bold"> บาท</span>
                </div>
              </div>

              {/* Thai ESG */}
              <div className="grid grid-cols-8 items-center auto-cols-max gap-x-2">
                <span className="text-tfpa_blue font-bold col-span-4">
                  กองทุนรวมไทยเพื่อความยั่งยืน (Thai ESG)
                </span>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={deductionData.thaiEsg}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) =>
                      setDeductionData((prev) => ({
                        ...prev,
                        thaiEsg:
                          Number(e.target.value) >
                          Math.min(0.3 * totalIncome, 300000)
                            ? Math.min(0.3 * totalIncome, 300000)
                            : Math.max(0, Number(e.target.value)),
                      }))
                    }
                    onBlur={(e) => handleBlur("thaiEsg", e.target.value)}
                    onFocus={handleInputFocus}
                    className="border border-gray-300 rounded px-2 py-1 w-24 text-right"
                  />
                  <span className="text-tfpa_blue font-bold ml-2">บาท</span>
                </div>
                <div className="text-right">
                  <span className="text-tfpa_gold font-bold inline-block w-24">
                    {displayValues.thaiEsgDeduct.toLocaleString()}
                  </span>
                  <span className="text-tfpa_blue font-bold"> บาท</span>
                </div>
              </div>
            </div>

            {/* Dotted line */}
            <hr className="border-dashed mt-4 mb-4 border-gray-300" />

            {/* Summary Before Donations */}
            <div className="flex justify-end font-bold text-tfpa_blue">
              <div className="flex space-x-2 items-center">
                <span className="text-tfpa_blue font-bold">
                  ค่าลดหย่อนภาษีก่อนกลุ่มเงินบริจาค
                </span>
                <span className="text-tfpa_gold font-bold">
                  {displayValues.beforeDonationDeduct.toLocaleString()}
                </span>
                <span className="text-tfpa_blue font-bold"> บาท</span>
              </div>
            </div>

            {/* Third golden box: Donations */}
            <div className="bg-tfpa_gold p-4 mt-4 mb-4 rounded space-y-4 text-tfpa_blue font-bold">
              <h3>ค่าลดหย่อนภาษีกลุ่มเงินบริจาค</h3>
            </div>

            {/* Donations Deductions */}
            <div className="space-y-4">
              {/* Header for deduction column */}
              <div className="grid grid-cols-8 items-center auto-cols-max gap-x-2">
                <div className="col-span-4"></div>
                <div></div>
                <div className="text-right">
                  <span className="text-tfpa_blue font-bold inline-block w-24">
                    ค่าลดหย่อน
                  </span>
                </div>
              </div>

              {/* General Donation */}
              <div className="grid grid-cols-8 items-center auto-cols-max gap-x-2">
                <span className="text-tfpa_blue font-bold col-span-4">
                  เงินบริจาคทั่วไป
                </span>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={deductionData.generalDonation}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      const val =
                        e.target.value === ""
                          ? ""
                          : parseInt(e.target.value, 10) || 0
                      setDeductionData((prev) => ({
                        ...prev,
                        generalDonation:
                          Number(val) > 0.1 * baseForDonation
                            ? 0.1 * baseForDonation
                            : val,
                      }))
                    }}
                    onBlur={(e) =>
                      handleBlur("generalDonation", e.target.value)
                    }
                    onFocus={handleInputFocus}
                    className="border border-gray-300 rounded px-2 py-1 w-24 text-right"
                  />
                  <span className="text-tfpa_blue font-bold ml-2">บาท</span>
                </div>
                <div className="text-right">
                  <span className="text-tfpa_gold font-bold inline-block w-24">
                    {displayValues.generalDonationDeduct.toLocaleString()}
                  </span>
                  <span className="text-tfpa_blue font-bold"> บาท</span>
                </div>
              </div>

              {/* Educational Donation */}
              <div className="grid grid-cols-8 items-center auto-cols-max gap-x-2">
                <span className="text-tfpa_blue font-bold col-span-4">
                  เงินบริจาคเพื่อการศึกษา การกีฬา การพัฒนาสังคม
                  เพื่อประโยชน์สาธารณะ และรพ.รัฐ
                </span>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={deductionData.eduDonation}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      const val =
                        e.target.value === ""
                          ? ""
                          : parseInt(e.target.value, 10) || 0
                      setDeductionData((prev) => ({
                        ...prev,
                        eduDonation:
                          2 * Number(val) > 0.1 * baseForDonation
                            ? 0.1 * baseForDonation
                            : Number(val),
                      }))
                    }}
                    onBlur={(e) => handleBlur("eduDonation", e.target.value)}
                    onFocus={handleInputFocus}
                    className="border border-gray-300 rounded px-2 py-1 w-24 text-right"
                  />
                  <span className="text-tfpa_blue font-bold ml-2">บาท</span>
                </div>
                <div className="text-right">
                  <span className="text-tfpa_gold font-bold inline-block w-24">
                    {displayValues.eduDonationDeduct.toLocaleString()}
                  </span>
                  <span className="text-tfpa_blue font-bold"> บาท</span>
                </div>
              </div>

              {/* Political Party Donation */}
              <div className="grid grid-cols-8 items-center auto-cols-max gap-x-2">
                <span className="text-tfpa_blue font-bold col-span-4">
                  เงินบริจาคให้พรรคการเมือง
                </span>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={deductionData.politicalPartyDonation}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) =>
                      setDeductionData((prev) => ({
                        ...prev,
                        politicalPartyDonation:
                          Number(e.target.value) > 10000
                            ? 10000
                            : Math.max(0, Number(e.target.value)),
                      }))
                    }
                    onBlur={(e) =>
                      handleBlur("politicalPartyDonation", e.target.value)
                    }
                    onFocus={handleInputFocus}
                    className="border border-gray-300 rounded px-2 py-1 w-24 text-right"
                  />
                  <span className="text-tfpa_blue font-bold ml-2">บาท</span>
                </div>
                <div className="text-right">
                  <span className="text-tfpa_gold font-bold inline-block w-24">
                    {displayValues.politicalPartyDonationDeduct.toLocaleString()}
                  </span>
                  <span className="text-tfpa_blue font-bold"> บาท</span>
                </div>
              </div>
            </div>

            {/* Dotted line */}
            <hr className="border-dashed mt-4 mb-4 border-gray-300" />

            {/* Total Deductions */}
            <div className="flex justify-end mb-4 font-bold text-tfpa_blue">
              <div className="flex space-x-2 items-center">
                <span className="text-tfpa_blue font-bold">ค่าลดหย่อนภาษี</span>
                <span className="text-tfpa_gold font-bold">
                  {displayValues.totalDeduction.toLocaleString()}
                </span>
                <span className="text-tfpa_blue font-bold"> บาท</span>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="bg-tfpa_gold hover:bg-tfpa_gold_hover text-white px-4 py-2 rounded font-bold"
              >
                กลับ
              </button>
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
    </div>
  )
}
