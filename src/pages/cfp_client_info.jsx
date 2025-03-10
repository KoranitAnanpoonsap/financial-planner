import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Header from "../components/cfpHeader"
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
  duration: 0.4,
}

export default function CFPClientInfoPage() {
  const [clientUuid] = useState(localStorage.getItem("clientUuid") || "")
  const navigate = useNavigate()

  const [clientInfo, setClientInfo] = useState(null)

  useEffect(() => {
    fetchData()
  }, [clientUuid])

  const fetchData = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_KEY}api/clients/info/${clientUuid}`
    )
    if (res.ok) {
      const data = await res.json()
      setClientInfo(data)
    } else {
      setClientInfo(null)
    }
  }

  const handleNext = () => {
    navigate(`/client-income/`)
  }

  // Helper to format date of birth
  const formatDateOfBirth = (dobString) => {
    if (!dobString) return "-"
    // dobString in "YYYY-MM-DD" format
    const parts = dobString.split("-")
    if (parts.length !== 3) return "-"
    const year = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10)
    const day = parseInt(parts[2], 10)
    if (isNaN(year) || isNaN(month) || isNaN(day)) return "-"
    const thaiYear = year + 543
    const dayStr = ("0" + day).slice(-2)
    const monthStr = ("0" + month).slice(-2)
    return `${dayStr} / ${monthStr} / ${thaiYear}`
  }

  // Options for display
  const titleOptions = ["นาย", "นาง", "นางสาว"]
  const genderOptions = ["ชาย", "หญิง"]

  // Mapping for converting stored number to text
  const titleMapping = {
    1: "นาย",
    2: "นาง",
    3: "นางสาว",
  }

  const genderMapping = {
    0: "ชาย",
    1: "หญิง",
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
              <div className="w-10 h-10 bg-tfpa_gold rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <span className="font-bold text-tfpa_blue mt-1">
                ข้อมูลส่วนตัว
              </span>
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
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <span className="font-bold mt-1">สินทรัพย์</span>
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
            {/* Personal Info Section */}
            <h3 className="text-tfpa_blue font-bold text-lg mb-4">
              1. ข้อมูลส่วนตัว
            </h3>
            <div className="mx-80 grid grid-cols-2">
              <div className="text-tfpa_blue font-bold space-y-4">
                <div>คำนำหน้าชื่อ</div>
                <div>ชื่อ</div>
                <div>นามสกุล</div>
                <div>เพศ</div>
                <div>วัน/เดือน/ปีเกิด(พ.ศ.)</div>
                <div>เบอร์โทรศัพท์</div>
                <div>อีเมล</div>
              </div>
              <div className="text-tfpa_blue space-y-4">
                <div>
                  {/* Display title as radio-like but read-only */}
                  <div className="flex items-center space-x-4">
                    {titleOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <div
                          className={`w-4 h-4 rounded-full ${
                            titleMapping[clientInfo?.clientTitle] === option
                              ? "bg-tfpa_blue"
                              : "border border-tfpa_blue"
                          }`}
                        ></div>
                        <span>{option}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>{clientInfo?.clientFirstName || "-"}</div>
                <div>{clientInfo?.clientLastName || "-"}</div>
                <div>
                  {/* Display gender as radio-like but read-only */}
                  <div className="flex items-center space-x-4">
                    {genderOptions.map((g) => (
                      <div key={g} className="flex items-center space-x-2">
                        <div
                          className={`w-4 h-4 rounded-full ${
                            genderMapping[clientInfo?.clientGender] === g
                              ? "bg-tfpa_blue"
                              : "border border-tfpa_blue"
                          }`}
                        ></div>
                        <span>{g}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>{formatDateOfBirth(clientInfo?.clientDateOfBirth)}</div>
                <div>{clientInfo?.clientPhoneNumber || "-"}</div>
                <div>{clientInfo?.clientEmail || "-"}</div>
              </div>
            </div>

            <div className="flex justify-end">
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
