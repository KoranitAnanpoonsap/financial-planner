import { useEffect, useState } from "react"
import Footer from "../components/footer.jsx"
import Header from "../components/header.jsx"
import ClientBluePanel from "../components/clientBluePanel.jsx"
import { motion } from "framer-motion"
import {Line} from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


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

// Import the calculation functions
import {
    calculatePortfolioSummary,
    calculateYearlyIncome,
    calculateYearlyExpense,
    calculateGoalPayments,
} from "../utils/calculations.js"

export default function CFPCashflowBaseDashboard() {
    const [clientId] = useState(Number(localStorage.getItem("clientId")) || "")

    const [incomes, setIncomes] = useState([])
    const [expenses, setExpenses] = useState([])
    const [goals, setGoals] = useState([])
    const [portfolioReturn, setPortfolioReturn] = useState(0)

    const years = [1, 2, 3, 4, 5];

    const [selectedGoals, setSelectedGoals] = useState([])
    const [buttonStatus, setButtonStatus] = useState([])

    useEffect(() => {
        fetchAllData()
    }, [clientId])

    // useEffect(() => {
    //
    // },[])


    const fetchAllData = async () => {
        try {
            const [incomesRes, expensesRes, goalsRes, assetsRes] = await Promise.all([
                fetch(`http://localhost:8080/api/clientincome/${clientId}`),
                fetch(`http://localhost:8080/api/clientexpense/${clientId}`),
                fetch(`http://localhost:8080/api/cashflow/${clientId}`),
                fetch(`http://localhost:8080/api/portassets/${clientId}`),
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


            const newButtonStatus = []
            goalsData.forEach(() => {
                newButtonStatus.push(false);
            })
            setButtonStatus(newButtonStatus)

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

    const CashFlowSufficientAllGoals = () => {
        let sufficients = true;
        calculationResults.forEach((r)=>{
            if(r.netIncomeAfterGoals<0){
                sufficients = false
            }
        })
        return (
            <div className="w-[300px] h-[300px] bg-gray-50 flex flex-col items-center py-1 gap-1">
                <div className="w-full h-8 bg-tfpa_light_blue flex flex-col items-center justify-center">
                </div>
                <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
                    กระแสเงินสดเพียงพอ
                    <br/>
                    ต่อการออม
                    <br/>
                    เพื่อทุกเป้าหมาย
                    <span className="text-[48px] font-bold font-sans">
                        {sufficients ? "เพียงพอ":"ไม่เพียงพอ"}
                </span>
                </div>
            </div>
        );
    }

    const IncomeExpenseChart = () => {

        const xValues = years.map((year) => {
            return "ปีที่ "+year
        });
        const Incomes = calculationResults.map((result) => {
            return result.totalIncome;
        })
        const Expenses = calculationResults.map((result) => {
            return result.totalExpense;
        })

        const chartData={
            labels: xValues,
            datasets: [
                {
                    label: 'รายได้',
                    tension: 0,
                    borderColor: "rgba(19, 83, 138, 0.5)",
                    data: Incomes,
                },
                {
                    label: 'รายจ่าย',
                    tension: 0,
                    borderColor: "rgba(235, 67, 67, 0.5)",
                    data: Expenses,
                },
            ],
        };
        return (
            <div className="flex w-[550px]">
                <Line data={chartData}/>
            </div>
        )
    };



    const CashFlowSufficientSelectedGoals = () => {
        let sufficients = true;
        selectedGoals.forEach((goal) => {
            if (goal < 0) {
                sufficients = false;
            }
        })
        let goalList="";
        buttonStatus.forEach((status , index) => {
            if(status) {
                let goalName = ""
                goalName += goals[index].id.clientGoalName + ", ";
                goalList+=goalName;
            }
        })
        return (
            <div className="w-[300px] h-[300px] bg-gray-50 flex flex-col items-center py-1 gap-1">
                <div className="w-full h-8 bg-tfpa_light_blue flex flex-col items-center justify-center">
                </div>
                <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
                    กระแสเงินสดเพียงพอ
                    <br/>
                    ต่อการออมของเป้าหมาย
                    <br/>
                    <span className="text-[26px] font-bold text-[#219DFF]">
                        {goalList.slice(0, -2)}
                    </span>
                    <span className="text-[48px] font-bold font-sans">
                        {goalList.length===0 ? "-" : sufficients ? "เพียงพอ": "ไม่เพียงพอ"}
                </span>
                </div>
            </div>
        );
    }

    const CashFlowDeductedSelectedGoals = () => {
        const xValues = years.map((year) => {
            return "ปีที่ "+year;
        });

        const chartData={
            labels: xValues,
            datasets: [
                {
                    label: 'กระแสเงินสดสุทธิตามเป้าหมายที่เลือก',
                    tension: 0,
                    borderColor: "rgba(19, 83, 138, 0.5)",
                    data: selectedGoals.length>0?selectedGoals:calculationResults.map(r=>r.netIncome),
                },
            ],
        };
        return (
            <div className="flex w-[550px]">
                <Line data={chartData}/>
            </div>
        )
    }

    const CashFlowSelectedGoalsAnalysis = () => {
        const selectGoals = (e, buttonCount) => {
            e.preventDefault();
            const newButtonStatus=[...buttonStatus];
            newButtonStatus[buttonCount]=!newButtonStatus[buttonCount];

            const newSelectedGoals=[];
            calculationResults.forEach((r)=>{
                let cumulate=0;
                r.goalPayments.forEach((payment, index) => {
                    if(newButtonStatus[index]) {
                        cumulate += parseFloat(payment[goals[index].id.clientGoalName])
                    }
                });
                newSelectedGoals.push(r.netIncome-cumulate);
            })
            setSelectedGoals(newSelectedGoals)
            setButtonStatus(newButtonStatus)
        };

        return (
            <>
                <div className="w-full h-[5px] flex bg-tfpa_blue rounded-3xl my-5"></div>
                <div className="w-full flex flex-row gap-2 items-center justify-center text-3xl">
                    <div className="flex gap-10">
                        {goals.map((goal,index) => {
                            return (
                                <>
                                    <div className="mx-1 flex gap-1">
                                        <input type="checkbox"
                                               className="w-[25px]"
                                               onChange={(e)=>selectGoals(e, index)} checked={buttonStatus[index]}/>
                                        <span className="">
                                            {goal.id.clientGoalName}
                                        </span>
                                    </div>
                                </>
                            );
                        })}
                    </div>
                </div>
                <CashFlowSufficientSelectedGoals/>
                <CashFlowDeductedSelectedGoals/>
            </>
                );
                }
                return (
        <div className="flex flex-col min-h-screen font-ibm font-bold text-tfpa_blue">
            <Header />
            <div className="flex flex-1">
                <ClientBluePanel />
                <div className="flex-1 p-4 space-y-8">
                    <motion.div
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                    >
                        <div className="flex flex-row py-1 px-10 gap-2 items-center justify-between flex-wrap">
                        <CashFlowSufficientAllGoals />
                        <IncomeExpenseChart/>
                            <CashFlowSelectedGoalsAnalysis/>
                        </div>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
