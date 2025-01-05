import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Footer from "../components/footer.jsx"
import Header from "../components/header.jsx"
import ClientBluePanel from "../components/clientBluePanel.jsx"
import { motion } from "framer-motion"

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

export default function PortfolioSelectionCFP() {
  const [cfpId] = useState(Number(localStorage.getItem("cfpId")) || "")
  const [clientId] = useState(Number(localStorage.getItem("clientId")) || "")
  const [assets, setAssets] = useState([])
  const [investType, setInvestType] = useState("เลือก")
  const [investName, setInvestName] = useState("")
  const [investAmount, setInvestAmount] = useState("")
  const [yearlyReturn, setYearlyReturn] = useState(0)
  const [customReturn, setCustomReturn] = useState("")
  const navigate = useNavigate()

  const [editMode, setEditMode] = useState(false)
  const [editingAsset, setEditingAsset] = useState(null)

  const investmentTypes = [
    "หุ้นไทย",
    "หุ้นต่างประเทศ",
    "หุ้นกู้",
    "ตราสารหนี้",
    "ทองคำ",
    "เงินฝาก",
    "การลงทุนอื่นๆ",
  ]

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
          `http://localhost:8080/api/portassets/${clientId}` // Adjust the URL as needed
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

  const handleCreateOrUpdateAsset = async () => {
    const assetObj = {
      id: {
        clientId: clientId,
        investName: investName,
      },
      investType,
      investAmount: parseFloat(investAmount),
      yearlyReturn: calculateYearlyReturn(investType),
    }

    let url = `http://localhost:8080/api/portassets`
    let method = "POST"
    if (editMode && editingAsset) {
      url = `http://localhost:8080/api/portassets/${clientId}/${investName}`
      method = "PUT"
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assetObj),
      })

      if (!response.ok) {
        throw new Error("Failed to create/update asset")
      }

      // If successful, refresh the list
      const data = await response.json()

      // Refresh assets by refetching
      await fetchAssetsAgain()

      // Reset fields
      resetFields()
    } catch (error) {
      console.error("Error creating/updating asset:", error)
    }
  }

  const fetchAssetsAgain = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/portassets/${clientId}`
      )
      if (!response.ok) {
        throw new Error("Failed to fetch assets")
      }
      const data = await response.json()
      setAssets(data)
    } catch (error) {
      console.error("Error fetching assets:", error)
    }
  }

  const handleDeleteAsset = async (asset) => {
    const { clientId, investName } = asset.id

    try {
      const response = await fetch(
        `http://localhost:8080/api/portassets/${clientId}/${investName}`,
        {
          method: "DELETE",
        }
      )

      if (!response.ok) {
        throw new Error("Failed to delete asset")
      }

      // Remove the deleted asset from the state
      setAssets((prev) => prev.filter((a) => a.id.investName !== investName))
    } catch (error) {
      console.error("Error deleting asset:", error)
    }
  }

  const handleEdit = (asset) => {
    setEditMode(true)
    setEditingAsset(asset)
    setInvestType(asset.investType)
    setInvestName(asset.id.investName)
    setInvestAmount(asset.investAmount.toString())

    // If it's "การลงทุนอื่นๆ", find the custom return from yearlyReturn
    if (asset.investType === "การลงทุนอื่นๆ") {
      setCustomReturn((asset.yearlyReturn * 100).toString())
    } else {
      setCustomReturn("")
    }

    setYearlyReturn(asset.yearlyReturn)
  }

  const handleCancelEdit = () => {
    resetFields()
  }

  const resetFields = () => {
    setEditMode(false)
    setEditingAsset(null)
    setInvestType("เลือก")
    setInvestName("")
    setInvestAmount("")
    setCustomReturn("")
    setYearlyReturn(0)
  }

  const handleNavigateToChart = () => {
    navigate(`/portfolio-chart/`)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <ClientBluePanel />
        <div className="flex-1 p-4">
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <div className="mb-4">
              <h3 className="text-lg mb-2 font-ibm font-bold text-tfpa_blue">
                สร้างสินทรัพย์
              </h3>
              <label className="text-tfpa_blue font-ibm font-bold mb-2">
                เลือกสินทรัพย์
              </label>
              <select
                value={investType}
                onChange={(e) => {
                  const selectedType = e.target.value
                  setInvestType(selectedType)
                  const returnValue = calculateYearlyReturn(selectedType)
                  setYearlyReturn(returnValue)
                }}
                className="border rounded p-2 mb-2 w-full font-ibm font-bold text-gray-500"
              >
                <option value="เลือก">เลือก</option>
                {investmentTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {investType === "การลงทุนอื่นๆ" && (
                <>
                  <label className="text-tfpa_blue font-ibm font-bold mb-2">
                    ผลตอบแทนต่อปี (%)
                  </label>
                  <input
                    type="text"
                    placeholder="ผลตอบแทนต่อปี (%)"
                    value={customReturn}
                    onChange={(e) => {
                      setCustomReturn(e.target.value)
                      const val = parseFloat(e.target.value) / 100 || 0
                      setYearlyReturn(val)
                    }}
                    className="border rounded p-2 mb-2 w-full font-ibm"
                  />
                </>
              )}
              <label className="text-tfpa_blue font-ibm font-bold mb-2">
                ชื่อการลงทุน
              </label>
              <input
                type="text"
                placeholder="ชื่อการลงทุน"
                value={investName}
                onChange={(e) => setInvestName(e.target.value)}
                className="border rounded p-2 mb-2 w-full font-ibm"
              />
              <label className="text-tfpa_blue font-ibm font-bold mb-2">
                มูลค่าที่ลงทุนปัจจุบัน
              </label>
              <input
                type="number"
                placeholder="มูลค่าที่ลงทุนปัจจุบัน"
                value={investAmount}
                onChange={(e) => setInvestAmount(e.target.value)}
                className="border rounded p-2 mb-2 w-full font-ibm"
              />
              <p className="mb-2 font-ibm font-bold text-tfpa_blue">
                ผลตอบแทนต่อปี: {((yearlyReturn || 0) * 100).toFixed(2)}%
              </p>
              <div className="flex space-x-4">
                {editMode ? (
                  <>
                    <button
                      onClick={handleCreateOrUpdateAsset}
                      className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded font-ibm font-bold"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-300 hover:bg-gray-400 text-tfpa_blue px-4 py-2 rounded font-ibm font-bold"
                    >
                      ยกเลิก
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleCreateOrUpdateAsset}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-ibm font-bold"
                  >
                    เพิ่ม
                  </button>
                )}
              </div>
            </div>
            <h3 className="text-lg mb-2 font-ibm font-bold text-tfpa_blue">
              สินทรัพย์ปัจจุบัน
            </h3>
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200 font-ibm font-bold text-tfpa_blue">
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
                    <td className="py-2 px-4 border">
                      {asset.investAmount.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border">
                      {((asset.yearlyReturn || 0) * 100).toFixed(2)}%
                    </td>
                    <td className="py-2 px-4 border">
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleEdit(asset)}
                          className="bg-tfpa_blue hover:bg-tfpa_blue_hover text-white px-4 py-1 rounded font-ibm"
                        >
                          แก้ไข
                        </button>
                        <button
                          onClick={() => handleDeleteAsset(asset)}
                          className="bg-red-500 hover:bg-red-700 text-white px-4 py-1 rounded font-ibm"
                        >
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end">
              <button
                onClick={handleNavigateToChart}
                className="mt-4 bg-tfpa_blue hover:bg-tfpa_blue_hover text-white px-4 py-2 rounded font-ibm font-bold"
              >
                สร้างพอร์ต
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
