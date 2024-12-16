import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Footer from "../components/footer"
import Header from "../components/header"
import ClientBluePanel from "../components/clientBluePanel"
import { fetchAndCalculateTaxForClient } from "../utils/taxCalculations"

export default function TaxDeductionPage() {
  const { clientId, cfpId } = useParams()
  const navigate = useNavigate()
  const [baseForDonation, setBaseForDonation] = useState(0)

  const [deductionData, setDeductionData] = useState({
    maritalStatus: "",
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
  }, [clientId])

  useEffect(() => {
    if (exists && totalIncome > 0) {
      calculateDeductions(deductionData, totalIncome)
    }
  }, [deductionData, totalIncome, expenseDeductions, exists])

  const fetchDeduction = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/taxdeduction/${clientId}`
      )
      if (res.ok) {
        const data = await res.json()
        setDeductionData(data)
        setExists(true) // Mark the state as existing
      } else {
        setExists(false)
      }

      const result = await fetchAndCalculateTaxForClient(clientId)
      setTotalIncome(result.totalIncome)
      setExpenseDeductions(result.totalExpenseDeductions)
    } catch (error) {
      console.error(error)
    }
  }

  const refreshCalculations = async (newData = deductionData) => {
    // Re-fetch totalIncome and expenseDeductions
    try {
      const result = await fetchAndCalculateTaxForClient(clientId)
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
      clientId: parseInt(clientId),
    }

    setDeductionData(updated)

    const method = exists ? "PUT" : "POST"
    const url = exists
      ? `http://localhost:8080/api/taxdeduction/${clientId}`
      : `http://localhost:8080/api/taxdeduction`

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

  function calculateDeductions(data, totalInc) {
    let msDeduct = 0
    if (
      data.maritalStatus === "โสด" ||
      data.maritalStatus === "คู่สมรสมีเงินได้แยกยื่นแบบ"
    ) {
      msDeduct = 60000
    } else if (
      data.maritalStatus === "คู่สมรสมีเงินได้ยื่นรวม" ||
      data.maritalStatus === "คู่สมรสไม่มีเงินได้"
    ) {
      msDeduct = 120000
    }

    const cDeduct = data.child * 30000
    const c2561Deduct = data.child > 0 ? data.child2561 * 60000 : 0
    const legalChildren = data.child + data.child2561
    const adoptedDeduct =
      legalChildren < 3
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

    let pensionIns = Math.min(data.pensionInsurance, 0.15 * totalInc, 200000)
    if (lifeIns + healthIns < 100000) {
      pensionIns = 0
    }
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
    navigate(`/${cfpId}/tax-income/${clientId}`)
  }

  const handleNext = () => {
    navigate(`/${cfpId}/tax-calculation/${clientId}`)
  }

  return (
    <div className="flex flex-col min-h-screen font-ibm">
      <Header />
      <div className="flex flex-1">
        <ClientBluePanel />
        <div className="flex-1 p-8 space-y-8">
          {/* Steps */}
          <div className="flex items-center justify-center space-x-8">
            <div className="flex flex-col items-center text-gray-400">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <span className="font-bold">รายได้</span>
            </div>
            <div className="h-px bg-gray-300 w-24"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-tfpa_gold rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <span className="font-bold text-tfpa_blue">ค่าลดหย่อน</span>
            </div>
            <div className="h-px bg-gray-300 w-24"></div>
            <div className="flex flex-col items-center text-gray-400">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <span className="font-bold">ผลการคำนวณ</span>
            </div>
          </div>

          {/* First golden box: personal and family */}
          <div className="bg-tfpa_gold p-4 rounded space-y-4 text-tfpa_blue font-bold">
            <h3 className="font-bold">ค่าลดหย่อนภาษีส่วนตัวและครอบครัว</h3>
          </div>

          <div className="text-tfpa_blue font-bold">
            <div>
              <span>สถานภาพสมรส</span>
              <select
                value={deductionData.maritalStatus}
                onChange={(e) => {
                  setDeductionData((prev) => ({
                    ...prev,
                    maritalStatus: e.target.value,
                  }))
                }}
                onBlur={(e) => handleUpdate("maritalStatus", e.target.value)}
                className="border p-1 ml-2 mr-2"
              >
                <option value="">เลือก</option>
                <option value="โสด">โสด</option>
                <option value="คู่สมรสมีเงินได้แยกยื่นแบบ">
                  คู่สมรสมีเงินได้แยกยื่นแบบ
                </option>
                <option value="คู่สมรสมีเงินได้ยื่นรวม">
                  คู่สมรสมีเงินได้ยื่นรวม
                </option>
                <option value="คู่สมรสไม่มีเงินได้">คู่สมรสไม่มีเงินได้</option>
              </select>
              <span className="text-tfpa_gold">
                {displayValues.maritalStatusDeduction.toLocaleString()}
              </span>
              <span className="text-tfpa_blue"> บาท</span>
            </div>

            <div className="flex items-center space-x-2">
              <span>บุตร</span>
              <span>จำนวน</span>
              <input
                type="number"
                value={deductionData.child}
                onChange={(e) => {
                  const value = Math.max(0, Number(e.target.value))
                  setDeductionData((prev) => {
                    const totalChildren =
                      value + prev.child2561 + prev.adoptedChild
                    return {
                      ...prev,
                      child: e.target.value,
                      child2561: value > 0 ? prev.child2561 : 0,
                      adoptedChild:
                        totalChildren > 3
                          ? Math.max(0, 3 - value - prev.child2561)
                          : prev.adoptedChild,
                    }
                  })
                }}
                onBlur={(e) => handleBlur("child", e.target.value)}
                className="border p-1 w-16 text-right"
              />
              <span>คน</span>
              <span className="text-tfpa_gold">
                {displayValues.childDeduction.toLocaleString()}
              </span>
              <span className="text-tfpa_blue"> บาท</span>
            </div>

            <div className="flex items-center space-x-2">
              <span>
                บุตรตั้งแต่คนที่ 2 เป็นต้นไปที่เกิดในหรือหลังปี พ.ศ. 2561
              </span>
              <span>จำนวน</span>
              <input
                type="number"
                value={deductionData.child2561}
                onChange={(e) => {
                  const value = Math.max(0, Number(e.target.value)) // Ensure non-negative
                  setDeductionData((prev) => {
                    const totalChildren = prev.child + value + prev.adoptedChild
                    return {
                      ...prev,
                      child2561: prev.child > 0 ? e.target.value : 0,
                      adoptedChild:
                        totalChildren > 3
                          ? Math.max(0, 3 - prev.child - value) // Adjust adopted children
                          : prev.adoptedChild,
                    }
                  })
                }}
                onBlur={(e) => handleBlur("child2561", e.target.value)}
                className="border p-1 w-16 text-right"
              />
              <span>คน</span>
              <span className="text-tfpa_gold">
                {displayValues.child2561Deduction.toLocaleString()}
              </span>
              <span className="text-tfpa_blue"> บาท</span>
            </div>

            <div className="flex items-center space-x-2">
              <span>บุตรบุญธรรม จำนวน</span>
              <input
                type="number"
                value={deductionData.adoptedChild}
                onChange={(e) => {
                  const value = Math.max(0, Number(e.target.value)) // Ensure non-negative
                  setDeductionData((prev) => {
                    const totalChildren = prev.child + prev.child2561 + value
                    return {
                      ...prev,
                      adoptedChild:
                        totalChildren > 3
                          ? Math.max(0, 3 - prev.child - prev.child2561) // Adjust adopted children
                          : e.target.value,
                    }
                  })
                }}
                onBlur={(e) => handleBlur("adoptedChild", e.target.value)}
                className="border p-1 w-16 text-right"
              />
              <span>คน</span>
              <span className="text-tfpa_gold">
                {displayValues.adoptedChildDeduction.toLocaleString()}
              </span>
              <span className="text-tfpa_blue"> บาท</span>
            </div>

            <div className="flex items-center space-x-2">
              <span>
                ค่าอุปการะเลี้ยงดูบิดามารดา อายุเกิน60ปี รายได้ไม่เกิน30,000
                จำนวน
              </span>
              <input
                type="number"
                value={deductionData.parentalCare}
                onChange={(e) =>
                  setDeductionData((prev) => ({
                    ...prev,
                    parentalCare: e.target.value,
                  }))
                }
                onBlur={(e) => handleBlur("parentalCare", e.target.value)}
                className="border p-1 w-16 text-right"
              />
              <span>คน</span>
              <span className="text-tfpa_gold">
                {displayValues.parentalCareDeduction.toLocaleString()}
              </span>
              <span className="text-tfpa_blue"> บาท</span>
            </div>

            <div className="flex items-center space-x-2">
              <span>อุปการะเลี้ยงดูคนพิการหรือทุพพลภาพ จำนวน</span>
              <input
                type="number"
                value={deductionData.disabledCare}
                onChange={(e) =>
                  setDeductionData((prev) => ({
                    ...prev,
                    disabledCare: e.target.value,
                  }))
                }
                onBlur={(e) => handleBlur("disabledCare", e.target.value)}
                className="border p-1 w-16 text-right"
              />
              <span>คน</span>
              <span className="text-tfpa_gold">
                {displayValues.disabledCareDeduction.toLocaleString()}
              </span>
              <span className="text-tfpa_blue"> บาท</span>
            </div>

            <div className="flex items-center space-x-2">
              <span>ค่าฝากครรภ์และค่าคลอดบุตร</span>
              <input
                type="number"
                value={deductionData.prenatalCare}
                onChange={(e) =>
                  setDeductionData((prev) => ({
                    ...prev,
                    prenatalCare:
                      e.target.value > 60000 ? 60000 : e.target.value,
                  }))
                }
                onBlur={(e) => handleBlur("prenatalCare", e.target.value)}
                className="border p-1 w-24 text-right"
              />
              <span>บาท</span>
              <span className="text-tfpa_gold">
                {displayValues.prenatalCareDeduction.toLocaleString()}
              </span>
              <span className="text-tfpa_blue"> บาท</span>
            </div>

            <div className="flex items-center space-x-2">
              <span>ประกันสุขภาพบิดามารดา</span>
              <input
                type="number"
                value={deductionData.parentHealthInsurance}
                onChange={(e) =>
                  setDeductionData((prev) => ({
                    ...prev,
                    parentHealthInsurance:
                      e.target.value > 15000 ? 15000 : e.target.value,
                  }))
                }
                onBlur={(e) =>
                  handleBlur("parentHealthInsurance", e.target.value)
                }
                className="border p-1 w-24 text-right"
              />
              <span>บาท</span>
              <span className="text-tfpa_gold">
                {displayValues.parentHealthInsuranceDeduction.toLocaleString()}
              </span>
              <span className="text-tfpa_blue"> บาท</span>
            </div>
          </div>

          {/* Second golden box: ประกัน เงินออม และการลงทุน */}
          <div className="bg-tfpa_gold p-4 rounded space-y-4 text-tfpa_blue font-bold">
            <h3 className="font-bold">
              ค่าลดหย่อนภาษีกลุ่มประกัน เงินออม และการลงทุน
            </h3>
          </div>

          <div className="text-tfpa_blue font-bold">
            <div className="flex items-center space-x-2">
              <span>เบี้ยประกันชีวิต</span>
              <input
                type="number"
                value={deductionData.lifeInsurance}
                onChange={(e) =>
                  setDeductionData((prev) => ({
                    ...prev,
                    lifeInsurance:
                      e.target.value > 100000 ? 100000 : e.target.value,
                  }))
                }
                onBlur={(e) => handleBlur("lifeInsurance", e.target.value)}
                className="border p-1 w-24 text-right"
              />
              <span>บาท</span>
              <span className="text-tfpa_gold">
                {displayValues.lifeInsuranceDeduction.toLocaleString()}
              </span>
              <span className="text-tfpa_blue"> บาท</span>
            </div>

            <div className="flex items-center space-x-2">
              <span>เบี้ยประกันสุขภาพ</span>
              <input
                type="number"
                value={deductionData.healthInsurance}
                onChange={(e) => {
                  const inputValue = Math.max(0, Number(e.target.value)) // Ensure value is not negative
                  setDeductionData((prev) => {
                    let healthIns = Math.min(inputValue, 25000) // Limit healthInsurance to 25,000
                    const lifeIns = prev.lifeInsurance || 0 // Get the current value of lifeInsurance
                    if (lifeIns + healthIns > 100000) {
                      healthIns -= lifeIns + healthIns - 100000 // Adjust healthInsurance to ensure total does not exceed 100,000
                    }
                    return {
                      ...prev,
                      healthInsurance: healthIns, // Set the adjusted healthInsurance value
                    }
                  })
                }}
                onBlur={(e) => handleBlur("healthInsurance", e.target.value)}
                className="border p-1 w-24 text-right"
              />
              <span>บาท</span>
              <span className="text-tfpa_gold">
                {displayValues.healthInsuranceDeduction.toLocaleString()}
              </span>
              <span className="text-tfpa_blue"> บาท</span>
            </div>

            <div className="flex items-center space-x-2">
              <span>เบี้ยประกันชีวิตแบบบำนาญ</span>
              <input
                type="number"
                value={deductionData.pensionInsurance}
                onChange={(e) =>
                  setDeductionData((prev) => ({
                    ...prev,
                    pensionInsurance:
                      prev.lifeInsurance + prev.healthInsurance < 100000
                        ? 0
                        : e.target.value > Math.min(0.15 * totalIncome, 200000)
                        ? Math.min(0.15 * totalIncome, 200000)
                        : e.target.value,
                  }))
                }
                onBlur={(e) => handleBlur("pensionInsurance", e.target.value)}
                className="border p-1 w-24 text-right"
              />
              <span>บาท</span>
              <span className="text-tfpa_gold">
                {displayValues.pensionInsuranceDeduction.toLocaleString()}
              </span>
              <span className="text-tfpa_blue"> บาท</span>
            </div>

            <div className="flex items-center space-x-2">
              <span>เบี้ยประกันชีวิต คู่สมรสไม่มีรายได้</span>
              <input
                type="number"
                value={deductionData.spouseNoIncomeLifeInsurance}
                onChange={(e) =>
                  setDeductionData((prev) => ({
                    ...prev,
                    spouseNoIncomeLifeInsurance:
                      e.target.value > 10000 ? 10000 : e.target.value,
                  }))
                }
                onBlur={(e) =>
                  handleBlur("spouseNoIncomeLifeInsurance", e.target.value)
                }
                className="border p-1 w-24 text-right"
              />
              <span>บาท</span>
              <span className="text-tfpa_gold">
                {displayValues.spouseNoIncomeLifeInsuranceDeduction.toLocaleString()}
              </span>
              <span className="text-tfpa_blue"> บาท</span>
            </div>

            <div className="flex items-center space-x-2">
              <span>กองทุนรวมเพื่อการเลี้ยงชีพ (RMF)</span>
              <input
                type="number"
                value={deductionData.rmf}
                onChange={(e) =>
                  setDeductionData((prev) => ({
                    ...prev,
                    rmf:
                      e.target.value > Math.min(0.3 * totalIncome, 500000)
                        ? Math.min(0.3 * totalIncome, 500000)
                        : e.target.value,
                  }))
                }
                onBlur={(e) => handleBlur("rmf", e.target.value)}
                className="border p-1 w-24 text-right"
              />
              <span>บาท</span>
              <span className="text-tfpa_gold">
                {displayValues.rmfDeduction.toLocaleString()}
              </span>
              <span className="text-tfpa_blue"> บาท</span>
            </div>

            <div className="flex items-center space-x-2">
              <span>กองทุนรวมเพื่อการออม (SSF)</span>
              <input
                type="number"
                value={deductionData.ssf}
                onChange={(e) =>
                  setDeductionData((prev) => ({
                    ...prev,
                    ssf:
                      e.target.value > Math.min(0.3 * totalIncome, 200000)
                        ? Math.min(0.3 * totalIncome, 200000)
                        : e.target.value,
                  }))
                }
                onBlur={(e) => handleBlur("ssf", e.target.value)}
                className="border p-1 w-24 text-right"
              />
              <span>บาท</span>
              <span className="text-tfpa_gold">
                {displayValues.ssfDeduction.toLocaleString()}
              </span>
              <span className="text-tfpa_blue"> บาท</span>
            </div>

            <div className="flex items-center space-x-2">
              <span>กองทุนบำเหน็จบำนาญราชการ (กบข.)</span>
              <input
                type="number"
                value={deductionData.govPensionFund}
                onChange={(e) =>
                  setDeductionData((prev) => ({
                    ...prev,
                    govPensionFund:
                      e.target.value > Math.min(0.3 * totalIncome, 500000)
                        ? Math.min(0.3 * totalIncome, 500000)
                        : e.target.value,
                  }))
                }
                onBlur={(e) => handleBlur("govPensionFund", e.target.value)}
                className="border p-1 w-24 text-right"
              />
              <span>บาท</span>
              <span className="text-tfpa_gold">
                {displayValues.govPensionFundDeduct.toLocaleString()}
              </span>
              <span className="text-tfpa_blue"> บาท</span>
            </div>

            <div className="flex items-center space-x-2">
              <span>กองทุนสำรองเลี้ยงชีพ (PVD)</span>
              <input
                type="number"
                value={deductionData.pvd}
                onChange={(e) =>
                  setDeductionData((prev) => ({
                    ...prev,
                    pvd:
                      e.target.value > Math.min(0.15 * totalIncome, 500000)
                        ? Math.min(0.15 * totalIncome, 500000)
                        : e.target.value,
                  }))
                }
                onBlur={(e) => handleBlur("pvd", e.target.value)}
                className="border p-1 w-24 text-right"
              />
              <span>บาท</span>
              <span className="text-tfpa_gold">
                {displayValues.pvdDeduct.toLocaleString()}
              </span>
              <span className="text-tfpa_blue"> บาท</span>
            </div>

            <div className="flex items-center space-x-2">
              <span>กองทุนการออมแห่งชาติ (กอช.)</span>
              <input
                type="number"
                value={deductionData.nationSavingsFund}
                onChange={(e) =>
                  setDeductionData((prev) => ({
                    ...prev,
                    nationSavingsFund:
                      e.target.value > 30000 ? 30000 : e.target.value,
                  }))
                }
                onBlur={(e) => handleBlur("nationSavingsFund", e.target.value)}
                className="border p-1 w-24 text-right"
              />
              <span>บาท</span>
              <span className="text-tfpa_gold">
                {displayValues.nationSavingsFundDeduct.toLocaleString()}
              </span>
              <span className="text-tfpa_blue"> บาท</span>
            </div>

            <div className="flex items-center space-x-2">
              <span>เบี้ยประกันสังคม</span>
              <input
                type="number"
                value={deductionData.socialSecurityPremium}
                onChange={(e) =>
                  setDeductionData((prev) => ({
                    ...prev,
                    socialSecurityPremium:
                      e.target.value > 9000 ? 9000 : e.target.value,
                  }))
                }
                onBlur={(e) =>
                  handleBlur("socialSecurityPremium", e.target.value)
                }
                className="border p-1 w-24 text-right"
              />
              <span>บาท</span>
              <span className="text-tfpa_gold">
                {displayValues.socialSecurityPremiumDeduct.toLocaleString()}
              </span>
              <span className="text-tfpa_blue"> บาท</span>
            </div>

            <div className="flex items-center space-x-2">
              <span>เงินลงทุนธุรกิจ social enterprise</span>
              <input
                type="number"
                value={deductionData.socialEnterprise}
                onChange={(e) =>
                  setDeductionData((prev) => ({
                    ...prev,
                    socialEnterprise:
                      e.target.value > 100000 ? 100000 : e.target.value,
                  }))
                }
                onBlur={(e) => handleBlur("socialEnterprise", e.target.value)}
                className="border p-1 w-24 text-right"
              />
              <span>บาท</span>
              <span className="text-tfpa_gold">
                {displayValues.socialEnterpriseDeduct.toLocaleString()}
              </span>
              <span className="text-tfpa_blue"> บาท</span>
            </div>

            <div className="flex items-center space-x-2">
              <span>กองทุนรวมไทยเพื่อความยั่งยืน (Thai ESG)</span>
              <input
                type="number"
                value={deductionData.thaiEsg}
                onChange={(e) =>
                  setDeductionData((prev) => ({
                    ...prev,
                    thaiEsg:
                      e.target.value > Math.min(0.3 * totalIncome, 300000)
                        ? Math.min(0.3 * totalIncome, 300000)
                        : e.target.value,
                  }))
                }
                onBlur={(e) => handleBlur("thaiEsg", e.target.value)}
                className="border p-1 w-24 text-right"
              />
              <span>บาท</span>
              <span className="text-tfpa_gold">
                {displayValues.thaiEsgDeduct.toLocaleString()}
              </span>
              <span className="text-tfpa_blue"> บาท</span>
            </div>
          </div>

          {/* Dotted line */}
          <hr className="border-dashed border-gray-300" />
          <div className="flex justify-end font-bold text-tfpa_blue space-x-2">
            <span>ค่าลดหย่อนภาษีก่อนกลุ่มเงินบริจาค</span>
            <span className="text-tfpa_gold">
              {displayValues.beforeDonationDeduct.toLocaleString()}
            </span>
            <span className="text-tfpa_blue"> บาท</span>
          </div>

          {/* Third golden box: กลุ่มเงินบริจาค */}
          <div className="bg-tfpa_gold p-4 rounded space-y-4 text-tfpa_blue font-bold">
            <h3 className="font-bold">ค่าลดหย่อนภาษีกลุ่มเงินบริจาค</h3>
          </div>

          <div className="text-tfpa_blue font-bold">
            <div className="flex items-center space-x-2">
              <span>เงินบริจาคทั่วไป</span>
              <input
                type="number"
                value={deductionData.generalDonation}
                onChange={(e) => {
                  const val =
                    e.target.value === ""
                      ? ""
                      : parseInt(e.target.value, 10) || 0
                  setDeductionData((prev) => ({
                    ...prev,
                    generalDonation:
                      val > 0.1 * baseForDonation ? 0.1 * baseForDonation : val,
                  }))
                }}
                onBlur={(e) => handleBlur("generalDonation", e.target.value)}
                className="border p-1 w-24 text-right"
              />
              <span>บาท</span>
              <span className="text-tfpa_gold">
                {displayValues.generalDonationDeduct.toLocaleString()}
              </span>
              <span className="text-tfpa_blue"> บาท</span>
            </div>

            <div className="flex items-center space-x-2">
              <span>
                งินบริจาคเพื่อการศึกษา การกีฬา การพัฒนาสังคม
                เพื่อประโยชน์สาธารณะ และรพ.รัฐ
              </span>
              <input
                type="number"
                value={deductionData.eduDonation}
                onChange={(e) => {
                  const val =
                    e.target.value === ""
                      ? ""
                      : parseInt(e.target.value, 10) || 0
                  setDeductionData((prev) => ({
                    ...prev,
                    eduDonation:
                      2 * val > 0.1 * baseForDonation
                        ? 0.1 * baseForDonation
                        : val,
                  }))
                }}
                onBlur={(e) => handleBlur("eduDonation", e.target.value)}
                className="border p-1 w-24 text-right"
              />
              <span>บาท</span>
              <span className="text-tfpa_gold">
                {displayValues.eduDonationDeduct.toLocaleString()}
              </span>
              <span className="text-tfpa_blue"> บาท</span>
            </div>

            <div className="flex items-center space-x-2">
              <span>เงินบริจาคให้พรรคการเมือง</span>
              <input
                type="number"
                value={deductionData.politicalPartyDonation}
                onChange={(e) =>
                  setDeductionData((prev) => ({
                    ...prev,
                    politicalPartyDonation:
                      e.target.value > 10000 ? 10000 : e.target.value,
                  }))
                }
                onBlur={(e) =>
                  handleBlur("politicalPartyDonation", e.target.value)
                }
                className="border p-1 w-24 text-right"
              />
              <span>บาท</span>
              <span className="text-tfpa_gold">
                {displayValues.politicalPartyDonationDeduct.toLocaleString()}
              </span>
              <span className="text-tfpa_blue"> บาท</span>
            </div>
          </div>

          {/* Dotted line */}
          <hr className="border-dashed border-gray-300" />

          {/* ค่าลดหย่อนภาษี (total) */}
          <div className="flex items-end justify-end font-bold text-tfpa_blue space-x-2">
            <span>ค่าลดหย่อนภาษี</span>
            <span className="text-tfpa_gold">
              {displayValues.totalDeduction.toLocaleString()}
            </span>
            <span className="text-tfpa_blue"> บาท</span>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handleBack}
              className="bg-tfpa_gold text-white px-4 py-2 rounded font-bold"
            >
              กลับ
            </button>
            <button
              onClick={handleNext}
              className="bg-tfpa_gold text-white px-4 py-2 rounded font-bold"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
