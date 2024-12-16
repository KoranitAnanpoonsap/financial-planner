import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Header from "../components/header"
import Footer from "../components/footer"
import ClientBluePanel from "../components/clientBluePanel"

export default function CFPClientInfoPage() {
  const { clientId, cfpId } = useParams()
  const navigate = useNavigate()

  const [clientInfo, setClientInfo] = useState(null)

  useEffect(() => {
    fetchData()
  }, [clientId])

  const fetchData = async () => {
    const res = await fetch(
      `http://localhost:8080/api/clients/info/${clientId}`
    )
    if (res.ok) {
      const data = await res.json()
      setClientInfo(data)
    } else {
      setClientInfo(null)
    }
  }

  const handleNext = () => {
    navigate(`/${cfpId}/client-income/${clientId}`)
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

  const titleOptions = ["นาย", "นาง", "นางสาว"]
  const genderOptions = ["ชาย", "หญิง"]

  return (
    <div className="flex flex-col min-h-screen font-ibm">
      <Header />
      <div className="flex flex-1">
        <ClientBluePanel />
        <div className="flex-1 p-8 space-y-8">
          {/* Steps at the top */}
          <div className="flex items-center justify-center space-x-8 mb-8">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-tfpa_gold rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <span className="font-bold text-tfpa_blue">ข้อมูลส่วนตัว</span>
            </div>
            <div className="h-px bg-gray-300 w-24"></div>
            <div className="flex flex-col items-center text-gray-400">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <span className="font-bold">รายได้</span>
            </div>
            <div className="h-px bg-gray-300 w-24"></div>
            <div className="flex flex-col items-center text-gray-400">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <span className="font-bold">รายจ่าย</span>
            </div>
            <div className="h-px bg-gray-300 w-24"></div>
            <div className="flex flex-col items-center text-gray-400">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <span className="font-bold">สินทรัพย์</span>
            </div>
            <div className="h-px bg-gray-300 w-24"></div>
            <div className="flex flex-col items-center text-gray-400">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <span className="font-bold">หนี้สิน</span>
            </div>
          </div>

          {/* Personal Info Section */}
          <h3 className="text-tfpa_blue font-bold text-lg">1. ข้อมูลส่วนตัว</h3>
          <div className="mx-80 grid grid-cols-2">
            <div className="text-tfpa_blue font-bold space-y-4">
              <div>เลขประจำตัวประชาชน</div>
              <div>คำนำหน้าชื่อ</div>
              <div>ชื่อ</div>
              <div>นามสกุล</div>
              <div>เพศ</div>
              <div>วัน/เดือน/ปีเกิด(พ.ศ.)</div>
              <div>เบอร์โทรศัพท์</div>
              <div>อีเมล</div>
            </div>
            <div className="text-tfpa_blue space-y-4">
              <div>{clientInfo?.clientNationalId || "-"}</div>
              <div>
                {/* Display as radio-like but read-only */}
                <div className="flex items-center space-x-4">
                  {titleOptions.map((title) => (
                    <div key={title} className="flex items-center space-x-2">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          clientInfo?.clientTitle === title
                            ? "bg-tfpa_blue"
                            : "border border-tfpa_blue"
                        }`}
                      ></div>
                      <span>{title}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>{clientInfo?.clientFirstName || "-"}</div>
              <div>{clientInfo?.clientLastName || "-"}</div>
              <div>
                <div className="flex items-center space-x-4">
                  {genderOptions.map((g) => (
                    <div key={g} className="flex items-center space-x-2">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          clientInfo?.clientGender === g
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
              className="bg-blue-500 text-white px-4 py-2 rounded font-ibm font-bold"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
