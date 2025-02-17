import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ReactDOM from "react-dom"
import Header from "../components/clientHeader.jsx"
import Footer from "../components/footer.jsx"
import personIcon from "../assets/man.png"
import wallpaper from "../assets/login_wallpaper.jpg"

// Page transition variants
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

// ----- Mapping objects for charge, expertise, and service area -----
const chargeMapping = {
  1: "คิดค่าบริการจัดทำแผนการเงิน",
  2: "คิดค่านายหน้าจากการแนะนำผลิตภัณฑ์",
  3: "คิดค่าธรรมเนียมการให้คำปรึกษาเป็นรายชั่วโมง",
}

const expertiseMapping = {
  1: "การวางแผนการเงินแบบองค์รวม",
  2: "การวางแผนรายรับรายจ่าย",
  3: "การวางแผนลงทุน (จัดพอร์ตการลงทุน/ ปรับพอร์ต)",
  4: "การวางแผนบริหารจัดการหนี้สิน",
  5: "การวางแผนประกันชีวิตและสุขภาพ",
  6: "การวางแผนประกันวินาศภัย (รถ บ้าน อื่นๆ)",
  7: "การวางแผนเกษียณอายุ (ตั้งเป้าหมาย/ลงทุนเพื่อเกษียณ)",
  8: "การวางแผนการศึกษาบุตร",
  9: "การวางแผนภาษีบุคคลธรรมดา",
  10: "การวางแผนภาษีนิติบุคคลและการจดทะเบียนนิติบุคคล",
  11: "การวางแผนมรดก/การจัดทำพินัยกรรม",
  12: "Family holding company & Family charter",
}

const serviceAreaMapping = {
  1: "กรุงเทพมหานครและปริมณฑล",
  2: "ภาคเหนือ",
  3: "ภาคกลาง",
  4: "ภาคตะวันออก",
  5: "ภาคตะวันออกเฉียงเหนือ",
  6: "ภาคตะวันตก",
  7: "ภาคใต้",
}

// Framer Motion variants for modal
const modalVariants = {
  initial: { y: -40, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 20, opacity: 0 },
}

// Client status mapping (numbers to text)
const statusMapping = {
  1: "ส่งคำร้อง",
  2: "กำลังดำเนินการ",
  3: "ดำเนินการเรียบร้อย",
}

