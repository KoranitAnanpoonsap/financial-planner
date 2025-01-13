import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Header from "../components/header"
import Footer from "../components/footer"
import CfpClientSidePanel from "../components/cfpClientSidePanel"
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

export default function CFPClientAssetPage() {
  const [cfpId] = useState(Number(localStorage.getItem("cfpId")) || "")
  const [clientId] = useState(Number(localStorage.getItem("clientId")) || "")
  const navigate = useNavigate()

  const [assets, setAssets] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [editingAsset, setEditingAsset] = useState(null)

  const [assetType, setAssetType] = useState("เลือก")
  const [assetName, setAssetName] = useState("")
  const [assetAmount, setAssetAmount] = useState("")
  const [buyDate, setBuyDate] = useState("") // for personal asset
  const [investType, setInvestType] = useState("หุ้นไทย") // default for invest asset
  const [investRisk, setInvestRisk] = useState("เสี่ยงปานกลาง") // default for invest asset

  const assetTypes = [
    "สินทรัพย์สภาพคล่อง",
    "สินทรัพย์ส่วนตัว",
    "สินทรัพย์ลงทุนปัจจุบัน",
    "สินทรัพย์อื่นๆ",
  ]

  const investTypes = [
    "หุ้นไทย",
    "หุ้นต่างประเทศ",
    "หุ้นกู้",
    "ตราสารหนี้",
    "ทองคำ",
    "เงินฝาก",
    "การลงทุนอื่นๆ",
  ]

  const investRisks = ["เสี่ยงสูง", "เสี่ยงต่ำ", "เสี่ยงปานกลาง"]

  useEffect(() => {
    fetchAssets()
  }, [clientId])

  const fetchAssets = async () => {
    const res = await fetch(
      `http://localhost:8080/api/clientassets/${clientId}`
    )
    if (!res.ok) {
      console.error("Failed to fetch assets")
      return
    }
    const data = await res.json()
    setAssets(data)
  }

  const handleCreateOrUpdateAsset = async () => {
    const newAsset = {
      id: {
        clientId: parseInt(clientId),
        clientAssetName: assetName,
      },
      clientAssetType: assetType,
      clientAssetAmount: parseFloat(assetAmount),
      // For personal asset
      clientAssetBuyDate: buyDate ? buyDate : null,
      // For invest asset
      clientAssetInvestType:
        assetType === "สินทรัพย์ลงทุนปัจจุบัน" ? investType : null,
      clientAssetInvestRisk:
        assetType === "สินทรัพย์ลงทุนปัจจุบัน" ? investRisk : null,
    }

    let url = `http://localhost:8080/api/clientassets`
    let method = "POST"

    if (editMode && editingAsset) {
      const originalName = editingAsset.id.clientAssetName

      // If the name was changed, delete the old asset and create a new one
      if (originalName !== assetName) {
        // Delete the original asset
        const deleteRes = await fetch(
          `http://localhost:8080/api/clientassets/${clientId}/${originalName}`,
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
        url = `http://localhost:8080/api/clientassets/${clientId}/${originalName}`
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
    const { clientId: cId, clientAssetName } = ast.id
    const res = await fetch(
      `http://localhost:8080/api/clientassets/${cId}/${clientAssetName}`,
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
    setAssetName(ast.id.clientAssetName)
    setAssetAmount(ast.clientAssetAmount.toString())
    setBuyDate(ast.clientAssetBuyDate || "")

    if (ast.clientAssetType === "สินทรัพย์ลงทุนปัจจุบัน") {
      setInvestType(ast.clientAssetInvestType || "หุ้นไทย")
      setInvestRisk(ast.clientAssetInvestRisk || "เสี่ยงปานกลาง")
    } else {
      setInvestType("หุ้นไทย")
      setInvestRisk("เสี่ยงปานกลาง")
    }
  }

  const handleCancelEdit = () => {
    resetFields()
  }

  const resetFields = () => {
    setEditMode(false)
    setEditingAsset(null)
    setAssetType("เลือก")
    setAssetName("")
    setAssetAmount("")
    setBuyDate("")
    setInvestType("หุ้นไทย")
    setInvestRisk("เสี่ยงปานกลาง")
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
              <span className="font-bold">ข้อมูลส่วนตัว</span>
            </button>
            <div className="h-px bg-gray-300 w-24"></div>
            <button
              onClick={() => navigate(`/client-income/`)}
              className="flex flex-col items-center focus:outline-none text-gray-400"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <span className="font-bold">รายได้</span>
            </button>
            <div className="h-px bg-gray-300 w-24"></div>
            <button
              onClick={() => navigate(`/client-expense/`)}
              className="flex flex-col items-center focus:outline-none text-gray-400"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <span className="font-bold">รายจ่าย</span>
            </button>
            <div className="h-px bg-gray-300 w-24"></div>
            <button
              onClick={() => navigate(`/client-asset/`)}
              className="flex flex-col items-center focus:outline-none text-gray-400"
            >
              <div className="w-10 h-10 bg-tfpa_gold text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <span className="font-bold text-tfpa_blue">สินทรัพย์</span>
            </button>
            <div className="h-px bg-gray-300 w-24"></div>
            <button
              onClick={() => navigate(`/client-debt/`)}
              className="flex flex-col items-center focus:outline-none text-gray-400"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <span className="font-bold">หนี้สิน</span>
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
              <div>
                <label className="block text-tfpa_blue font-bold mb-2">
                  ประเภทสินทรัพย์
                </label>
                <select
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value)}
                  className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                >
                  <option value="เลือก">เลือก</option>
                  {assetTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

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

              {assetType !== "เลือก" && (
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

              {assetType === "สินทรัพย์ส่วนตัว" && (
                <div>
                  <label className="block text-tfpa_blue font-bold mb-2">
                    วันที่ซื้อสินทรัพย์ (YYYY-MM-DD)
                  </label>
                  <input
                    type="text"
                    value={buyDate}
                    onChange={(e) => setBuyDate(e.target.value)}
                    className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                  />
                </div>
              )}

              {assetType === "สินทรัพย์ลงทุนปัจจุบัน" && (
                <>
                  <div>
                    <label className="block text-tfpa_blue font-bold mb-2">
                      ประเภทการลงทุน
                    </label>
                    <select
                      value={investType}
                      onChange={(e) => setInvestType(e.target.value)}
                      className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                    >
                      {investTypes.map((it) => (
                        <option key={it} value={it}>
                          {it}
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
                      onChange={(e) => setInvestRisk(e.target.value)}
                      className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
                    >
                      {investRisks.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

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
                  <tr key={`${ast.id.clientId}-${ast.id.clientAssetName}`}>
                    <td className="py-2 px-4 border">{ast.clientAssetType}</td>
                    <td className="py-2 px-4 border">
                      {ast.id.clientAssetName}
                    </td>
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
