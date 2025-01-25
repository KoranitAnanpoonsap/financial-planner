import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/cfpHeader"
import Footer from "../components/footer"
import CfpClientSidePanel from "../components/cfpClientSidePanel"
import { motion } from "framer-motion"

// Define mappings for asset types, invest types, and invest risks
const assetTypes = [
  { value: 1, label: "สินทรัพย์สภาพคล่อง" },
  { value: 2, label: "สินทรัพย์ส่วนตัว" },
  { value: 3, label: "สินทรัพย์ลงทุนปัจจุบัน" },
  { value: 4, label: "สินทรัพย์อื่นๆ" },
]

const investTypes = [
  { value: 1, label: "หุ้นไทย" },
  { value: 2, label: "หุ้นต่างประเทศ" },
  { value: 3, label: "หุ้นกู้" },
  { value: 4, label: "ตราสารหนี้" },
  { value: 5, label: "ทองคำ" },
  { value: 6, label: "เงินฝาก" },
  { value: 7, label: "การลงทุนอื่นๆ" },
]

const investRisks = [
  { value: 1, label: "เสี่ยงสูง" },
  { value: 2, label: "เสี่ยงปานกลาง" },
  { value: 3, label: "เสี่ยงต่ำ" },
]

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

export default function CFPClientAssetPage() {
  const [clientUuid] = useState(localStorage.getItem("clientUuid") || "")
  const navigate = useNavigate()

  const [assets, setAssets] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [editingAsset, setEditingAsset] = useState(null)

  const [assetType, setAssetType] = useState(0) // 0 represents "เลือก"
  const [assetName, setAssetName] = useState("")
  const [assetAmount, setAssetAmount] = useState("")
  const [buyDate, setBuyDate] = useState("") // for personal asset
  const [investType, setInvestType] = useState(1) // default for invest asset (หุ้นไทย)
  const [investRisk, setInvestRisk] = useState(2) // default for invest asset (เสี่ยงปานกลาง)

  useEffect(() => {
    fetchAssets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientUuid])

  const fetchAssets = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_KEY}api/clientassets/${clientUuid}`
      )
      if (!res.ok) {
        console.error("Failed to fetch assets")
        return
      }
      const data = await res.json()
      setAssets(data)
    } catch (error) {
      console.error("Error fetching assets:", error)
    }
  }

  // Helper functions to get labels from values
  const getAssetTypeLabel = (typeValue) => {
    const type = assetTypes.find((t) => t.value === typeValue)
    return type ? type.label : "ไม่ระบุ"
  }

  const getInvestTypeLabel = (investTypeValue) => {
    const invest = investTypes.find((it) => it.value === investTypeValue)
    return invest ? invest.label : "ไม่ระบุ"
  }

  const getInvestRiskLabel = (investRiskValue) => {
    const risk = investRisks.find((ir) => ir.value === investRiskValue)
    return risk ? risk.label : "ไม่ระบุ"
  }

  const handleCreateOrUpdateAsset = async () => {
    const newAsset = {
      clientUuid: clientUuid,
      clientAssetName: assetName,
      clientAssetType: assetType,
      clientAssetAmount: parseFloat(assetAmount),
      // For personal asset
      clientAssetBuyDate: buyDate ? buyDate : null,
      // For invest asset
      clientAssetInvestType: assetType === 3 ? investType : null,
      clientAssetInvestRisk: assetType === 3 ? investRisk : null,
    }

    let url = `${import.meta.env.VITE_API_KEY}api/clientassets`
    let method = "POST"

    if (editMode && editingAsset) {
      const originalName = editingAsset.clientAssetName

      // If the name was changed, delete the old asset and create a new one
      if (originalName !== assetName) {
        // Delete the original asset
        const deleteRes = await fetch(
          `${
            import.meta.env.VITE_API_KEY
          }api/clientassets/${clientUuid}/${originalName}`,
          { method: "DELETE" }
        )
        if (!deleteRes.ok) {
          console.error("Failed to delete old asset")
          return
        }

        // Use POST to create the new asset with the updated name
        method = "POST"
      } else {
        // If the name wasn't changed, just update the asset
        url = `${
          import.meta.env.VITE_API_KEY
        }api/clientassets/${clientUuid}/${originalName}`
        method = "PUT"
      }
    }

    const res = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAsset),
    })

    if (!res.ok) {
      console.error("Failed to create/update asset")
      return
    }

    await res.json()

    // Refresh the asset list and reset fields
    await fetchAssets()
    resetFields()
  }

  const handleDeleteAsset = async (ast) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_KEY}api/clientassets/${clientUuid}/${
        ast.clientAssetName
      }`,
      { method: "DELETE" }
    )
    if (!res.ok) {
      console.error("Failed to delete asset")
      return
    }

    // Refresh list
    await fetchAssets()
  }

  const handleEdit = (ast) => {
    setEditMode(true)
    setEditingAsset(ast)
    setAssetType(ast.clientAssetType)
    setAssetName(ast.clientAssetName)
    setAssetAmount(ast.clientAssetAmount.toString())
    setBuyDate(ast.clientAssetBuyDate || "")

    if (ast.clientAssetType === 3) {
      setInvestType(ast.clientAssetInvestType || 1)
      setInvestRisk(ast.clientAssetInvestRisk || 2)
    } else {
      setInvestType(1)
      setInvestRisk(2)
    }
  }

  const handleCancelEdit = () => {
    resetFields()
  }

  const resetFields = () => {
    setEditMode(false)
    setEditingAsset(null)
    setAssetType(0)
    setAssetName("")
    setAssetAmount("")
    setBuyDate("")
    setInvestType(1)
    setInvestRisk(2)
  }

  const handleBack = () => {
    // Navigate back to client expense page
    navigate(`/client-expense/`)
  }

  const handleNext = () => {
    // navigate to client debt page
    navigate(`/client-debt/`)
  }

  return (
    <div className="flex flex-col min-h-screen font-ibm">
      <Header />
      <div className="flex flex-1">
        <CfpClientSidePanel />
        <div className="flex-1 p-8 space-y-8">
          {/* Steps at the top */}
          <div className="flex items-center justify-center space-x-8 mb-8">
            <button
              onClick={() => navigate(`/client-info/`)}
              className="flex flex-col items-center focus:outline-none text-gray-400"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <span className="font-bold mt-1">ข้อมูลส่วนตัว</span>
            </button>
            <div className="h-px bg-gray-300 w-24"></div>
            <button
              onClick={() => navigate(`/client-income/`)}
              className="flex flex-col items-center focus:outline-none text-gray-400"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <span className="font-bold mt-1">รายได้</span>
            </button>
            <div className="h-px bg-gray-300 w-24"></div>
            <button
              onClick={() => navigate(`/client-expense/`)}
              className="flex flex-col items-center focus:outline-none text-gray-400"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <span className="font-bold mt-1">รายจ่าย</span>
            </button>
            <div className="h-px bg-gray-300 w-24"></div>
            <button
              onClick={() => navigate(`/client-asset/`)}
              className="flex flex-col items-center focus:outline-none text-gray-400"
            >
              <div className="w-10 h-10 bg-tfpa_gold text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <span className="font-bold text-tfpa_blue mt-1">สินทรัพย์</span>
            </button>
            <div className="h-px bg-gray-300 w-24"></div>
            <button
              onClick={() => navigate(`/client-debt/`)}
              className="flex flex-col items-center focus:outline-none text-gray-400"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <span className="font-bold mt-1">หนี้สิน</span>
            </button>
          </div>
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <h3 className="text-tfpa_blue font-bold text-lg mb-4">
              4. สินทรัพย์
            </h3>
            <div className="space-y-4">
              {/* Asset Type */}
              <div>
                <label className="block text-tfpa_blue font-bold mb-2">
                  ประเภทสินทรัพย์
                </label>
                <select
                  value={assetType}
                  onChange={(e) => setAssetType(parseInt(e.target.value, 10))}
                  className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                >
                  <option value={0}>เลือก</option>
                  {assetTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Asset Name */}
              <div>
                <label className="block text-tfpa_blue font-bold mb-2">
                  ชื่อสินทรัพย์
                </label>
                <input
                  type="text"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                />
              </div>

              {/* Asset Amount */}
              {assetType !== 0 && (
                <div>
                  <label className="block text-tfpa_blue font-bold mb-2">
                    มูลค่าปัจจุบัน (บาท)
                  </label>
                  <input
                    type="number"
                    value={assetAmount}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => setAssetAmount(e.target.value)}
                    className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                  />
                </div>
              )}

              {/* Buy Date for Personal Asset */}
              {assetType === 2 && (
                <div>
                  <label className="block text-tfpa_blue font-bold mb-2">
                    วันที่ซื้อสินทรัพย์
                  </label>
                  <input
                    type="date"
                    value={buyDate}
                    onChange={(e) => setBuyDate(e.target.value)}
                    className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                    placeholder="mm/dd/yyyy"
                  />
                </div>
              )}

              {/* Invest Type and Risk for Invest Asset */}
              {assetType === 3 && (
                <>
                  <div>
                    <label className="block text-tfpa_blue font-bold mb-2">
                      ประเภทการลงทุน
                    </label>
                    <select
                      value={investType}
                      onChange={(e) =>
                        setInvestType(parseInt(e.target.value, 10))
                      }
                      className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                    >
                      {investTypes.map((it) => (
                        <option key={it.value} value={it.value}>
                          {it.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-tfpa_blue font-bold mb-2">
                      ความเสี่ยงในการลงทุน
                    </label>
                    <select
                      value={investRisk}
                      onChange={(e) =>
                        setInvestRisk(parseInt(e.target.value, 10))
                      }
                      className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                    >
                      {investRisks.map((ir) => (
                        <option key={ir.value} value={ir.value}>
                          {ir.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4 mt-4">
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

            {/* Existing Assets Table */}
            <h3 className="text-tfpa_blue font-bold text-lg mt-4">
              สินทรัพย์ที่มีอยู่
            </h3>
            <table className="min-w-full bg-white border border-gray-300 mt-4 mb-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                    ประเภทสินทรัพย์
                  </th>
                  <th className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                    ชื่อสินทรัพย์
                  </th>
                  <th className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                    มูลค่าปัจจุบัน (บาท)
                  </th>
                  <th className="py-2 px-4 border font-ibm font-bold text-tfpa_blue">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody>
                {assets.map((ast) => (
                  <tr key={`${ast.clientUuid}-${ast.clientAssetName}`}>
                    <td className="py-2 px-4 border">
                      {getAssetTypeLabel(ast.clientAssetType)}
                    </td>
                    <td className="py-2 px-4 border">{ast.clientAssetName}</td>
                    <td className="py-2 px-4 border text-right">
                      {ast.clientAssetAmount.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border">
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleEdit(ast)}
                          className="bg-tfpa_blue hover:bg-tfpa_blue_hover text-white px-4 py-1 rounded font-ibm"
                        >
                          แก้ไข
                        </button>
                        <button
                          onClick={() => handleDeleteAsset(ast)}
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

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="bg-gray-300 hover:bg-gray-400 text-tfpa_blue px-4 py-2 rounded font-ibm font-bold"
              >
                กลับ
              </button>
              <button
                onClick={handleNext}
                className="bg-tfpa_blue hover:bg-tfpa_blue_hover text-white px-4 py-2 rounded font-ibm font-bold"
              >
                ถัดไป
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
