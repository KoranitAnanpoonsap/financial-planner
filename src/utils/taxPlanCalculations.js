export async function fetchAndCalculateTaxPlanForClient(clientUuid, totalPlan) {
  // Fetch incomes
  const incomesRes = await fetch(
    `${import.meta.env.VITE_API_KEY}api/clientincome/${clientUuid}`
  )
  if (!incomesRes.ok) throw new Error("Failed to fetch incomes")
  const incomesData = await incomesRes.json()

  // Fetch tax deductions
  const tdRes = await fetch(
    `${import.meta.env.VITE_API_KEY}api/taxdeduction/${clientUuid}`
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
    // If income is monthly, multiply by 12
    if (inc.clientIncomeFrequency === 1) {
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
      inc.clientIncomeType === 1 ||
      inc.clientIncomeType === 2
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
      // 403
      case 3:
        // 50% capped at 100k
        deduction = inc.clientIncomeAmount * 0.5
        if (deduction > 100000) deduction = 100000
        totalExpenseDeductions += deduction
        break

      // 404
      case 4:
        deduction = 0
        totalExpenseDeductions += deduction
        break

      // 405
      case 5:
        switch (inc.clientIncome405Type) {
          // บ้าน/โรงเรือน/สิ่งปลูกสร้าง/แพ/ยานพาหนะ
          case 1:
            deduction = inc.clientIncomeAmount * 0.3
            break
          // ที่ดินที่ใช้ในการเกษตร
          case 2:
            deduction = inc.clientIncomeAmount * 0.2
            break
          // ที่ดินที่มิได้ใช้ในการเกษตร
          case 3:
            deduction = inc.clientIncomeAmount * 0.15
            break
          // ทรัพย์สินอื่นๆ
          case 4:
            deduction = inc.clientIncomeAmount * 0.1
            break
          default:
            deduction = 0
        }
        totalExpenseDeductions += deduction
        break

      // 406
      case 6:
        switch (inc.clientIncome406Type) {
          // การประกอบโรคศิลปะ
          case 1:
            deduction = inc.clientIncomeAmount * 0.6
            break
          // กฎหมาย/วิศวกรรม/สถาปัตยกรรม/การบัญชี/ประณีตศิลปกรรม
          case 2:
            deduction = inc.clientIncomeAmount * 0.3
            break
          default:
            deduction = 0
        }
        totalExpenseDeductions += deduction
        break

      // 407
      case 7:
        deduction = inc.clientIncomeAmount * 0.6
        totalExpenseDeductions += deduction
        break

      // 408
      case 8:
        // We'll handle subtypes ourselves:
        const sub8 = inc.clientIncome408Type
        // ประเภทที่ (1) (เงินได้ส่วนที่ไม่เกิน 300,000 บาท)
        if (sub8 === 1) {
          // We'll accumulate them and apply 60% with 600k cap combined
          sum408Under300k += inc.clientIncomeAmount

        // ประเภทที่ (1) (เงินได้ส่วนที่เกิน 300,000 บาท)
        } else if (sub8 === 2) {
          // We'll accumulate them and apply 40%, then combine with above for a 600k cap
          sum408Over300k += inc.clientIncomeAmount

          // ประเภทที่ (2) ถึง (43)
        } else if (sub8 === 3) {
          // 60% fixed
          const d = inc.clientIncomeAmount * 0.6
          sum408Rest += d

        // เงินได้ประเภทที่ไม่อยู่ใน (1) ถึง (43)
        } else if (sub8 === 4) {
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

    //ms: 1 = โสด, 2 = คู่สมรสมีเงินได้แยกยื่นแบบ, 3 = คู่สมรสมีเงินได้ยื่นรวม, 4 = คู่สมรสไม่มีเงินได้
    if (ms === 1 || ms === 2) {
      totalTaxDeductions += 60000
    } else if (
      ms === 3 ||
      ms === 4
    ) {
      totalTaxDeductions += 120000
    }

    // child = 30,000 each
    totalTaxDeductions +=
      ms == 3 ? td.child * 60000 : td.child * 30000
    // child2561 = 60,000 each
    totalTaxDeductions +=
      ms == 3
        ? td.child2561 * 120000
        : td.child2561 * 60000
    // adopted_child = 30,000 each
    totalTaxDeductions +=
      ms == 3
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
    .filter((i) => i.clientIncomeType === 1) // 40(1) เงินเดือน
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
