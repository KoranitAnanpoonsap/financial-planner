import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/clientHeader.jsx"
import Footer from "../components/footer.jsx"
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

export default function ClientInfoPage() {
  const clientLoginUuid = localStorage.getItem("clientLoginUuid") || "0"
  const navigate = useNavigate()
  const [clientInfo, setClientInfo] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedInfo, setEditedInfo] = useState({})

  useEffect(() => {
    fetchData()
  }, [clientLoginUuid])

  const fetchData = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_KEY}api/clients/info/${clientLoginUuid}`
    )
    if (res.ok) {
      const data = await res.json()
      setClientInfo(data)
      setEditedInfo(data)
    } else {
      setClientInfo(null)
    }
  }

  const handleInputChange = (e) => {
    setEditedInfo({
      ...editedInfo,
      [e.target.name]: e.target.value,
    })
  }

  const handleSave = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_KEY}api/clients/${clientLoginUuid}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedInfo),
      }
    )
    if (res.ok) {
      setIsEditing(false)
      fetchData()
    } else {
      alert("Error updating information")
    }
  }

  const formatDateOfBirth = (dobString) => {
    if (!dobString) return "-"
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
      <div className="flex flex-1 flex-col p-8">
        <motion.div
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          <h3 className="text-tfpa_blue font-bold text-lg mb-4">
            ข้อมูลส่วนตัว
          </h3>
          {clientInfo ? (
            <div className="mx-auto max-w-3xl bg-white shadow rounded p-6">
              <div className="grid grid-cols-2 gap-4">
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
                  <div>{clientInfo.clientNationalId || "-"}</div>
                  <div>
                    {!isEditing ? (
                      <span>{clientInfo.clientTitle}</span>
                    ) : (
                      <select
                        name="clientTitle"
                        value={editedInfo.clientTitle}
                        onChange={handleInputChange}
                      >
                        {titleOptions.map((title) => (
                          <option key={title} value={title}>
                            {title}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div>
                    {!isEditing ? (
                      <span>{clientInfo.clientFirstName}</span>
                    ) : (
                      <input
                        type="text"
                        name="clientFirstName"
                        value={editedInfo.clientFirstName}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded px-2 py-1"
                      />
                    )}
                  </div>
                  <div>
                    {!isEditing ? (
                      <span>{clientInfo.clientLastName}</span>
                    ) : (
                      <input
                        type="text"
                        name="clientLastName"
                        value={editedInfo.clientLastName}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded px-2 py-1"
                      />
                    )}
                  </div>
                  <div>
                    {!isEditing ? (
                      <span>{clientInfo.clientGender}</span>
                    ) : (
                      <select
                        name="clientGender"
                        value={editedInfo.clientGender}
                        onChange={handleInputChange}
                      >
                        {genderOptions.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div>{formatDateOfBirth(clientInfo.clientDateOfBirth)}</div>
                  <div>
                    {!isEditing ? (
                      <span>{clientInfo.clientPhoneNumber}</span>
                    ) : (
                      <input
                        type="text"
                        name="clientPhoneNumber"
                        value={editedInfo.clientPhoneNumber}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded px-2 py-1"
                      />
                    )}
                  </div>
                  <div>
                    {!isEditing ? (
                      <span>{clientInfo.clientEmail}</span>
                    ) : (
                      <input
                        type="email"
                        name="clientEmail"
                        value={editedInfo.clientEmail}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded px-2 py-1"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-tfpa_blue hover:bg-tfpa_blue_hover text-white px-4 py-2 rounded font-bold"
                  >
                    แก้ไขข้อมูล
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      className="bg-tfpa_blue hover:bg-tfpa_blue_hover text-white px-4 py-2 rounded font-bold mr-2"
                    >
                      บันทึก
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false)
                        setEditedInfo(clientInfo)
                      }}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded font-bold"
                    >
                      ยกเลิก
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
