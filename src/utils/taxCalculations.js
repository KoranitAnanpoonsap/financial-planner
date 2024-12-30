export async function fetchAndCalculateTaxForClient(clientId) {
  // Fetch incomes
  const incomesRes = await fetch(
    `http://localhost:8080/api/clientincome/${clientId}`
  )
  if (!incomesRes.ok) throw new Error("Failed to fetch incomes")
  const incomesData = await incomesRes.json()

  // Fetch tax deductions
  const tdRes = await fetch(
    `http://localhost:8080/api/taxdeduction/${clientId}`
  )
  let tdData = null
  if (tdRes.ok) {
    tdData = await tdRes.json()
  }

  return calculateTaxForClient(incomesData, tdData)
}

export function calculateTaxForClient(incomes, td) {
  // 1) Adjust incomes to yearly if frequency == "ทุกเดือน".
  const adjustedIncomes = incomes.map((inc) => {
    if (inc.clientIncomeFrequency === "ทุกเดือน") {
      inc.clientIncomeAmount = inc.clientIncomeAmount * 12
    }
    return inc
  })

  // 2) Calculate total income
  const totalIncome = adjustedIncomes.reduce(
    (sum, inc) => sum + inc.clientIncomeAmount,
    0
  )

  // 3) We'll handle expense deductions.
  let totalExpenseDeductions = 0

  // Step A: Combine 40(1) & 40(2):
  let combinedSalaryAmount = 0
  const otherIncomes = []
  for (const inc of adjustedIncomes) {
    if (
      inc.clientIncomeType === "40(1) เงินเดือน" ||
      inc.clientIncomeType === "40(2) รับจ้างทำงาน"
    ) {
      combinedSalaryAmount += inc.clientIncomeAmount
    } else {
      otherIncomes.push(inc)
    }
  }
  // 40(1) & 40(2) => 50% capped at 100k
  if (combinedSalaryAmount > 0) {
    let deduction = combinedSalaryAmount * 0.5
    if (deduction > 100000) deduction = 100000
    totalExpenseDeductions += deduction
  }

  // Step B: We'll accumulate all 40(8) subtypes *before* adding them,
  // because we must combine
  //   (1)(เงินได้<=300k => 60%) + (1)(เงินได้>300k => 40%)
  // then cap at 600k.
  let sum408Under300k = 0 // subtype: (เงินได้ส่วนที่ไม่เกิน 300,000 บาท)
  let sum408Over300k = 0 // subtype: (เงินได้ส่วนที่เกิน 300,000 บาท)
  let sum408Rest = 0 // subtype: (2)ถึง(43), each 60%
  let sum408OtherDeduction = 0 // for "เงินได้ประเภทที่ไม่อยู่ใน (1) ถึง (43)"

  // Step C: Loop over each "other" income (which includes 40(3)...40(8))
  for (const inc of otherIncomes) {
    let deduction = 0

    switch (inc.clientIncomeType) {
      case "40(3) ค่าลิขสิทธิ์ สิทธิบัตร":
        // 50% capped at 100k
        deduction = inc.clientIncomeAmount * 0.5
        if (deduction > 100000) deduction = 100000
        totalExpenseDeductions += deduction
        break

      case "40(4) ดอกเบี้ย เงินปันผล":
        deduction = 0
        totalExpenseDeductions += deduction
        break

      case "40(5) ค่าเช่าทรัพย์สิน":
        switch (inc.clientIncome405Type) {
          case "บ้าน/โรงเรือน/สิ่งปลูกสร้าง/แพ/ยานพาหนะ":
            deduction = inc.clientIncomeAmount * 0.3
            break
          case "ที่ดินที่ใช้ในการเกษตร":
            deduction = inc.clientIncomeAmount * 0.2
            break
          case "ที่ดินที่มิได้ใช้ในการเกษตร":
            deduction = inc.clientIncomeAmount * 0.15
            break
          case "ทรัพย์สินอื่นๆ":
            deduction = inc.clientIncomeAmount * 0.1
            break
          default:
            deduction = 0
        }
        totalExpenseDeductions += deduction
        break

      case "40(6) วิชาชีพอิสระ":
        switch (inc.clientIncome406Type) {
          case "การประกอบโรคศิลปะ":
            deduction = inc.clientIncomeAmount * 0.6
            break
          case "กฎหมาย/วิศวกรรม/สถาปัตยกรรม/การบัญชี/ประณีตศิลปกรรม":
            deduction = inc.clientIncomeAmount * 0.3
            break
          default:
            deduction = 0
        }
        totalExpenseDeductions += deduction
        break

      case "40(7) รับเหมาก่อสร้าง":
        deduction = inc.clientIncomeAmount * 0.6
        totalExpenseDeductions += deduction
        break

      case "40(8) รายได้อื่นๆ":
        // We'll handle subtypes ourselves:
        const sub8 = inc.clientIncome408Type
        if (sub8 === "ประเภทที่ (1) (เงินได้ส่วนที่ไม่เกิน 300,000 บาท)") {
          // We'll accumulate them and apply 60% with 600k cap combined
          sum408Under300k += inc.clientIncomeAmount
        } else if (sub8 === "ประเภทที่ (1) (เงินได้ส่วนที่เกิน 300,000 บาท)") {
          // We'll accumulate them and apply 40%, then combine with above for a 600k cap
          sum408Over300k += inc.clientIncomeAmount
        } else if (sub8 === "ประเภทที่ (2) ถึง (43)") {
          // 60% fixed
          const d = inc.clientIncomeAmount * 0.6
          sum408Rest += d
        } else if (sub8 === "เงินได้ประเภทที่ไม่อยู่ใน (1) ถึง (43)") {
          // Use user’s custom field
          sum408OtherDeduction +=
            inc.clientIncome408TypeOtherExpenseDeduction || 0
        } else {
          // no recognized subtype
        }
        break

      default:
        // Unknown (or empty)
        deduction = 0
        totalExpenseDeductions += deduction
        break
    }
  }

  // Now let's finalize the 40(8) sub-subtype calculations:
  // 1) ประเภทที่ (1) (ไม่เกิน 300,000 บาท) => 60%,
  //    ประเภทที่ (1) (เกิน 300,000 บาท) => 40%,
  // combine => can't exceed 600,000
  let deduction408Under300 = sum408Under300k * 0.6
  let deduction408Over300 = sum408Over300k * 0.4
  let combined408Ded = deduction408Under300 + deduction408Over300
  if (combined408Ded > 600000) {
    combined408Ded = 600000
  }

  // 2) Add sub(2)–(43) total
  //   "sum408Rest" is total for "ประเภทที่ (2) ถึง (43)" => 60% (already done)
  //   so we just add that
  // 3) Add "เงินได้ประเภทที่ไม่อยู่ใน (1) ถึง (43)"
  totalExpenseDeductions += combined408Ded
  totalExpenseDeductions += sum408Rest
  totalExpenseDeductions += sum408OtherDeduction

  // Sum all tax deductions
  let totalTaxDeductions = 0

  if (td != null) {
    // Marital status
    const ms = td.maritalStatus
    if (ms === "โสด" || ms === "คู่สมรสมีเงินได้แยกยื่นแบบ") {
      totalTaxDeductions += 60000
    } else if (
      ms === "คู่สมรสมีเงินได้ยื่นรวม" ||
      ms === "คู่สมรสไม่มีเงินได้"
    ) {
      totalTaxDeductions += 120000
    }

    // child = 30,000 each
    totalTaxDeductions +=
      ms == "คู่สมรสมีเงินได้ยื่นรวม" ? td.child * 60000 : td.child * 30000
    // child2561 = 60,000 each
    totalTaxDeductions +=
      ms == "คู่สมรสมีเงินได้ยื่นรวม"
        ? td.child2561 * 120000
        : td.child2561 * 60000
    // adopted_child = 30,000 each
    totalTaxDeductions +=
      ms == "คู่สมรสมีเงินได้ยื่นรวม"
        ? td.adoptedChild * 60000
        : td.adoptedChild * 30000
    // parental_care = 30,000 each
    totalTaxDeductions += td.parentalCare * 30000
    // disabled_care = 60,000 each
    totalTaxDeductions += td.disabledCare * 60000

    // Add all other fields directly
    totalTaxDeductions += td.prenatalCare
    totalTaxDeductions += td.parentHealthInsurance
    totalTaxDeductions += td.lifeInsurance
    totalTaxDeductions += td.healthInsurance
    totalTaxDeductions += td.spouseNoIncomeLifeInsurance
    totalTaxDeductions += td.socialSecurityPremium
    totalTaxDeductions += td.socialEnterprise
    totalTaxDeductions += td.thaiEsg
    totalTaxDeductions += td.generalDonation
    totalTaxDeductions += td.eduDonation * 2
    totalTaxDeductions += td.politicalPartyDonation

    let portion_pensionIns = 0
    if (td.lifeInsurance + td.healthInsurance < 100000) {
      if (
        100000 - (td.lifeInsurance + td.healthInsurance) >
        td.pensionInsurance
      ) {
        portion_pensionIns = td.pensionInsurance
      } else {
        portion_pensionIns = 100000 - (td.lifeInsurance + td.healthInsurance)
      }
    } else {
      portion_pensionIns = 0
    }

    totalTaxDeductions += portion_pensionIns

    let newPensionIns = Math.min(
      td.pensionInsurance - portion_pensionIns,
      0.15 * totalIncome,
      200000
    )

    // Check pension group sum limit of 500,000
    const pensionGroupSum = Math.min(
      newPensionIns +
        td.rmf +
        td.ssf +
        td.govPensionFund +
        td.pvd +
        td.nationSavingsFund,
      500000
    )
    totalTaxDeductions += pensionGroupSum
  }

  // income after deductions
  let incomeAfterDeductions =
    totalIncome - totalExpenseDeductions - totalTaxDeductions
  if (incomeAfterDeductions < 0) {
    incomeAfterDeductions = 0
  }

  const method1Tax = calculateMethod1Tax(incomeAfterDeductions)

  const salary = adjustedIncomes
    .filter((i) => i.clientIncomeType === "40(1) เงินเดือน")
    .reduce((sum, i) => sum + i.clientIncomeAmount, 0)
  const incomeNonSalary = totalIncome - salary

  let method2Tax = 0
  if (incomeNonSalary > 1000000) {
    method2Tax = incomeNonSalary * 0.005
  }

  let finalTax = method1Tax
  if (method2Tax > 0 && method2Tax > method1Tax) {
    finalTax = method2Tax
  }

  return {
    taxToPay: finalTax,
    totalIncome: totalIncome,
    incomeAfterDeductions: incomeAfterDeductions,
    totalExpenseDeductions: totalExpenseDeductions,
  }
}

function calculateMethod1Tax(income) {
  const inc = income
  let tax = 0
  if (inc <= 150000) {
    tax = 0
  } else if (inc <= 300000) {
    tax = (inc - 150000) * 0.05
  } else if (inc <= 500000) {
    tax = 7500 + (inc - 300000) * 0.1
  } else if (inc <= 750000) {
    tax = 27500 + (inc - 500000) * 0.15
  } else if (inc <= 1000000) {
    tax = 65000 + (inc - 750000) * 0.2
  } else if (inc <= 2000000) {
    tax = 115000 + (inc - 1000000) * 0.25
  } else if (inc <= 5000000) {
    tax = 365000 + (inc - 2000000) * 0.3
  } else {
    tax = 1265000 + (inc - 5000000) * 0.35
  }
  return tax
}
