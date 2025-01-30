import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Footer from "../components/footer"
import Header from "../components/cfpHeader"
import CfpClientSidePanel from "../components/cfpClientSidePanel"
import { fetchAndCalculateTaxForClient } from "../utils/taxCalculations"
import { fetchAndCalculateTaxPlanForClient } from "../utils/taxPlanCalculations"
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

export default function TaxCalculationPage() {
  const [clientUuid] = useState(localStorage.getItem("clientUuid") || "")
  const navigate = useNavigate()

  // ------------------- Tax Calculation States -------------------
  const [oldTaxToPay, setOldTaxToPay] = useState(0)
  const [newTaxToPay, setNewTaxToPay] = useState(0)
  const [taxSaved, setTaxSaved] = useState(0)
  const [totalIncome, setTotalIncome] = useState(0)
  const [incomeAfterDeductions, setIncomeAfterDeductions] = useState(0)

  // ------------------- Deductions States -------------------
  const [maxDeductions, setMaxDeductions] = useState({
    rmf: 0,
    ssf: 0,
    govPensionFund: 0,
    pvd: 0,
    nationSavingsFund: 0,
    pensionInsurance: 0,
    total: 500000,
  })

  const [alreadyUsedDeductions, setAlreadyUsedDeductions] = useState({
    rmf: 0,
    ssf: 0,
    govPensionFund: 0,
    pvd: 0,
    nationSavingsFund: 0,
    pensionInsurance: 0,
    total: 0,
  })

  const [remainingDeductions, setRemainingDeductions] = useState({
    rmf: 0,
    ssf: 0,
    govPensionFund: 0,
    pvd: 0,
    nationSavingsFund: 0,
    pensionInsurance: 0,
    total: 0,
  })

  // ---------- Final numeric investments (saved on server) ----------
  const [investments, setInvestments] = useState({
    rmf: 0,
    ssf: 0,
    govPensionFund: 0,
    pvd: 0,
    nationSavingsFund: 0,
    pensionInsurance: 0,
    total: 0,
  })

  // ---------- Draft states for user input (strings) ----------
  // We'll only parse these onBlur
  const [draftInvestments, setDraftInvestments] = useState({
    rmf: "0",
    ssf: "0",
    govPensionFund: "0",
    pvd: "0",
    nationSavingsFund: "0",
    pensionInsurance: "0",
  })

  // Once the initial data is loaded from the server, set this to true
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)

  useEffect(() => {
    if (!clientUuid) return
    fetchData()
  }, [clientUuid])

  const fetchData = async () => {
    try {
      // 1) Fetch basic tax results
      const taxResult = await fetchAndCalculateTaxForClient(clientUuid)
      setOldTaxToPay(taxResult.taxToPay)
      setTotalIncome(taxResult.totalIncome)
      setIncomeAfterDeductions(taxResult.incomeAfterDeductions)

      // 2) Fetch tax deduction data
      const taxDeductionsRes = await fetch(
        `${import.meta.env.VITE_API_KEY}api/taxdeduction/${clientUuid}`
      )
      let taxDeductionsData = null
      if (taxDeductionsRes.ok) {
        taxDeductionsData = await taxDeductionsRes.json()
      }

      // Compute your maximum/used/remaining deductions
      const lifeInsurance = taxDeductionsData?.lifeInsurance || 0
      const healthInsurance = taxDeductionsData?.healthInsurance || 0
      const insuranceSum = lifeInsurance + healthInsurance

      const calculatedMaxDeductions = calculateMaxDeductions(
        taxResult.totalIncome,
        insuranceSum
      )
      setMaxDeductions(calculatedMaxDeductions)

      const calculatedAlreadyUsed =
        calculateAlreadyUsedDeductions(taxDeductionsData)
      setAlreadyUsedDeductions(calculatedAlreadyUsed)

      const calculatedRemaining = calculateRemainingDeductions(
        calculatedMaxDeductions,
        calculatedAlreadyUsed
      )
      setRemainingDeductions(calculatedRemaining)

      // 3) Fetch existing tax plan
      const taxPlanRes = await fetch(
        `${import.meta.env.VITE_API_KEY}api/taxplan/${clientUuid}`
      )
      let tempInvestments = {
        rmf: 0,
        ssf: 0,
        govPensionFund: 0,
        pvd: 0,
        nationSavingsFund: 0,
        pensionInsurance: 0,
        total: 0,
      }

      if (taxPlanRes.ok) {
        const taxPlanData = await taxPlanRes.json()
        tempInvestments = {
          rmf: taxPlanData.investRmf || 0,
          ssf: taxPlanData.investSsf || 0,
          govPensionFund: taxPlanData.investGovPensionFund || 0,
          pvd: taxPlanData.investPvd || 0,
          nationSavingsFund: taxPlanData.investNationSavingsFund || 0,
          pensionInsurance: taxPlanData.investPensionInsurance || 0,
          total:
            (taxPlanData.investRmf || 0) +
            (taxPlanData.investSsf || 0) +
            (taxPlanData.investGovPensionFund || 0) +
            (taxPlanData.investPvd || 0) +
            (taxPlanData.investNationSavingsFund || 0) +
            (taxPlanData.investPensionInsurance || 0),
        }
      }

      // Set final numeric investments
      setInvestments(tempInvestments)

      // Also set up the draft states from what we got on the server
      setDraftInvestments({
        rmf: String(tempInvestments.rmf),
        ssf: String(tempInvestments.ssf),
        govPensionFund: String(tempInvestments.govPensionFund),
        pvd: String(tempInvestments.pvd),
        nationSavingsFund: String(tempInvestments.nationSavingsFund),
        pensionInsurance: String(tempInvestments.pensionInsurance),
      })

      // 4) Recalculate newTax with existing plan
      const totalUsedDeductions = Math.min(
        calculatedAlreadyUsed.total + tempInvestments.total,
        500000
      )
      const newTaxResult = await fetchAndCalculateTaxPlanForClient(
        clientUuid,
        totalUsedDeductions
      )
      setNewTaxToPay(newTaxResult.taxToPay)
      setTaxSaved(taxResult.taxToPay - newTaxResult.taxToPay)

      // Mark initial load complete
      setInitialLoadComplete(true)
    } catch (error) {
      console.error(error)
    }
  }

  // ---- Calculation helpers (unchanged from your code) ----
  const calculateMaxDeductions = (totalIncome, insuranceSum) => {
    const rmfMax = Math.min(0.3 * totalIncome, 500000)
    const ssfMax = Math.min(0.3 * totalIncome, 200000)
    const govPensionMax = Math.min(0.3 * totalIncome, 500000)
    const pvdMax = Math.min(0.15 * totalIncome, 500000)
    const nationSavingsMax = 30000
    const pensionInsuranceMax = Math.min(0.15 * totalIncome, 200000)

    const individualTotal =
      rmfMax +
      ssfMax +
      govPensionMax +
      pvdMax +
      nationSavingsMax +
      pensionInsuranceMax

    const overallTotal = Math.min(individualTotal, 500000)

    return {
      rmf: rmfMax,
      ssf: ssfMax,
      govPensionFund: govPensionMax,
      pvd: pvdMax,
      nationSavingsFund: nationSavingsMax,
      pensionInsurance: pensionInsuranceMax,
      total: overallTotal,
    }
  }

  const calculateAlreadyUsedDeductions = (taxDeductionsData) => {
    if (!taxDeductionsData) {
      return {
        rmf: 0,
        ssf: 0,
        govPensionFund: 0,
        pvd: 0,
        nationSavingsFund: 0,
        pensionInsurance: 0,
        total: 0,
      }
    }

    let portion_pensionIns = 0
    if (
      taxDeductionsData.lifeInsurance + taxDeductionsData.healthInsurance <
      100000
    ) {
      if (
        100000 -
          (taxDeductionsData.lifeInsurance +
            taxDeductionsData.healthInsurance) >
        taxDeductionsData.pensionInsurance
      ) {
        portion_pensionIns = taxDeductionsData.pensionInsurance
      } else {
        portion_pensionIns =
          100000 -
          (taxDeductionsData.lifeInsurance + taxDeductionsData.healthInsurance)
      }
    } else {
      portion_pensionIns = 0
    }

    const used = {
      rmf: taxDeductionsData.rmf || 0,
      ssf: taxDeductionsData.ssf || 0,
      govPensionFund: taxDeductionsData.govPensionFund || 0,
      pvd: taxDeductionsData.pvd || 0,
      nationSavingsFund: taxDeductionsData.nationSavingsFund || 0,
      pensionInsurance:
        (taxDeductionsData.pensionInsurance || 0) - portion_pensionIns,
      total:
        (taxDeductionsData.rmf || 0) +
        (taxDeductionsData.ssf || 0) +
        (taxDeductionsData.govPensionFund || 0) +
        (taxDeductionsData.pvd || 0) +
        (taxDeductionsData.nationSavingsFund || 0) +
        ((taxDeductionsData.pensionInsurance || 0) - portion_pensionIns),
    }

    return used
  }

  const calculateRemainingDeductions = (max, used) => {
    return {
      rmf: Math.max(max.rmf - used.rmf, 0),
      ssf: Math.max(max.ssf - used.ssf, 0),
      govPensionFund: Math.max(max.govPensionFund - used.govPensionFund, 0),
      pvd: Math.max(max.pvd - used.pvd, 0),
      nationSavingsFund: Math.max(
        max.nationSavingsFund - used.nationSavingsFund,
        0
      ),
      pensionInsurance: Math.max(
        max.pensionInsurance - used.pensionInsurance,
        0
      ),
      total: Math.min(500000, Math.max(max.total - used.total, 0)),
    }
  }

  // ---------- onChange: Just update the local "draft" text ----------
  const handleDraftChange = (e) => {
    const { name, value } = e.target
    setDraftInvestments((prev) => ({
      ...prev,
      [name]: value, // raw string
    }))
  }

  // ---------- onBlur: Parse, cap, update numeric investments, then save ----------
  const handleInvestmentBlur = async (e) => {
    const { name, value } = e.target

    // 1) parse user input
    let numericValue = Number(value) || 0

    // 2) cap against remaining if you want
    const cap = remainingDeductions[name] || 0
    if (numericValue > cap) {
      numericValue = cap
    }

    // 3) update local numeric investments
    setInvestments((prev) => {
      const updated = { ...prev, [name]: numericValue }
      updated.total =
        (updated.rmf || 0) +
        (updated.ssf || 0) +
        (updated.govPensionFund || 0) +
        (updated.pvd || 0) +
        (updated.nationSavingsFund || 0) +
        (updated.pensionInsurance || 0)
      return updated
    })

    // Also reflect the final numeric in the draft
    setDraftInvestments((prev) => ({
      ...prev,
      [name]: String(numericValue),
    }))

    // 4) Save to server for that one field
    await saveInvestmentsField(name, numericValue)
  }

  // This saves one field to the server
  const saveInvestmentsField = async (fieldName, value) => {
    try {
      // Build the payload using the final local "investments" state
      // BUT override the single field with the new 'value'.
      const payload = {
        clientUuid: clientUuid,
        investRmf: fieldName === "rmf" ? value : investments.rmf,
        investSsf: fieldName === "ssf" ? value : investments.ssf,
        investGovPensionFund:
          fieldName === "govPensionFund" ? value : investments.govPensionFund,
        investPvd: fieldName === "pvd" ? value : investments.pvd,
        investNationSavingsFund:
          fieldName === "nationSavingsFund"
            ? value
            : investments.nationSavingsFund,
        investPensionInsurance:
          fieldName === "pensionInsurance"
            ? value
            : investments.pensionInsurance,
      }

      // Check if the tax plan record exists
      const taxPlanRes = await fetch(
        `${import.meta.env.VITE_API_KEY}api/taxplan/${clientUuid}`
      )

      if (taxPlanRes.ok) {
        // update
        const updateRes = await fetch(
          `${import.meta.env.VITE_API_KEY}api/taxplan/${clientUuid}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        )
        if (!updateRes.ok) throw new Error("Failed to update tax plan")
      } else {
        // create
        const createRes = await fetch(
          `${import.meta.env.VITE_API_KEY}api/taxplan`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        )
        if (!createRes.ok) throw new Error("Failed to create tax plan")
      }

      // Importantly: we do NOT re-fetch from server here, to avoid stutter.
      // We rely on our local state + the effect below to keep the UI updated.
    } catch (err) {
      console.error(err)
    }
  }

  // ---------- Recalculate newTax whenever "investments" changes ----------
  useEffect(() => {
    if (!initialLoadComplete) return

    const recalcNewTax = async () => {
      try {
        const totalUsedDeductions = Math.min(
          alreadyUsedDeductions.total + investments.total,
          500000
        )
        const newTaxResult = await fetchAndCalculateTaxPlanForClient(
          clientUuid,
          totalUsedDeductions
        )
        setNewTaxToPay(newTaxResult.taxToPay)
        setTaxSaved(oldTaxToPay - newTaxResult.taxToPay)
      } catch (error) {
        console.error(error)
      }
    }

    recalcNewTax()
  }, [
    investments,
    alreadyUsedDeductions,
    oldTaxToPay,
    initialLoadComplete,
    clientUuid,
  ])

  // ---------- UI Handlers ----------
  const handleBack = () => {
    navigate(`/tax-deduction/`)
  }

  const handleInputFocus = (e) => {
    e.target.select()
  }

  // ---------- Render ----------
  return (
    <div className="flex flex-col min-h-screen font-ibm">
      <Header />
      <div className="flex flex-1">
        <CfpClientSidePanel />

        <div className="flex-1 p-8 space-y-8 font-bold">
          {/* Steps Indicator */}
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
              className="flex flex-col items-center focus:outline-none"
            >
              <div className="w-10 h-10 bg-tfpa_gold rounded-full flex items-center justify-center text-white font-bold cursor-pointer">
                2
              </div>
              <span className="font-bold text-tfpa_blue">ค่าลดหย่อน</span>
            </button>

            <div className="h-px bg-gray-300 w-24"></div>

            <button
              onClick={() => navigate(`/tax-calculation/`)}
              className="flex flex-col items-center focus:outline-none"
            >
              <div className="w-10 h-10 bg-tfpa_gold rounded-full flex items-center justify-center text-white font-bold cursor-pointer">
                3
              </div>
              <span className="font-bold text-tfpa_blue">ผลการคำนวณ</span>
            </button>
          </div>

          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            {/* Tax Calculation Results */}
            <h2 className="text-xl font-bold text-tfpa_blue bg-tfpa_gold p-2 rounded">
              ผลการคำนวณภาษี
            </h2>

            <div className="flex flex-col mt-4 mb-4 md:flex-row p-4 space-y-4 md:space-y-0 md:space-x-8">
              {/* Left - ภาษีที่ต้องจ่าย */}
              <div className="flex bg-tfpa_gold_pale text-3xl p-4 rounded-xl">
                <div className="flex items-center space-x-2">
                  <span className="text-tfpa_blue font-bold">
                    ภาษีที่ต้องจ่าย:
                  </span>
                  <span className="text-red-500 font-bold">
                    {oldTaxToPay.toLocaleString()}
                  </span>
                  <span className="text-tfpa_blue font-bold">บาท</span>
                </div>
              </div>

              {/* Right - รายได้ทั้งปี / รายได้สุทธิ */}
              <div className="flex bg-white p-4 rounded shadow">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-tfpa_blue font-bold">
                      รายได้ทั้งปี:
                    </span>
                    <span className="text-tfpa_gold font-bold">
                      {totalIncome.toLocaleString()}
                    </span>
                    <span className="text-tfpa_blue font-bold">บาท</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-tfpa_blue font-bold">
                      รายได้สุทธิ:
                    </span>
                    <span className="text-tfpa_gold font-bold">
                      {incomeAfterDeductions.toLocaleString()}
                    </span>
                    <span className="text-tfpa_blue font-bold">บาท</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tax Planning Section */}
            <h2 className="text-xl font-bold mt-4 mb-4 text-tfpa_blue bg-tfpa_gold p-2 rounded">
              วางแผนลดหย่อนภาษีเพิ่มเติม
            </h2>

            <div className="overflow-x-auto mt-4 mb-4">
              <table className="min-w-full border mt-4 mb-4">
                <thead>
                  <tr className="bg-tfpa_blue text-white">
                    <th className="border px-4 py-2">ประเภท</th>
                    <th className="border px-4 py-2">RMF</th>
                    <th className="border px-4 py-2">SSF</th>
                    <th className="border px-4 py-2">กบข.</th>
                    <th className="border px-4 py-2">PVD</th>
                    <th className="border px-4 py-2">กอช</th>
                    <th className="border px-4 py-2">ประกันบำนาญ</th>
                    <th className="border px-4 py-2 bg-tfpa_gold text-white">
                      รวมทั้งสิ้นไม่เกิน
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* สูงสุดตามสิทธิ */}
                  <tr>
                    <td className="border px-4 py-2 text-tfpa_blue">
                      สูงสุดตามสิทธิ*
                    </td>
                    <td className="border px-4 py-2 text-tfpa_gold text-center">
                      {maxDeductions.rmf.toLocaleString()}
                    </td>
                    <td className="border px-4 py-2 text-tfpa_gold text-center">
                      {maxDeductions.ssf.toLocaleString()}
                    </td>
                    <td className="border px-4 py-2 text-tfpa_gold text-center">
                      {maxDeductions.govPensionFund.toLocaleString()}
                    </td>
                    <td className="border px-4 py-2 text-tfpa_gold text-center">
                      {maxDeductions.pvd.toLocaleString()}
                    </td>
                    <td className="border px-4 py-2 text-tfpa_gold text-center">
                      {maxDeductions.nationSavingsFund.toLocaleString()}
                    </td>
                    <td className="border px-4 py-2 text-tfpa_gold text-center">
                      {maxDeductions.pensionInsurance.toLocaleString()}
                    </td>
                    <td className="border px-4 py-2 bg-tfpa_gold text-white text-center">
                      500,000
                    </td>
                  </tr>

                  {/* ใช้สิทธิไปแล้ว */}
                  <tr>
                    <td className="border px-4 py-2 text-tfpa_blue">
                      ใช้สิทธิไปแล้ว
                    </td>
                    <td className="border px-4 py-2 text-tfpa_gold text-center">
                      {alreadyUsedDeductions.rmf.toLocaleString()}
                    </td>
                    <td className="border px-4 py-2 text-tfpa_gold text-center">
                      {alreadyUsedDeductions.ssf.toLocaleString()}
                    </td>
                    <td className="border px-4 py-2 text-tfpa_gold text-center">
                      {alreadyUsedDeductions.govPensionFund.toLocaleString()}
                    </td>
                    <td className="border px-4 py-2 text-tfpa_gold text-center">
                      {alreadyUsedDeductions.pvd.toLocaleString()}
                    </td>
                    <td className="border px-4 py-2 text-tfpa_gold text-center">
                      {alreadyUsedDeductions.nationSavingsFund.toLocaleString()}
                    </td>
                    <td className="border px-4 py-2 text-tfpa_gold text-center">
                      {alreadyUsedDeductions.pensionInsurance.toLocaleString()}
                    </td>
                    <td className="border px-4 py-2 bg-tfpa_gold text-white text-center">
                      {alreadyUsedDeductions.total.toLocaleString()}
                    </td>
                  </tr>

                  {/* ใช้สิทธิเพิ่มได้อีก */}
                  <tr>
                    <td className="border px-4 py-2 text-tfpa_blue">
                      ใช้สิทธิเพิ่มได้อีก
                    </td>
                    <td className="border px-4 py-2 text-tfpa_gold text-center">
                      {remainingDeductions.rmf.toLocaleString()}
                    </td>
                    <td className="border px-4 py-2 text-tfpa_gold text-center">
                      {remainingDeductions.ssf.toLocaleString()}
                    </td>
                    <td className="border px-4 py-2 text-tfpa_gold text-center">
                      {remainingDeductions.govPensionFund.toLocaleString()}
                    </td>
                    <td className="border px-4 py-2 text-tfpa_gold text-center">
                      {remainingDeductions.pvd.toLocaleString()}
                    </td>
                    <td className="border px-4 py-2 text-tfpa_gold text-center">
                      {remainingDeductions.nationSavingsFund.toLocaleString()}
                    </td>
                    <td className="border px-4 py-2 text-tfpa_gold text-center">
                      {remainingDeductions.pensionInsurance.toLocaleString()}
                    </td>
                    <td className="border px-4 py-2 bg-tfpa_gold text-white text-center">
                      {remainingDeductions.total.toLocaleString()}
                    </td>
                  </tr>

                  {/* Separator */}
                  <tr>
                    <td colSpan="8" className="border-t border-dashed"></td>
                  </tr>

                  {/* รวม label above the last column */}
                  <tr>
                    <td className="border px-4 py-2"></td>
                    <td className="border px-4 py-2"></td>
                    <td className="border px-4 py-2"></td>
                    <td className="border px-4 py-2"></td>
                    <td className="border px-4 py-2"></td>
                    <td className="border px-4 py-2"></td>
                    <td className="border px-4 py-2"></td>
                    <td className="border px-4 py-2 font-bold text-white bg-tfpa_gold text-center">
                      รวมทั้งสิ้น
                    </td>
                  </tr>

                  {/* จำนวนเงินที่จะลงทุน */}
                  <tr className="space-y-4">
                    <td className="border px-4 py-2 text-tfpa_gold">
                      จำนวนเงินที่จะลงทุน
                    </td>
                    {/* RMF */}
                    <td className="border px-4 py-2 text-center">
                      <input
                        type="number"
                        name="rmf"
                        value={draftInvestments.rmf} // <-- user's typed text
                        onChange={handleDraftChange}
                        onBlur={handleInvestmentBlur}
                        onFocus={handleInputFocus}
                        className="w-28 px-2 py-1 border rounded"
                        min="0"
                      />
                    </td>
                    {/* SSF */}
                    <td className="border px-4 py-2 text-center">
                      <input
                        type="number"
                        name="ssf"
                        value={draftInvestments.ssf}
                        onChange={handleDraftChange}
                        onBlur={handleInvestmentBlur}
                        onFocus={handleInputFocus}
                        className="w-28 px-2 py-1 border rounded"
                        min="0"
                      />
                    </td>
                    {/* Gov Pension Fund */}
                    <td className="border px-4 py-2 text-center">
                      <input
                        type="number"
                        name="govPensionFund"
                        value={draftInvestments.govPensionFund}
                        onChange={handleDraftChange}
                        onBlur={handleInvestmentBlur}
                        onFocus={handleInputFocus}
                        className="w-28 px-2 py-1 border rounded"
                        min="0"
                      />
                    </td>
                    {/* PVD */}
                    <td className="border px-4 py-2 text-center">
                      <input
                        type="number"
                        name="pvd"
                        value={draftInvestments.pvd}
                        onChange={handleDraftChange}
                        onBlur={handleInvestmentBlur}
                        onFocus={handleInputFocus}
                        className="w-28 px-2 py-1 border rounded"
                        min="0"
                      />
                    </td>
                    {/* กอช */}
                    <td className="border px-4 py-2 text-center">
                      <input
                        type="number"
                        name="nationSavingsFund"
                        value={draftInvestments.nationSavingsFund}
                        onChange={handleDraftChange}
                        onBlur={handleInvestmentBlur}
                        onFocus={handleInputFocus}
                        className="w-28 px-2 py-1 border rounded"
                        min="0"
                      />
                    </td>
                    {/* ประกันบำนาญ */}
                    <td className="border px-4 py-2 text-center">
                      <input
                        type="number"
                        name="pensionInsurance"
                        value={draftInvestments.pensionInsurance}
                        onChange={handleDraftChange}
                        onBlur={handleInvestmentBlur}
                        onFocus={handleInputFocus}
                        className="w-28 px-2 py-1 border rounded"
                        min="0"
                      />
                    </td>
                    {/* Final total (read-only) */}
                    <td className="border px-4 py-2 bg-tfpa_gold text-white text-center">
                      {investments.total.toLocaleString()}
                    </td>
                  </tr>

                  {/* จำนวนเงินที่ใช้สิทธิทั้งหมด (หลังวางแผน) */}
                  <tr>
                    <td className="border px-4 py-2 text-tfpa_gold">
                      จำนวนเงินที่ใช้สิทธิทั้งหมด (หลังวางแผน)
                    </td>
                    <td className="border px-4 py-2 text-tfpa_gold text-center">
                      {(
                        alreadyUsedDeductions.rmf + investments.rmf
                      ).toLocaleString()}
                    </td>
                    <td className="border px-4 py-2 text-tfpa_gold text-center">
                      {(
                        alreadyUsedDeductions.ssf + investments.ssf
                      ).toLocaleString()}
                    </td>
                    <td className="border px-4 py-2 text-tfpa_gold text-center">
                      {(
                        alreadyUsedDeductions.govPensionFund +
                        investments.govPensionFund
                      ).toLocaleString()}
                    </td>
                    <td className="border px-4 py-2 text-tfpa_gold text-center">
                      {(
                        alreadyUsedDeductions.pvd + investments.pvd
                      ).toLocaleString()}
                    </td>
                    <td className="border px-4 py-2 text-tfpa_gold text-center">
                      {(
                        alreadyUsedDeductions.nationSavingsFund +
                        investments.nationSavingsFund
                      ).toLocaleString()}
                    </td>
                    <td className="border px-4 py-2 text-tfpa_gold text-center">
                      {(
                        alreadyUsedDeductions.pensionInsurance +
                        investments.pensionInsurance
                      ).toLocaleString()}
                    </td>
                    <td className="border px-4 py-2 bg-tfpa_gold text-white text-center">
                      {Math.min(
                        alreadyUsedDeductions.total + investments.total,
                        500000
                      ).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Summary of Tax Changes */}
            <div className="p-4 rounded space-y-2 text-tfpa_blue font-bold border-t border-dashed">
              <div className="flex items-center space-x-2 text-lg">
                <span>ก่อนวางแผนเสียภาษี:</span>
                <span className="text-tfpa_gold">
                  {oldTaxToPay.toLocaleString()} บาท
                </span>
              </div>
              <div className="flex items-center space-x-2 text-lg">
                <span>หลังวางแผนเสียภาษี:</span>
                {initialLoadComplete ? (
                  <span className="text-tfpa_gold">
                    {newTaxToPay.toLocaleString()} บาท
                  </span>
                ) : (
                  <span className="text-gray-400">--</span>
                )}
              </div>
              <div className="flex items-center space-x-2 text-lg">
                <span>ประหยัดภาษี:</span>
                {initialLoadComplete ? (
                  <span className="text-tfpa_gold">
                    {taxSaved.toLocaleString()} บาท
                  </span>
                ) : (
                  <span className="text-gray-400">--</span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end">
              <button
                onClick={handleBack}
                className="bg-tfpa_gold hover:bg-tfpa_gold_hover text-white px-4 py-2 rounded font-bold"
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
