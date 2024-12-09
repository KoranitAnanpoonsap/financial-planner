import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Footer from "../components/footer.jsx"
import Header from "../components/header.jsx"
import ClientBluePanel from "../components/clientBluePanel.jsx"
import { Pie } from "react-chartjs-2" // Import the Pie chart component
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js" // Import necessary Chart.js components

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend)

const PortfolioCreationCFP = () => {
  const { clientId } = useParams()
  const { cfpId } = useParams()
  const [totalInvestment, setTotalInvestment] = useState(0)
  const [annualReturn, setAnnualReturn] = useState(0)
  const [assets, setAssets] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch total investment and annual return from the portfolio endpoint
    const fetchPortfolioData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/portfolio/${clientId}`
        )
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        const portfolioData = await response.json()
        setTotalInvestment(portfolioData.totalInvestAmount)
        setAnnualReturn(portfolioData.portfolioReturn)
      } catch (error) {
        console.error("Error fetching portfolio data:", error)
      }
    }

    // Fetch asset data
    const fetchAssets = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/portassets/${clientId}`
        )
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        const data = await response.json()
        setAssets(data)
      } catch (error) {
        console.error("Error fetching asset data:", error)
      }
    }

    fetchPortfolioData()
    fetchAssets()
  }, [clientId])

  const dataForChart = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
  }

  // Function to assign colors based on investment type
  const getColorForType = (type) => {
    switch (type) {
      case "หุ้นไทย":
        return "#FF6384"
      case "หุ้นต่างประเทศ":
        return "#36A2EB"
      case "เงินฝาก":
        return "#FFCE56"
      case "ทองคำ":
        return "#4BC0C0"
      case "ตราสารหนี้":
        return "#9966FF"
      case "หุ้นกู้":
        return "#FF9F40"
      case "การลงทุนอื่นๆ":
        return "#FF6384" // Default color
      default:
        return "#CCCCCC" // Fallback color
    }
  }

  // Prepare data for the pie chart
  const dataMap = {} // Object to accumulate amounts by investment type

  assets.forEach((asset) => {
    const { investType, investAmount } = asset

    // If the investment type already exists, accumulate the amount
    if (dataMap[investType]) {
      dataMap[investType] += investAmount
    } else {
      dataMap[investType] = investAmount
    }
  })

  // Populate the chart data from the accumulated dataMap
  dataForChart.labels = Object.keys(dataMap) // Get unique investment types
  dataForChart.datasets[0].data = Object.values(dataMap) // Get accumulated amounts
  dataForChart.datasets[0].backgroundColor =
    dataForChart.labels.map(getColorForType) // Assign colors

  const handleEditPortfolio = () => {
    navigate(`/${cfpId}/portfolio-selection/${clientId}`) // Navigate back to PortfolioSelectionCFP
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <ClientBluePanel />
        <div className="flex-1 p-4">
          <div className="flex justify-center mb-4">
            <div style={{ width: "500px", height: "500px" }}>
              <Pie data={dataForChart} />
            </div>
          </div>
          <div className="flex justify-center mb-4">
            <p className="text-lg">
              เงินรวมปัจจุบันในการลงทุน: {totalInvestment.toFixed(2)} บาท
            </p>
          </div>
          <div className="flex justify-center mb-4">
            <p className="text-lg">
              ผลตอบแทนต่อปีของพอร์ตที่ลงทุนปัจจุบัน:{" "}
              {(annualReturn * 100).toFixed(2)} %
            </p>
          </div>
          <div className="flex justify-end mt-4">
            {" "}
            {/* Align the button to the right */}
            <button
              onClick={handleEditPortfolio}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              แก้ไขพอร์ต
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default PortfolioCreationCFP