function CfpModal({
  cfp,
  onClose,
  onSendRequestClick,
  alreadyRequested,
  clientStatus,
  clientCfp,
  isLoggedIn, // new prop
}) {
  if (!cfp) return null

  // Split any comma-separated fields if needed
  const charges = cfp.cfpCharge ? cfp.cfpCharge.split(",") : []
  const expertise = cfp.cfpExpertise ? cfp.cfpExpertise.split(",") : []
  const serviceAreas = cfp.cfpServiceArea ? cfp.cfpServiceArea.split(",") : []
  const qualifications = cfp.cfpQualifications
    ? cfp.cfpQualifications.split(",")
    : []
  const educationRecords = cfp.cfpEducationRecord
    ? cfp.cfpEducationRecord.split(",")
    : []
  const languages = cfp.cfpLanguages ? cfp.cfpLanguages.split(",") : []

  const imageUrl =
    cfp.cfpImage && cfp.cfpImage.trim() !== "" ? cfp.cfpImage : personIcon

  const checkboxClass =
    "form-checkbox h-4 w-4 text-white bg-gray-400 border-gray-400 rounded-sm focus:ring-0 mr-2"

  const modalContent = (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50 font-ibm"
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-4xl mx-2 bg-white rounded-lg p-6 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        variants={modalVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column */}
          <div>
            <img
              src={imageUrl}
              alt={`${cfp.cfpFirstName}`}
              className="w-32 h-32 rounded-full mx-auto object-cover"
            />
            <h2 className="mt-4 text-xl font-bold text-tfpa_blue text-center">
              {cfp.cfpFirstName} {cfp.cfpLastName}
            </h2>
            {cfp.cfpNickname && (
              <p className="text-sm text-gray-600 mb-2 text-center">
                [{cfp.cfpNickname}]
              </p>
            )}
            {cfp.cfpIntroduction && (
              <p className="mt-2 whitespace-pre-line">{cfp.cfpIntroduction}</p>
            )}
            <div className="mt-4 space-y-1 text-sm">
              {cfp.cfpContactEmail && <p>อีเมล: {cfp.cfpContactEmail}</p>}
              {cfp.cfpPhoneNumber && <p>เบอร์โทรศัพท์: {cfp.cfpPhoneNumber}</p>}
              {cfp.cfpLinkedin && <p>LinkedIn: {cfp.cfpLinkedin}</p>}
            </div>
          </div>

          {/* Right Column */}
          <div>
            {charges.length > 0 && (
              <div className="mt-4">
                <h4 className="font-bold text-tfpa_blue text-left">
                  การคิดค่าบริการ
                </h4>
                <ul className="list-disc list-inside">
                  {charges.map((item, idx) => (
                    <li key={idx}>
                      {chargeMapping[item.trim()] || item.trim()}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {expertise.length > 0 && (
              <div className="mt-4">
                <h4 className="font-bold text-tfpa_blue text-left">
                  การให้บริการ
                </h4>
                <ul className="list-disc list-inside">
                  {expertise.map((item, idx) => (
                    <li key={idx}>
                      {expertiseMapping[item.trim()] || item.trim()}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {serviceAreas.length > 0 && (
              <div className="mt-4">
                <h4 className="font-bold text-tfpa_blue text-left">
                  พื้นที่ให้บริการ
                </h4>
                <ul className="list-disc list-inside">
                  {serviceAreas.map((item, idx) => (
                    <li key={idx}>
                      {serviceAreaMapping[item.trim()] || item.trim()}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {cfp.cfpMainOccupation && (
              <div className="mt-4">
                <h4 className="font-bold text-tfpa_blue text-left">
                  อาชีพหลัก
                </h4>
                <p>{cfp.cfpMainOccupation}</p>
              </div>
            )}
            {qualifications.length > 0 && (
              <div className="mt-4">
                <h4 className="font-bold text-tfpa_blue text-left">
                  คุณวุฒิวิชาชีพ/ใบอนุญาต
                </h4>
                <ul className="list-disc list-inside">
                  {qualifications.map((item, idx) => (
                    <li key={idx}>{item.trim()}</li>
                  ))}
                </ul>
              </div>
            )}
            {educationRecords.length > 0 && (
              <div className="mt-4">
                <h4 className="font-bold text-tfpa_blue text-left">
                  ประวัติการศึกษา
                </h4>
                <ul className="list-disc list-inside">
                  {educationRecords.map((item, idx) => (
                    <li key={idx}>{item.trim()}</li>
                  ))}
                </ul>
              </div>
            )}
            {cfp.cfpReasonBecomeCfp && (
              <div className="mt-4">
                <h4 className="font-bold text-tfpa_blue text-left">
                  เหตุผลที่มาเป็นนักวางแผนการเงิน CFP
                </h4>
                <p className="whitespace-pre-line">{cfp.cfpReasonBecomeCfp}</p>
              </div>
            )}
            {languages.length > 0 && (
              <div className="mt-4">
                <h4 className="font-bold text-tfpa_blue text-left">
                  ภาษาที่ให้บริการคำปรึกษา
                </h4>
                <ul className="list-disc list-inside">
                  {languages.map((item, idx) => (
                    <li key={idx}>{item.trim()}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Send Request Button & Confirmation Message */}
            <div className="mt-6 border-t pt-4">
              {!isLoggedIn ? (
                <>
                  <button
                    disabled
                    className="bg-gray-400 text-white py-2 px-4 rounded"
                  >
                    ส่งคำร้อง
                  </button>
                  <p className="text-red-600 mt-2">
                    กรุณาเข้าสู่ระบบก่อนส่งคำร้อง
                  </p>
                </>
              ) : clientStatus === 1 || clientStatus === 2 ? (
                <>
                  <button
                    disabled
                    className="bg-gray-400 text-white py-2 px-4 rounded"
                  >
                    ส่งคำร้อง
                  </button>
                  <p className="text-green-600 mt-2">
                    คุณได้ส่งคำร้องไปหา CFP{" "}
                    {clientCfp
                      ? `${clientCfp.cfpFirstName} ${clientCfp.cfpLastName}`
                      : ""}{" "}
                    แล้ว
                  </p>
                </>
              ) : (
                <button
                  onClick={onSendRequestClick}
                  className="bg-tfpa_blue text-white py-2 px-4 rounded hover:opacity-90"
                >
                  ส่งคำร้อง
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )

  return ReactDOM.createPortal(modalContent, document.body)
}

export default function MarketplacePage() {
  const clientLoginUuid = localStorage.getItem("clientLoginUuid") || null
  // Use clientLoginUuid = "0" to indicate a logged-out client.
  const isLoggedIn = clientLoginUuid && clientLoginUuid !== "0"
  const [allCfps, setAllCfps] = useState([])
  const [filteredCfps, setFilteredCfps] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  // Filter states
  const [selectedChargeFilters, setSelectedChargeFilters] = useState([])
  const [selectedExpertiseFilters, setSelectedExpertiseFilters] = useState([])
  const [selectedGender, setSelectedGender] = useState("")
  const [selectedServiceArea, setSelectedServiceArea] = useState("")

  // Modal state
  const [selectedCfp, setSelectedCfp] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Client state
  const [clientAlreadyHasCfp, setClientAlreadyHasCfp] = useState(false)
  const [clientStatus, setClientStatus] = useState(null)
  const [clientData, setClientData] = useState(null)
  const [clientCfpData, setClientCfpData] = useState(null)

  // 1) Fetch all CFPs on mount
  useEffect(() => {
    const fetchAllCfps = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_KEY}api/cfp/all`)
        if (!res.ok) {
          console.error("Cannot fetch CFP data:", res.statusText)
          return
        }
        const data = await res.json()
        setAllCfps(data)
      } catch (err) {
        console.error("Error fetching CFP data:", err)
      }
    }
    fetchAllCfps()
  }, [])

  // 2) Check client info
  const checkClientAlreadyHasCfp = async () => {
    if (!clientLoginUuid) return
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_KEY}api/clients/info/${clientLoginUuid}`
      )
      if (res.ok) {
        const data = await res.json()
        // Convert numeric clientStatus using mapping
        const statusText = statusMapping[data.clientStatus] || ""
        setClientAlreadyHasCfp(
          !!data.cfpOfThisClient &&
            ["ส่งคำร้อง", "กำลังดำเนินการ", "ดำเนินการเรียบร้อย"].includes(
              statusText
            )
        )
        setClientStatus(data.clientStatus)
        setClientData(data)
        setClientCfpData(data.cfpOfThisClient)
      }
    } catch (error) {
      console.error("Error checking client info:", error)
    }
  }

  // 3) Filter logic
  const handleFilter = () => {
    let updated = [...allCfps]
    if (searchTerm.trim() !== "") {
      const st = searchTerm.toLowerCase()
      updated = updated.filter((cfp) => {
        const fullName = (
          cfp.cfpFirstName +
          " " +
          cfp.cfpLastName
        ).toLowerCase()
        const formatId = (cfp.cfpFormatId || "").toLowerCase()
        return fullName.includes(st) || formatId.includes(st)
      })
    }
    if (selectedChargeFilters.length > 0) {
      updated = updated.filter((cfp) => {
        if (!cfp.cfpCharge) return false
        const chargesArray = cfp.cfpCharge.split(",")
        return chargesArray.some((c) =>
          selectedChargeFilters.includes(c.trim())
        )
      })
    }
    if (selectedExpertiseFilters.length > 0) {
      updated = updated.filter((cfp) => {
        if (!cfp.cfpExpertise) return false
        const expArray = cfp.cfpExpertise.split(",")
        return expArray.some((item) =>
          selectedExpertiseFilters.includes(item.trim())
        )
      })
    }
    if (selectedGender !== "") {
      updated = updated.filter(
        (cfp) => String(cfp.cfpGender) === selectedGender
      )
    }
    if (selectedServiceArea !== "") {
      updated = updated.filter((cfp) => {
        if (!cfp.cfpServiceArea) return false
        const areaArray = cfp.cfpServiceArea.split(",")
        return areaArray.map((a) => a.trim()).includes(selectedServiceArea)
      })
    }
    setFilteredCfps(updated)
  }

  // 4) Open modal for a specific CFP
  const openModal = async (cfpUuid) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_KEY}api/cfp/profile/${cfpUuid}`
      )
      if (!res.ok) {
        console.error("Cannot fetch single CFP:", res.statusText)
        return
      }
      const data = await res.json()
      data.cfpUuid = cfpUuid
      setSelectedCfp(data)
      setIsModalOpen(true)
      if (clientLoginUuid) {
        await checkClientAlreadyHasCfp()
      }
    } catch (err) {
      console.error("Error fetching single CFP info:", err)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedCfp(null)
  }

  // 5) Send request: Update both CFP association and status via API
  const handleSendRequest = async () => {
    if (!clientLoginUuid || !selectedCfp) return
    if (clientAlreadyHasCfp && clientStatus !== 3) return
    const payload = {
      cfpOfThisClient: selectedCfp.cfpUuid,
      clientStatus: 1, // numeric 1 represents "ส่งคำร้อง"
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_KEY}api/clients/status/${clientLoginUuid}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      )
      if (res.ok) {
        setClientAlreadyHasCfp(true)
        setClientStatus(1)
        await checkClientAlreadyHasCfp()
      } else {
        console.error("Failed to assign CFP to client")
      }
    } catch (error) {
      console.error("Error assigning CFP to client:", error)
    }
  }

  useEffect(() => {
    handleFilter()
  }, [
    allCfps,
    searchTerm,
    selectedChargeFilters,
    selectedExpertiseFilters,
    selectedGender,
    selectedServiceArea,
  ])

  const toggleFilterValue = (value, array, setArray) => {
    if (array.includes(value)) {
      setArray(array.filter((v) => v !== value))
    } else {
      setArray([...array, value])
    }
  }

  const checkboxClass =
    "form-checkbox h-4 w-4 text-white bg-gray-400 border-gray-400 rounded-sm focus:ring-0 mr-2"
  const dropdownClass =
    "border p-2 rounded text-sm w-full hover:bg-gray-100 transition-colors"

  return (
    <div className="font-ibm min-h-screen flex flex-col">
      <Header />
      {/* Main content wrapped with motion.div */}
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="flex-1"
      >
        <div
          className="relative bg-cover bg-center"
          style={{ backgroundImage: `url(${wallpaper})` }}
        >
          <div className="absolute inset-0 bg-tfpa_blue opacity-70"></div>
          <div className="relative z-10 max-w-6xl mx-auto px-4 py-10 text-white text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">
              ติดต่อขอรับบริการวางแผนการเงิน
              <br className="hidden md:block" />
              กับนักวางแผนการเงิน CFP<sup>®</sup>
            </h1>
            {/* Filter & Search Container */}
            <div className="bg-white rounded shadow p-4 text-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Service checkboxes */}
                <div>
                  <h3 className="font-bold text-gray-700 mb-2">การให้บริการ</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm">
                    {Object.entries(expertiseMapping).map(([key, value]) => (
                      <label
                        key={key}
                        className="flex items-start gap-2 leading-snug"
                      >
                        <input
                          type="checkbox"
                          className={checkboxClass}
                          checked={selectedExpertiseFilters.includes(key)}
                          onChange={() =>
                            toggleFilterValue(
                              key,
                              selectedExpertiseFilters,
                              setSelectedExpertiseFilters
                            )
                          }
                        />
                        <span>{value}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {/* Right: Gender, Service Area, Charge filters */}
                <div className="flex flex-col space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-700 mb-1">เพศ</h3>
                      <select
                        className={dropdownClass}
                        value={selectedGender}
                        onChange={(e) => setSelectedGender(e.target.value)}
                      >
                        <option value="">ไม่ระบุเพศ</option>
                        <option value="0">ชาย</option>
                        <option value="1">หญิง</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-700 mb-1">
                        พื้นที่ให้บริการ
                      </h3>
                      <select
                        className={dropdownClass}
                        value={selectedServiceArea}
                        onChange={(e) => setSelectedServiceArea(e.target.value)}
                      >
                        <option value="">ไม่ระบุพื้นที่ให้บริการ</option>
                        {Object.entries(serviceAreaMapping).map(
                          ([key, value]) => (
                            <option key={key} value={key}>
                              {value}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-700 mb-2">
                      การคิดค่าบริการ
                    </h3>
                    <div className="space-y-1 text-sm">
                      {Object.entries(chargeMapping).map(([key, value]) => (
                        <label
                          key={key}
                          className="flex items-start gap-2 leading-snug"
                        >
                          <input
                            type="checkbox"
                            className={checkboxClass}
                            checked={selectedChargeFilters.includes(key)}
                            onChange={() =>
                              toggleFilterValue(
                                key,
                                selectedChargeFilters,
                                setSelectedChargeFilters
                              )
                            }
                          />
                          <span>{value}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <input
                  type="text"
                  placeholder="ค้นหาด้วยชื่อ CFP หรือหมายเลขคุณวุฒิ..."
                  className="border p-2 rounded text-sm w-full md:w-1/2 hover:bg-gray-100 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        {/* CFP Cards */}
        <div className="flex-1 bg-gray-100 p-4">
          <div className=" mx-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredCfps.map((cfp) => {
              const cardImage =
                cfp.cfpImage && cfp.cfpImage.trim() !== ""
                  ? cfp.cfpImage
                  : personIcon
              return (
                <div
                  key={cfp.cfpUuid}
                  onClick={() => openModal(cfp.cfpUuid)}
                  className="bg-white p-4 rounded-xl shadow cursor-pointer hover:shadow-lg transition-transform hover:-translate-y-1 text-center"
                >
                  <div className="flex justify-center mb-2">
                    <img
                      src={cardImage}
                      alt={cfp.cfpFirstName}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-blue-900">
                    {cfp.cfpFirstName} {cfp.cfpLastName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    นักวางแผนการเงิน <span className="font-bold">CFP</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    เลขคุณวุฒิ{" "}
                    <span className="font-bold">{cfp.cfpFormatId}</span>
                  </p>
                </div>
              )
            })}
          </div>
        </div>
        <AnimatePresence>
          {isModalOpen && (
            <CfpModal
              cfp={selectedCfp}
              onClose={closeModal}
              onSendRequestClick={isLoggedIn ? handleSendRequest : null}
              alreadyRequested={clientAlreadyHasCfp}
              clientStatus={clientStatus}
              clientCfp={clientCfpData}
              isLoggedIn={isLoggedIn}
            />
          )}
        </AnimatePresence>
      </motion.div>
      <Footer />
    </div>
  )
}
