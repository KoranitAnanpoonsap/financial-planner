import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Footer from "../components/footer.jsx"
import Header from "../components/cfpHeader.jsx"
import CfpClientSidePanel from "../components/cfpClientSidePanel.jsx"
import { calculatePortfolioSummary } from "../utils/calculations.js"
import PortfolioPieChart from "../components/portfolioPieChart.jsx"
import { motion } from "framer-motion"

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 1 },
}

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.8,
}

export default function PortfolioCreationCFP() {
  const [clientUuid] = useState(localStorage.getItem("clientUuid") || "")
  const [totalInvestment, setTotalInvestment] = useState(0)
  const [portfolioReturn, setPortfolioReturn] = useState(0)
  const [assets, setAssets] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_KEY}api/portassets/${clientUuid}`
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
  }, [clientUuid])

  const handleEditPortfolio = () => {
    navigate(`/portfolio-selection/`) // Navigate back to PortfolioSelectionCFP
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <CfpClientSidePanel />
        <div className="flex-1 p-4">
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <div className="flex justify-center mb-4">
              <PortfolioPieChart assets={assets} width={500} height={500} />
            </div>
            <div className="flex justify-center mb-4">
              <p className="text-lg font-ibm font-bold text-tfpa_blue">
                เงินรวมปัจจุบันในการลงทุน: {totalInvestment.toLocaleString()}{" "}
                บาท
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
                className="bg-gray-300 hover:bg-gray-400 text-tfpa_blue px-4 py-2 rounded font-ibm font-bold"
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
