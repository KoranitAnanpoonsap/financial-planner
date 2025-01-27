import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Footer from "../components/footer.jsx"
import Header from "../components/cfpHeader.jsx"
import CfpClientSidePanel from "../components/cfpClientSidePanel.jsx"
import { motion } from "framer-motion"

// Import the calculation functions
import {
  calculatePortfolioSummary,
  calculateYearlyIncome,
  calculateYearlyExpense,
  calculateGoalPayments,
} from "../utils/calculations.js"
import {Line} from "react-chartjs-2";
import {
  CategoryScale, Chart,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement, plugins,
  PointElement,
  Title,
  Tooltip
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import html2canvas from "html2canvas";
// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels,
)
Chart.defaults.set('plugins.datalabels', {
  formatter: function(value, context) {
    return Number(value).toLocaleString('en-us', {minimumFractionDigits: 2, maximumFractionDigits: 2,})+ " บาท";
  },
  align: -45,
  color: 'black'
});
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

export default function CFPCashflowBaseDashboard() {
  const [clientUuid] = useState(localStorage.getItem("clientUuid") || "")
  const navigate = useNavigate()

  const [incomes, setIncomes] = useState([])
  const [expenses, setExpenses] = useState([])
  const [goals, setGoals] = useState([])
  const [portfolioReturn, setPortfolioReturn] = useState(0)
  const [check, setCheck] = useState([])

  const years = [1, 2, 3, 4, 5]

  useEffect(() => {
    fetchAllData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientUuid])

  const fetchAllData = async () => {
    try {
      const [incomesRes, expensesRes, goalsRes, assetsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_KEY}api/clientincome/${clientUuid}`),
        fetch(`${import.meta.env.VITE_API_KEY}api/clientexpense/${clientUuid}`),
        fetch(`${import.meta.env.VITE_API_KEY}api/cashflow/${clientUuid}`),
        fetch(`${import.meta.env.VITE_API_KEY}api/portassets/${clientUuid}`),
      ])

      if (!incomesRes.ok || !expensesRes.ok || !goalsRes.ok || !assetsRes.ok) {
        throw new Error("Failed to fetch data")
      }

      const incomesData = await incomesRes.json()
      const expensesData = await expensesRes.json()
      const goalsData = await goalsRes.json()
      const assetsData = await assetsRes.json()

      setIncomes(incomesData)
      setExpenses(expensesData)
      setGoals(goalsData)

      const initialCheck=[]

      goalsData.forEach(() => {
        initialCheck.push(true)
      })
      setCheck(initialCheck)

      const { portReturn } = calculatePortfolioSummary(assetsData)
      setPortfolioReturn(portReturn)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const calculationResults = years.map((year) => {
    const incomeDetails = calculateYearlyIncome(incomes, year)
    const expenseDetails = calculateYearlyExpense(expenses, year)
    const totalIncome = incomeDetails.reduce(
        (sum, inc) => sum + parseFloat(Object.values(inc)[0]),
        0
    )
    const totalExpense = expenseDetails.reduce(
        (sum, exp) => sum + parseFloat(Object.values(exp)[0]),
        0
    )
    const netIncome = totalIncome - totalExpense

    // Pass 'expenses' as an additional argument to calculateGoalPayments
    const goalPayments = calculateGoalPayments(
        goals,
        portfolioReturn,
        expenses,
        year
    )
    const totalGoalPayments = goalPayments.reduce(
        (sum, g) => sum + parseFloat(Object.values(g)[0]),
        0
    )
    const netIncomeAfterGoals = netIncome - totalGoalPayments

    return {
      year,
      incomeDetails,
      expenseDetails,
      goalPayments,
      totalIncome,
      totalExpense,
      netIncome,
      netIncomeAfterGoals,
    }
  })

  const handleNavigateBack = () => {
    navigate(`/cashflow-base-calculated/`)
  }

  const DashboardCashFlowBasedEfficient = () => {
    let sufficients = true
    const inputs= document.getElementsByTagName('input');
    const data = [];

    calculationResults.map((r, i) => {
      let netIncome = r.netIncome
      goals.forEach((goal,index) => {
        if(check[index]) {
          const pay = r.goalPayments.find(
              (g) => Object.keys(g)[0] === goal.clientGoalName
          )
          netIncome = netIncome - parseFloat(pay[goal.clientGoalName]);
        }
      })
      if(netIncome<0) {
        sufficients=false
      }
      data.push(netIncome)
    })

    goals.forEach((goal, index) => {
      if(check[index]){
      }
      if (goal < 0) {
        sufficients = false
      }
    })
    const chartData = {
      labels: [1,2,3,4,5],
      datasets: [{
          label: 'กระแสเงินสดสุทธิหลังหักเป้าหมาย',
          data: data,
          borderWidth: 1,
          borderColor: '#FF6384',
        },
      ]
    }
    const onCheckBoxClick = (index) => {
      const initCheck=[];
      check.forEach((value, i) => {
        if(i===index){
          initCheck.push(!value)
        }
        else {
          initCheck.push(value)
        }
      })
      setCheck(initCheck)
    }

    return (
        <div className="text-3xl flex flex-col w-full items-center border-black border-2 rounded-2xl p-4">
          {
            sufficients
                ?
                <div className={"mb-8 text-[green] flex gap-2"}>
                  "{"คุณมีกระเเสเงินสดเพียงพอต่อการออมเพื่อ"} {
                  goals.map((goal, index)=> {
                    if(check[index]){
                      return <div>{goal.clientGoalName}</div>
                    }
                  })
                  }"
                </div>
                :
                <div className={"mb-8 text-[red] flex gap-2"}>
                  "{"คุณมีกระเเสเงินสดไม่เพียงพอต่อการออมเพื่อ"} {
                  goals.map((goal, index)=> {
                    if(check[index]){
                      return <div>{goal.clientGoalName}</div>
                    }
                  })
                  }"
                </div>
          }
          <div className="m-2">กราฟเเสดงความเพียงพอของกระเเสเงินสดสำหรับเป้าหมายในเเต่ละปี</div>
          <div className="flex w-full px-60">
            <div className="w-full">
              <Line data={chartData} />
            </div>
            <div className="absolute right-0 mr-[10%] mt-[10%] flex flex-col gap-2 text-base">
              {goals.map((goal, index)=>{
                return (
                    <div className="flex gap-x-2 items-center">
                      <input className="w-6 h-6" type="checkbox" checked={check[index]} onChange={()=>onCheckBoxClick(index)}/>{goal.clientGoalName}
                    </div>
                )
              })}
            </div>
          </div>
        </div>
    )
  };

  const DashboardCashFlowBasedGoalDetail = () => {
    return (
        <div className="text-xl flex flex-col w-full items-start border-black border-2 rounded-2xl p-4 min-w-[300px]">
          <div className="text-2xl mb-2">รายละเอียดของแต่ละเป้าหมาย</div>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                ชื่อเป้าหมาย
              </th>
              <th className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                จำนวนเงินเพื่อเป้าหมาย
              </th>
              <th className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                ระยะเวลาเป้าหมาย (ปี)
              </th>
            </tr>
            </thead>
            <tbody>
            {goals.map((goal) => (
                <tr key={goal.clientGoalName}>
                  <td className="py-2 px-4 border">
                    {goal.clientGoalName}
                  </td>
                  <td className="py-2 px-4 border">
                    {goal.clientGoalValue.toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border">
                    {goal.clientGoalPeriod}
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
    )
  };
  const DashboardCashFlowBasedAnnualNetCashFlow = () => {
    const years=[];
    const data= calculationResults.map((result, index) => {
      if(result.netIncome!==0) {
        years.push(index + 1);
      }
      return result.netIncome
    });
    const chartData = {
      labels: years,
      datasets: [{
        label: 'กระเเสเงินสดสุทธิ',
        data: data,
        borderWidth: 1,
        borderColor: '#FF6384',
      }]
    }
    return (
        <div className="text-xl flex flex-col w-full items-start border-black border-2 rounded-2xl p-4 min-w-[300px]">
          <div className="text-2xl mb-2">กระเเสเงินสดสุทธิเเต่ละปี</div>
          <div className="w-full">
            <Line data={chartData} />
          </div>
        </div>
    )
  };

  function print(){
    const element = document.getElementById('print');
    html2canvas(element).then(canvas => {
      // Append the canvas to the body or save it as an image
      document.body.appendChild(canvas);
      const link = document.createElement('a');
      link.download = 'element-capture.png';
      link.href = canvas.toDataURL('image/png');
      canvas.remove()
      link.click();
      document.delete(link)
    });
  }
  return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <CfpClientSidePanel />
          <div className="flex-1 p-4 space-y-8 w-full">
            <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
            >
              <div className="flex space-x-4 justify-end">
                <button
                    onClick={handleNavigateBack}
                    className="bg-tfpa_blue hover:bg-tfpa_blue_hover text-white px-6 py-2 rounded font-ibm"
                >
                  กลับ
                </button>
              </div>
              <div id="print">
                <div className="flex flex-col w-full p-4 gap-8 text-tfpa_blue">
                  <DashboardCashFlowBasedEfficient/>
                  <div className="flex gap-8 flex-col xl:flex-row">
                    <DashboardCashFlowBasedGoalDetail/>
                    <DashboardCashFlowBasedAnnualNetCashFlow/>
                  </div>
                </div>
              </div>
              <center>
                <button
                    onClick={print}
                    className="bg-tfpa_blue hover:bg-tfpa_blue_hover text-white px-8 py-2 rounded text-2xl font-bold mt-8 rounded-2xl"
                >
                  Print
                </button>
              </center>
            </motion.div>
          </div>
        </div>
        <Footer />
      </div>
  )
}
