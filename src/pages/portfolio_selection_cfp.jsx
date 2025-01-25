import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Footer from "../components/footer.jsx"
import Header from "../components/cfpHeader.jsx"
import CfpClientSidePanel from "../components/cfpClientSidePanel.jsx"
import { motion } from "framer-motion"

// Mapping for investment types with numeric keys
const investmentTypes = {
  1: "หุ้นไทย",
  2: "หุ้นต่างประเทศ",
  3: "หุ้นกู้",
  4: "ตราสารหนี้",
  5: "ทองคำ",
  6: "เงินฝาก",
  7: "การลงทุนอื่นๆ",
}

// Default yearly returns based on investment types
const defaultYearlyReturns = {
  1: 0.075, // หุ้นไทย
  2: 0.145, // หุ้นต่างประเทศ
  3: 0.03, // หุ้นกู้
  4: 0.035, // ตราสารหนี้
  5: 0.0778, // ทองคำ
  6: 0.004, // เงินฝาก
  7: 0, // การลงทุนอื่นๆ (user can input)
}

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

export default function PortfolioSelectionCFP() {
  const [clientUuid] = useState(localStorage.getItem("clientUuid") || "")
  const navigate = useNavigate()

  const [assets, setAssets] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [editingAsset, setEditingAsset] = useState(null)

  const [investType, setInvestType] = useState(0) // 0 represents "เลือก"
  const [investName, setInvestName] = useState("")
  const [investAmount, setInvestAmount] = useState("")
  const [yearlyReturn, setYearlyReturn] = useState(0)

  useEffect(() => {
    fetchAssets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientUuid])

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
    } catch (error) {
      console.error("Error fetching assets:", error)
    }
  }

  // Helper functions to get labels from values
  const getInvestmentTypeLabel = (typeValue) => {
    return investmentTypes[typeValue] || "ไม่ระบุ"
  }

  const handleCreateOrUpdateAsset = async () => {
    // Validate required fields
    if (
      investType === 0 ||
      investName.trim() === "" ||
      investAmount === "" ||
      yearlyReturn === 0
    ) {
      return
    }

    const assetObj = {
      clientUuid: clientUuid,
      investName: investName,
      investType: investType,
      investAmount: parseFloat(investAmount),
      yearlyReturn: parseFloat(yearlyReturn) / 100, // Store as decimal
    }

    let url = `${import.meta.env.VITE_API_KEY}api/portassets`
    let method = "POST"

    if (editMode && editingAsset) {
      if (editingAsset.investName !== investName) {
        // If the invest name is being updated, delete the old record and create a new one
        const deleteResponse = await fetch(
          `${
            import.meta.env.VITE_API_KEY
          }api/portassets/${clientUuid}/${encodeURIComponent(
            editingAsset.investName
          )}`,
          {
            method: "DELETE",
          }
        )

        if (!deleteResponse.ok) {
          console.error("Failed to delete asset for update")
          return
        }
      } else {
        // If the name wasn't changed, just update the asset
        url = `${
          import.meta.env.VITE_API_KEY
        }api/portassets/${clientUuid}/${encodeURIComponent(
          editingAsset.investName
        )}`
        method = "PUT"
      }
    }

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assetObj),
      })

      if (!res.ok) {
        throw new Error("Failed to create/update asset")
      }

      await res.json()

      // Refresh assets by refetching
      await fetchAssets()

      // Reset fields
      resetFields()
    } catch (error) {
      console.error("Error creating/updating asset:", error)
    }
  }

  const handleDeleteAsset = async (asset) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_KEY}api/portassets/${clientUuid}/${
          asset.investName
        }`,
        {
          method: "DELETE",
        }
      )

      if (!response.ok) {
        throw new Error("Failed to delete asset")
      }

      // Remove the deleted asset from the state
      setAssets((prev) => prev.filter((a) => a.investName !== asset.investName))
    } catch (error) {
      console.error("Error deleting asset:", error)
    }
  }

  const handleEdit = (asset) => {
    setEditMode(true)
    setEditingAsset(asset)
    setInvestType(asset.investType)
    setInvestName(asset.investName)
    setInvestAmount(asset.investAmount.toString())
    setYearlyReturn((asset.yearlyReturn * 100).toString())
  }

  const handleCancelEdit = () => {
    resetFields()
  }

  const resetFields = () => {
    setEditMode(false)
    setEditingAsset(null)
    setInvestType(0)
    setInvestName("")
    setInvestAmount("")
    setYearlyReturn(0)
  }

  const handleNavigateToChart = () => {
    navigate(`/portfolio-chart/`)
  }

  return (
    <div className="flex flex-col min-h-screen font-ibm">
      <Header />
      <div className="flex flex-1">
        <CfpClientSidePanel />
        <div className="flex-1 p-8 space-y-8">
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            {/* Asset Creation Form */}
            <div className="mb-8">
              <h3 className="text-lg mb-2 font-bold text-tfpa_blue">
                สร้างสินทรัพย์
              </h3>

              {/* Investment Type */}
              <div className="mb-4">
                <label className="block text-tfpa_blue font-bold mb-2">
                  เลือกสินทรัพย์
                </label>
                <select
                  value={investType}
                  onChange={(e) => {
                    const selectedType = parseInt(e.target.value, 10)
                    setInvestType(selectedType)
                    // Set default yearly return based on investment type
                    setYearlyReturn(
                      selectedType !== 7
                        ? (defaultYearlyReturns[selectedType] * 100).toFixed(2)
                        : ""
                    )
                  }}
                  className="border rounded p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                >
                  <option value={0}>เลือก</option>
                  {Object.entries(investmentTypes).map(([key, value]) => (
                    <option key={key} value={parseInt(key, 10)}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Yearly Return for "การลงทุนอื่นๆ" */}
              {investType === 7 && (
                <div className="mb-4">
                  <label className="block text-tfpa_blue font-bold mb-2">
                    ผลตอบแทนต่อปี (%) (สามารถแก้ไขได้)
                  </label>
                  <input
                    type="number"
                    placeholder="ผลตอบแทนต่อปี (%)"
                    value={yearlyReturn}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => setYearlyReturn(e.target.value)}
                    className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                  />
                </div>
              )}

              {/* Yearly Return for other investment types */}
              {investType !== 0 && investType !== 7 && (
                <div className="mb-4">
                  <label className="block text-tfpa_blue font-bold mb-2">
                    ผลตอบแทนต่อปี (%) (สามารถแก้ไขได้)
                  </label>
                  <input
                    type="number"
                    placeholder="ผลตอบแทนต่อปี (%)"
                    value={yearlyReturn}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => setYearlyReturn(e.target.value)}
                    className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                  />
                </div>
              )}

              {/* Investment Name */}
              <div className="mb-4">
                <label className="block text-tfpa_blue font-bold mb-2">
                  ชื่อการลงทุน
                </label>
                <input
                  type="text"
                  placeholder="ชื่อการลงทุน"
                  value={investName}
                  onChange={(e) => setInvestName(e.target.value)}
                  className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                />
              </div>

              {/* Investment Amount */}
              <div className="mb-4">
                <label className="block text-tfpa_blue font-bold mb-2">
                  มูลค่าที่ลงทุนปัจจุบัน (บาท)
                </label>
                <input
                  type="number"
                  placeholder="มูลค่าที่ลงทุนปัจจุบัน"
                  value={investAmount}
                  onWheel={(e) => e.target.blur()}
                  onChange={(e) => setInvestAmount(e.target.value)}
                  className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                />
              </div>

              {/* Display Yearly Return */}
              {investType !== 0 && (
                <p className="mb-4 font-bold text-tfpa_blue">
                  ผลตอบแทนต่อปี: {parseFloat(yearlyReturn).toFixed(2)}%
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4">
                {editMode ? (
                  <>
                    <button
                      onClick={handleCreateOrUpdateAsset}
                      className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded font-bold"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-300 hover:bg-gray-400 text-tfpa_blue px-4 py-2 rounded font-bold"
                    >
                      ยกเลิก
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleCreateOrUpdateAsset}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-bold"
                  >
                    เพิ่ม
                  </button>
                )}
              </div>
            </div>

            {/* Existing Assets Table */}
            <div>
              <h3 className="text-lg mb-2 font-bold text-tfpa_blue">
                สินทรัพย์ปัจจุบัน
              </h3>
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-200 font-bold text-tfpa_blue">
                    <th className="py-2 px-4 border">ประเภทการลงทุน</th>
                    <th className="py-2 px-4 border">ชื่อการลงทุน</th>
                    <th className="py-2 px-4 border">มูลค่าที่ลงทุน</th>
                    <th className="py-2 px-4 border">ผลตอบแทนต่อปี</th>
                    <th className="py-2 px-4 border">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset) => (
                    <tr key={`${asset.clientUuid}-${asset.investName}`}>
                      <td className="py-2 px-4 border">
                        {getInvestmentTypeLabel(asset.investType)}
                      </td>
                      <td className="py-2 px-4 border">{asset.investName}</td>
                      <td className="py-2 px-4 border text-right">
                        {asset.investAmount.toLocaleString()}
                      </td>
                      <td className="py-2 px-4 border text-right">
                        {(asset.yearlyReturn * 100).toFixed(2)}%
                      </td>
                      <td className="py-2 px-4 border">
                        <div className="flex space-x-4">
                          <button
                            onClick={() => handleEdit(asset)}
                            className="bg-tfpa_blue hover:bg-tfpa_blue_hover text-white px-4 py-1 rounded font-bold"
                          >
                            แก้ไข
                          </button>
                          <button
                            onClick={() => handleDeleteAsset(asset)}
                            className="bg-red-500 hover:bg-red-700 text-white px-4 py-1 rounded font-bold"
                          >
                            ลบ
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {assets.length === 0 && (
                    <tr>
                      <td className="py-2 px-4 border text-center" colSpan="5">
                        ไม่มีสินทรัพย์ที่บันทึกไว้
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="flex justify-end">
                <button
                  onClick={handleNavigateToChart}
                  className="mt-4 bg-tfpa_blue hover:bg-tfpa_blue_hover text-white px-4 py-2 rounded font-bold"
                >
                  สร้างพอร์ต
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
