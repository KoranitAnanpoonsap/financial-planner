export async function fetchAndCalculateTaxForClient(clientId) {
    // Fetch incomes
    const incomesRes = await fetch(`http://localhost:8080/api/clientincome/${clientId}`)
    if (!incomesRes.ok) throw new Error("Failed to fetch incomes")
    const incomesData = await incomesRes.json()
  
    // Fetch tax deductions
    const tdRes = await fetch(`http://localhost:8080/api/taxdeduction/${clientId}`)
    let tdData = null
    if (tdRes.ok) {
      tdData = await tdRes.json()
    }
  
    return calculateTaxForClient(incomesData, tdData)
  }
  
  export function calculateTaxForClient(incomes, td) {
    // Adjust incomes to yearly if frequency == "ทุกเดือน"
    const adjustedIncomes = incomes.map(income => {
      if (income.clientIncomeFrequency === "ทุกเดือน") {
        income.clientIncomeAmount = income.clientIncomeAmount * 12
      }
      return income
    })
  
    // Calculate total income
    const totalIncome = adjustedIncomes.reduce((sum, inc) => sum + inc.clientIncomeAmount, 0)
  
    // Group by type
    const incomeByType = adjustedIncomes.reduce((map, inc) => {
      const type = inc.clientIncomeType
      if (!map[type]) map[type] = 0
      map[type] += inc.clientIncomeAmount
      return map
    }, {})
  
    // Calculate Expense Deductions based on rules
    let totalExpenseDeductions = 0
  
    for (const [type, sumAmount] of Object.entries(incomeByType)) {
      let deduction
      switch (type) {
        case "เงินเดือน":
        case "รับจ้างทำงาน":
          // 50% capped at 100,000
          deduction = sumAmount * 0.5
          if (deduction > 100000) deduction = 100000
          break
        case "ค่าเสียสิทธิ ลิขสิทธิ์":
          // 50% capped at 100,000
          deduction = sumAmount * 0.5
          if (deduction > 100000) deduction = 100000
          break
        case "ดอกเบี้ย เงินปันผล":
          // 0%
          deduction = 0
          break
        case "ค่าเช่าทรัพย์สิน":
          // 20%
          deduction = sumAmount * 0.2
          break
        case "วิชาชีพอิสระ":
          // 45%
          deduction = sumAmount * 0.45
          break
        case "รับเหมาก่อสร้าง":
          // 60%
          deduction = sumAmount * 0.6
          break
        case "รายได้อื่นๆ":
          // 60%
          deduction = sumAmount * 0.6
          break
        default:
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
      } else if (ms === "คู่สมรสมีเงินได้ยื่นรวม" || ms === "คู่สมรสไม่มีเงินได้") {
        totalTaxDeductions += 120000
      }
  
      // child = 30,000 each
      totalTaxDeductions += td.child * 30000
      // child2561 = 60,000 each
      totalTaxDeductions += td.child2561 * 60000
      // adopted_child = 30,000 each
      totalTaxDeductions += td.adoptedChild * 30000
      // parental_care = 30,000 each
      totalTaxDeductions += td.parentalCare * 30000
      // disabled_care = 60,000 each
      totalTaxDeductions += td.disabledCare * 60000
  
      // Add all other fields directly
      totalTaxDeductions += td.prenatalCare
      totalTaxDeductions += td.parentHealthInsurance
      totalTaxDeductions += td.lifeInsurance
      totalTaxDeductions += td.healthInsurance
      totalTaxDeductions += td.pensionInsurance
      totalTaxDeductions += td.spouseNoIncomeLifeInsurance
      totalTaxDeductions += td.rmf
      totalTaxDeductions += td.ssf
      totalTaxDeductions += td.govPensionFund
      totalTaxDeductions += td.pvd
      totalTaxDeductions += td.nationSavingsFund
      totalTaxDeductions += td.socialSecurityPremium
      totalTaxDeductions += td.socialEnterprise
      totalTaxDeductions += td.thaiEsg
      totalTaxDeductions += td.generalDonation
      totalTaxDeductions += td.eduDonation*2
      totalTaxDeductions += td.politicalPartyDonation
  
      // Check pension group sum limit of 500,000
      const pensionGroupSum = td.pensionInsurance +
                              td.rmf +
                              td.ssf +
                              td.govPensionFund +
                              td.pvd +
                              td.nationSavingsFund
  
      if (pensionGroupSum > 500000) {
        const excess = pensionGroupSum - 500000
        totalTaxDeductions -= excess
      }
    }
  
    // income after deductions
    let incomeAfterDeductions = totalIncome - totalExpenseDeductions - totalTaxDeductions
    if (incomeAfterDeductions < 0) {
      incomeAfterDeductions = 0
    }
  
    const method1Tax = calculateMethod1Tax(incomeAfterDeductions)
  
    const incomeSalary = incomeByType["เงินเดือน"] || 0
    const incomeNonSalary = totalIncome - incomeSalary
    let method2Tax = 0
    if (incomeNonSalary > 1000000) {
      method2Tax = incomeNonSalary * 0.005 // 0.5%
    }
  
    let finalTax = method1Tax
    if (method2Tax > 0 && method2Tax > method1Tax) {
      finalTax = method2Tax
    }
  
    return {
      taxToPay: finalTax,
      totalIncome: totalIncome,
      incomeAfterDeductions: incomeAfterDeductions,
      totalExpenseDeductions: totalExpenseDeductions
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
      tax = 7500 + (inc - 300000) * 0.10
    } else if (inc <= 750000) {
      tax = 27500 + (inc - 500000) * 0.15
    } else if (inc <= 1000000) {
      tax = 65000 + (inc - 750000) * 0.20
    } else if (inc <= 2000000) {
      tax = 115000 + (inc - 1000000) * 0.25
    } else if (inc <= 5000000) {
      tax = 365000 + (inc - 2000000) * 0.30
    } else {
      tax = 1265000 + (inc - 5000000) * 0.35
    }
    return tax
  }