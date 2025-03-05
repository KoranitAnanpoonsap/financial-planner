import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ReactDOM from "react-dom"
import { useNavigate } from "react-router-dom"
import Header from "../components/clientHeader.jsx"
import Footer from "../components/footer.jsx"
import personIcon from "../assets/man.png"
import wallpaper from "../assets/login_wallpaper.jpg"
import Checkbox from "rc-checkbox"
import "rc-checkbox/assets/index.css"
import { FaChevronDown } from "react-icons/fa"

// ----- Mapping objects -----
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

const statusMapping = {
  1: "ส่งคำร้อง",
  2: "กำลังดำเนินการ",
  3: "ดำเนินการเรียบร้อย",
}

// Framer Motion variants for modals and page transitions
const modalVariants = {
  initial: { y: -40, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 20, opacity: 0 },
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

// ------------------------ CFP Detail Modal ------------------------
function CfpModal({
  cfp,
  onClose,
  onSendRequestClick,
  clientStatus,
  clientCfp,
  isLoggedIn,
  register,
}) {
  if (!cfp) return null

  // Disable background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

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

  const modalContent = (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50 font-ibm"
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-4xl mx-2 bg-white rounded-lg p-6 overflow-y-auto max-h-[90vh] thin-scroll"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          {/* Left Column */}
          <div>
            <img
              src={imageUrl}
              alt={cfp.cfpFirstName}
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
                <ul className="list-disc list-inside text-left">
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
            <div className="mt-6 border-t pt-4">
              {!isLoggedIn ? (
                <button
                  onClick={register}
                  className="bg-tfpa_blue text-white py-2 px-4 rounded hover:opacity-90"
                >
                  ส่งคำร้อง
                </button>
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

// ------------------------ Filter Wizard Modal ------------------------
function FilterWizardModal({
  initialExpertise,
  initialCharge,
  initialServiceArea,
  initialGender,
  onFinish,
  onClose,
}) {
  const [step, setStep] = useState(1)
  const [selectedExpertise, setSelectedExpertise] = useState(initialExpertise)
  const [selectedCharge, setSelectedCharge] = useState(initialCharge)
  const [selectedServiceAreaLocal, setSelectedServiceAreaLocal] =
    useState(initialServiceArea)
  const [selectedGenderLocal, setSelectedGenderLocal] = useState(initialGender)

  // Calculate progress percentage (4 steps total)
  const progressPercentage = (step / 4) * 100

  // Framer Motion variants for step transitions
  const stepVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  }

  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => prev - 1)

  const handleFinish = () => {
    onFinish({
      selectedExpertise,
      selectedCharge,
      selectedServiceArea: selectedServiceAreaLocal,
      selectedGender: selectedGenderLocal,
    })
    onClose()
  }

  // Disable background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  let content
  if (step === 1) {
    content = (
      <motion.div
        variants={stepVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-700">
          เลือกการให้บริการ
        </h2>
        <div className="space-y-2 thin-scroll max-h-full overflow-y-auto">
          {Object.entries(expertiseMapping).map(([key, value]) => (
            <label key={key} className="flex items-center gap-2 text-gray-700">
              <Checkbox
                checked={selectedExpertise.includes(key)}
                onChange={() => {
                  if (selectedExpertise.includes(key)) {
                    setSelectedExpertise(
                      selectedExpertise.filter((item) => item !== key)
                    )
                  } else {
                    setSelectedExpertise([...selectedExpertise, key])
                  }
                }}
                className="w-4 h-4"
              />
              <span>{value}</span>
            </label>
          ))}
        </div>
      </motion.div>
    )
  } else if (step === 2) {
    content = (
      <motion.div
        variants={stepVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-700">
          เลือกการคิดค่าบริการ
        </h2>
        <div className="space-y-2 thin-scroll max-h-full overflow-y-auto">
          {Object.entries(chargeMapping).map(([key, value]) => (
            <label key={key} className="flex items-center gap-2 text-gray-700">
              <Checkbox
                checked={selectedCharge.includes(key)}
                onChange={() => {
                  if (selectedCharge.includes(key)) {
                    setSelectedCharge(
                      selectedCharge.filter((item) => item !== key)
                    )
                  } else {
                    setSelectedCharge([...selectedCharge, key])
                  }
                }}
                className="w-4 h-4"
              />
              <span>{value}</span>
            </label>
          ))}
        </div>
      </motion.div>
    )
  } else if (step === 3) {
    content = (
      <motion.div
        variants={stepVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-700">
          เลือกพื้นที่ให้บริการ
        </h2>
        <div className="space-y-2">
          <button
            onClick={() => setSelectedServiceAreaLocal("")}
            className={`w-full text-left p-2 border rounded ${
              selectedServiceAreaLocal === ""
                ? "bg-tfpa_blue text-white"
                : "bg-white text-gray-700"
            }`}
          >
            ไม่ระบุพื้นที่ให้บริการ
          </button>
          {Object.entries(serviceAreaMapping).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setSelectedServiceAreaLocal(key)}
              className={`w-full text-left p-2 border rounded ${
                selectedServiceAreaLocal === key
                  ? "bg-tfpa_blue text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </motion.div>
    )
  } else if (step === 4) {
    content = (
      <motion.div
        variants={stepVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-700">เลือกเพศ</h2>
        <div className="space-y-2">
          <button
            onClick={() => setSelectedGenderLocal("")}
            className={`w-full text-left p-2 border rounded ${
              selectedGenderLocal === ""
                ? "bg-tfpa_blue text-white"
                : "bg-white text-gray-700"
            }`}
          >
            ไม่ระบุเพศ
          </button>
          <button
            onClick={() => setSelectedGenderLocal("0")}
            className={`w-full text-left p-2 border rounded ${
              selectedGenderLocal === "0"
                ? "bg-tfpa_blue text-white"
                : "bg-white text-gray-700"
            }`}
          >
            ชาย
          </button>
          <button
            onClick={() => setSelectedGenderLocal("1")}
            className={`w-full text-left p-2 border rounded ${
              selectedGenderLocal === "1"
                ? "bg-tfpa_blue text-white"
                : "bg-white text-gray-700"
            }`}
          >
            หญิง
          </button>
        </div>
      </motion.div>
    )
  }

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-black bg-opacity-50 font-ibm"
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 fixed"
        style={{ height: "650px" }}
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Top Right X Icon for closing */}
        <button
          onClick={onClose}
          className="absolute top-1 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        {/* Progress Bar */}
        <div className="flex items-center mb-4">
          <div className="relative flex-1 h-2 bg-gray-300 rounded">
            <motion.div
              className="absolute top-0 left-0 h-2 bg-tfpa_gold rounded"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3 }}
            ></motion.div>
          </div>
          <span className="ml-2 text-xs text-gray-600">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div
          className="overflow-y-auto overflow-x-hidden thin-scroll"
          style={{ height: "calc(100% - 80px)" }}
        >
          {content}
        </div>
        <div className="flex justify-end mt-6">
          {step > 1 && (
            <button
              onClick={prevStep}
              className="bg-gray-300 text-gray-800 py-2 px-4 mx-3 rounded hover:bg-gray-400"
            >
              ย้อนกลับ
            </button>
          )}
          {step < 4 && (
            <button
              onClick={nextStep}
              className="bg-tfpa_blue text-white py-2 px-4 rounded hover:bg-tfpa_blue_hover transition-all"
            >
              ถัดไป
            </button>
          )}
          {step === 4 && (
            <button
              onClick={handleFinish}
              className="bg-tfpa_blue text-white py-2 px-4 rounded hover:opacity-90"
            >
              เสร็จสิ้น
            </button>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  )
}

// ------------------------ Marketplace Page ------------------------
export default function MarketplacePage() {
  const navigate = useNavigate()
  const clientLoginUuid = localStorage.getItem("clientLoginUuid") || null
  const isLoggedIn = clientLoginUuid && clientLoginUuid !== "0"
  const [allCfps, setAllCfps] = useState([])
  const [filteredCfps, setFilteredCfps] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  // Filter states
  const [selectedChargeFilters, setSelectedChargeFilters] = useState([])
  const [selectedExpertiseFilters, setSelectedExpertiseFilters] = useState([])
  const [selectedGender, setSelectedGender] = useState("")
  const [selectedServiceArea, setSelectedServiceArea] = useState("")

  // Show/hide Filter Wizard modal
  const [showFilterWizard, setShowFilterWizard] = useState(false)

  // Modal state for CFP details
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

  // 3) Filter logic (with sort by cfpFormatId)
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
    updated.sort((a, b) => {
      const idA = parseInt(a.cfpFormatId.replace(/\D/g, ""), 10) || 0
      const idB = parseInt(b.cfpFormatId.replace(/\D/g, ""), 10) || 0
      return idA - idB
    })
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
      clientStatus: 1,
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

  const handleRegister = () => {
    navigate(`/register`)
  }

  return (
    <div className="font-ibm min-h-screen flex flex-col">
      <Header />
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
          <div className="relative z-10 max-w-6xl mx-auto px-64 py-10 text-white text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">
              ติดต่อขอรับบริการวางแผนการเงิน
              <br className="hidden md:block" />
              กับนักวางแผนการเงิน CFP<sup>®</sup>
            </h1>
            <div className="bg-white rounded-xl shadow py-4 px-4 text-gray-800 mb-4 flex flex-col items-center">
              <button
                onClick={() => setShowFilterWizard(true)}
                className="bg-tfpa_gold text-white py-3 px-6 rounded-2xl hover:bg-tfpa_gold_hover text-lg"
              >
                ค้นหา CFP ที่เหมาะกับคุณ
              </button>
              <div className="mt-4 w-full flex justify-center">
                <input
                  type="text"
                  placeholder="ค้นหาด้วยชื่อ CFP หรือหมายเลขคุณวุฒิ..."
                  className="border p-2 rounded text-sm w-full md:w-3/4 hover:bg-gray-100 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-gray-100 p-4">
          <div className="mx-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
              clientStatus={clientStatus}
              clientCfp={clientCfpData}
              isLoggedIn={isLoggedIn}
              register={handleRegister}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showFilterWizard && (
            <FilterWizardModal
              initialExpertise={selectedExpertiseFilters}
              initialCharge={selectedChargeFilters}
              initialServiceArea={selectedServiceArea}
              initialGender={selectedGender}
              onFinish={({
                selectedExpertise,
                selectedCharge,
                selectedServiceArea,
                selectedGender,
              }) => {
                setSelectedExpertiseFilters(selectedExpertise)
                setSelectedChargeFilters(selectedCharge)
                setSelectedServiceArea(selectedServiceArea)
                setSelectedGender(selectedGender)
              }}
              onClose={() => setShowFilterWizard(false)}
            />
          )}
        </AnimatePresence>
      </motion.div>
      <Footer />
    </div>
  )
}
