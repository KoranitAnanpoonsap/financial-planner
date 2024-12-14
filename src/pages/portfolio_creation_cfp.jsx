import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Footer from "../components/footer.jsx"
import Header from "../components/header.jsx"
import ClientBluePanel from "../components/clientBluePanel.jsx"
import { calculatePortfolioSummary } from "../components/calculations.js"
import PortfolioPieChart from "../components/portfolioPieChart.jsx"

export default function PortfolioCreationCFP() {
  const { clientId } = useParams()
  const { cfpId } = useParams()
  const [totalInvestment, setTotalInvestment] = useState(0)
  const [portfolioReturn, setPortfolioReturn] = useState(0)
  const [assets, setAssets] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
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

        const { totalInvestAmount, portReturn } =
          calculatePortfolioSummary(data)
        setTotalInvestment(totalInvestAmount)
        setPortfolioReturn(portReturn)
      } catch (error) {
        console.error("Error fetching asset data:", error)
      }
    }

    fetchAssets()
  }, [clientId])

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
            <PortfolioPieChart assets={assets} width={500} height={500} />
          </div>
          <div className="flex justify-center mb-4">
            <p className="text-lg font-ibm font-bold text-tfpa_blue">
              เงินรวมปัจจุบันในการลงทุน: {totalInvestment.toLocaleString()} บาท
            </p>
          </div>
          <div className="flex justify-center mb-4">
            <p className="text-lg font-ibm font-bold text-tfpa_blue">
              ผลตอบแทนต่อปีของพอร์ตที่ลงทุนปัจจุบัน:{" "}
              {(portfolioReturn * 100).toFixed(2)} %
            </p>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleEditPortfolio}
              className="bg-red-500 text-white px-4 py-2 rounded font-ibm"
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
