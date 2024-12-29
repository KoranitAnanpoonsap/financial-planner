export async function fetchAndCalculateTaxPlanForClient(clientId, totalPlan) {
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

  return calculateTaxPlanForClient(incomesData, tdData, totalPlan)
}

export function calculateTaxPlanForClient(incomes, td, totalPlan) {
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

  // 3) Calculate expense deductions (per record), because 40(5) & 40(6) need subtypes.
  let totalExpenseDeductions = 0

  // We'll combine 40(1) & 40(2) first, because they share a 50%-capped-at-100k rule.
  let combinedSalaryAmount = 0
  const otherIncomes = []

  for (const inc of adjustedIncomes) {
    if (
      inc.clientIncomeType === "40(1) เงินเดือน" ||
      inc.clientIncomeType === "40(2) รับจ้างทำงาน"
    ) {
      // We'll accumulate these amounts, then apply a single 50% capped rule at the end.
      combinedSalaryAmount += inc.clientIncomeAmount
    } else {
      // We'll handle all other records individually (including 40(3)...40(8))
      otherIncomes.push(inc)
    }
  }

  // Now handle 40(1) & 40(2) combined
  if (combinedSalaryAmount > 0) {
    let deduction = combinedSalaryAmount * 0.5
    if (deduction > 100000) deduction = 100000
    totalExpenseDeductions += deduction
  }

  // Now handle each of the "other" incomes individually
  for (const inc of otherIncomes) {
    let deduction = 0
    switch (inc.clientIncomeType) {
      case "40(3) ค่าลิขสิทธิ์ สิทธิบัตร":
        // 50% capped at 100,000
        deduction = inc.clientIncomeAmount * 0.5
        if (deduction > 100000) deduction = 100000
        break

      case "40(4) ดอกเบี้ย เงินปันผล":
        // 0%
        deduction = 0
        break

      case "40(5) ค่าเช่าทรัพย์สิน":
        // Use clientIncome405Type to decide the rate:
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
            // If no subtype or unrecognized, treat as 0 or handle as needed
            deduction = 0
            break
        }
        break

      case "40(6) วิชาชีพอิสระ":
        // Use clientIncome406Type to decide the rate:
        switch (inc.clientIncome406Type) {
          case "การประกอบโรคศิลปะ":
            deduction = inc.clientIncomeAmount * 0.6
            break
          case "กฎหมาย/วิศวกรรม/สถาปัตยกรรม/การบัญชี/ประณีตศิลปกรรม":
            deduction = inc.clientIncomeAmount * 0.3
            break
          default:
            deduction = 0
            break
        }
        break

      case "40(7) รับเหมาก่อสร้าง":
        // 60%
        deduction = inc.clientIncomeAmount * 0.6
        break

      case "40(8) รายได้อื่นๆ":
        // 60%
        deduction = inc.clientIncomeAmount * 0.6
        break

      default:
        // Unrecognized or empty
        deduction = 0
        break
    }
    totalExpenseDeductions += deduction
  }

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
    totalTaxDeductions += totalPlan

    let portion_pensionIns = 0
    if (td.lifeInsurance + td.healthInsurance < 100000) {
      if (100000 - (td.lifeInsurance + td.healthInsurance) > td.pensionInsurance) {
        portion_pensionIns = td.pensionInsurance
      } else {
        portion_pensionIns = 100000 - (td.lifeInsurance + td.healthInsurance)
      }
    } else {
      portion_pensionIns = 0
    }

    totalTaxDeductions += portion_pensionIns
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
