import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Footer from "../components/footer.jsx"
import Header from "../components/header.jsx"
import ClientBluePanel from "../components/clientBluePanel.jsx"

export default function PortfolioSelectionCFP() {
  const { clientId } = useParams()
  const { cfpId } = useParams()
  const [assets, setAssets] = useState([])
  const [investType, setInvestType] = useState("เลือก")
  const [investName, setInvestName] = useState("")
  const [investAmount, setInvestAmount] = useState("")
  const [yearlyReturn, setYearlyReturn] = useState(0)
  const [customReturn, setCustomReturn] = useState("")
  const navigate = useNavigate()

  // Returns the appropriate year return based on investment type
  const calculateYearlyReturn = (type) => {
    switch (type) {
      case "หุ้นไทย":
        return 0.075
      case "หุ้นต่างประเทศ":
        return 0.145 // Corrected percentage
      case "เงินฝาก":
        return 0.004
      case "ทองคำ":
        return 0.0778
      case "ตราสารหนี้":
        return 0.035
      case "หุ้นกู้":
        return 0.03
      case "การลงทุนอื่นๆ":
        return parseFloat(customReturn) / 100 || 0 // Custom return if applicable
      default:
        return 0
    }
  }

  useEffect(() => {
    // Fetch existing assets from the database
    const fetchAssets = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/assets/${clientId}` // Adjust the URL as needed
        )
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        const data = await response.json()
        setAssets(data)
      } catch (error) {
        console.error("Error fetching assets:", error)
      }
    }

    fetchAssets()
  }, [clientId])

  const handleCreateAsset = async () => {
    const newAsset = {
      id: {
        clientId: clientId,
        investName: investName,
      },
      investType,
      investAmount: parseFloat(investAmount),
      yearlyReturn: calculateYearlyReturn(investType),
    }

    try {
      const response = await fetch(`http://localhost:8080/api/assets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAsset),
      })

      if (!response.ok) {
        throw new Error("Failed to create asset")
      }

      const createdAsset = await response.json()
      setAssets((prev) => [...prev, createdAsset])
      // Reset input fields
      setInvestType("เลือก")
      setInvestName("")
      setInvestAmount("")
      setCustomReturn("")
    } catch (error) {
      console.error("Error creating asset:", error)
    }
  }

  const handleDeleteAsset = async (asset) => {
    const { clientId, investName } = asset.id // Extracting clientId and investName from the asset

    try {
      const response = await fetch(
        `http://localhost:8080/api/assets/${clientId}/${investName}`,
        {
          method: "DELETE",
        }
      )

      if (!response.ok) {
        throw new Error("Failed to delete asset")
      }

      // Remove the deleted asset from the state
      setAssets(
        (prev) => prev.filter((a) => a.id.investName !== investName) // Adjust the filter logic as needed
      )
    } catch (error) {
      console.error("Error deleting asset:", error)
    }
  }

  const handleNavigateToChart = () => {
    navigate(`/${cfpId}/portfolio-chart/${clientId}`)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <ClientBluePanel></ClientBluePanel>
        <div className="flex-1 p-4">
          <div className="mb-4">
            <h3 className="text-lg mb-2">สร้างสินทรัพย์</h3>
            <select
              value={investType}
              onChange={(e) => {
                const selectedType = e.target.value
                setInvestType(selectedType)
                const returnValue = calculateYearlyReturn(selectedType) // Calculate based on selected type
                setYearlyReturn(returnValue) // Set the new return immediately
              }}
              className="border rounded p-2 mb-2 w-full"
            >
              <option value="เลือก">เลือก</option>
              <option value="หุ้นไทย">หุ้นไทย</option>
              <option value="หุ้นต่างประเทศ">หุ้นต่างประเทศ</option>
              <option value="หุ้นกู้">หุ้นกู้</option>
              <option value="ตราสารหนี้">ตราสารหนี้</option>
              <option value="ทองคำ">ทองคำ</option>
              <option value="เงินฝาก">เงินฝาก</option>
              <option value="การลงทุนอื่นๆ">การลงทุนอื่นๆ</option>
            </select>

            {investType === "การลงทุนอื่นๆ" && (
              <input
                type="text"
                placeholder="ผลตอบแทนต่อปี (%)"
                value={customReturn}
                onChange={(e) => setCustomReturn(e.target.value)}
                className="border rounded p-2 mb-2 w-full"
              />
            )}
            <input
              type="text"
              placeholder="ชื่อการลงทุน"
              value={investName}
              onChange={(e) => setInvestName(e.target.value)}
              className="border rounded p-2 mb-2 w-full"
            />
            <input
              type="number"
              placeholder="มูลค่าที่ลงทุนปัจจุบัน"
              value={investAmount}
              onChange={(e) => setInvestAmount(e.target.value)}
              className="border rounded p-2 mb-2 w-full"
            />
            <p className="mb-2">
              ผลตอบแทนต่อปี: {((yearlyReturn || 0) * 100).toFixed(2)}%
            </p>
            <button
              onClick={handleCreateAsset}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              เพิ่ม
            </button>
          </div>
          <h3 className="text-lg mb-2">สินทรัพย์ปัจจุบัน</h3>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border">ประเภทการลงทุน</th>
                <th className="py-2 px-4 border">ชื่อการลงทุน</th>
                <th className="py-2 px-4 border">มูลค่าที่ลงทุน</th>
                <th className="py-2 px-4 border">ผลตอบแทนต่อปี</th>
                <th className="py-2 px-4 border">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={`${asset.id.clientId}-${asset.id.investName}`}>
                  <td className="py-2 px-4 border">{asset.investType}</td>
                  <td className="py-2 px-4 border">{asset.id.investName}</td>
                  <td className="py-2 px-4 border">{asset.investAmount}</td>
                  <td className="py-2 px-4 border">
                    {((asset.yearlyReturn || 0) * 100).toFixed(2)}%
                  </td>
                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => handleDeleteAsset(asset)}
                      className="text-red-500"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={handleNavigateToChart}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            สร้างพอร์ต
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}
