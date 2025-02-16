import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/clientHeader.jsx"
import Footer from "../components/footer.jsx"
import { motion } from "framer-motion"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

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

  // Parse title and gender as numbers
  const handleInputChange = (e) => {
    let value = e.target.value
    if (e.target.name === "clientTitle" || e.target.name === "clientGender") {
      value = parseInt(value, 10)
    }
    setEditedInfo({
      ...editedInfo,
      [e.target.name]: value,
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

  // Formats the date (YYYY-MM-DD) to a Thai date in DD / MM / (YYYY+543)
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

  // Mapping objects: stored numeric values map to text.
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
      <div className="flex flex-1 flex-col p-8 relative mb-12">
        <motion.div
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          {/* Centered header */}
          <h3 className="text-tfpa_blue font-bold text-lg mb-4 text-center">
            ข้อมูลส่วนตัว
          </h3>
          {clientInfo && (
            <div className="mx-auto max-w-3xl bg-white shadow rounded p-6">
              <div className="space-y-4">
                {/* ID Card */}
                <div className="grid grid-cols-2 items-center">
                  <div className="text-tfpa_blue font-bold">
                    เลขประจำตัวประชาชน
                  </div>
                  <div className="text-tfpa_blue">
                    {!isEditing ? (
                      <span>{clientInfo.clientNationalId || "-"}</span>
                    ) : (
                      <input
                        type="text"
                        name="clientNationalId"
                        value={editedInfo.clientNationalId}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      />
                    )}
                  </div>
                </div>
                {/* Title */}
                <div className="grid grid-cols-2 items-center">
                  <div className="text-tfpa_blue font-bold">คำนำหน้าชื่อ</div>
                  <div className="text-tfpa_blue">
                    {!isEditing ? (
                      <span>{titleMapping[clientInfo.clientTitle] || "-"}</span>
                    ) : (
                      <select
                        name="clientTitle"
                        value={editedInfo.clientTitle}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      >
                        {Object.entries(titleMapping).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                {/* First Name */}
                <div className="grid grid-cols-2 items-center">
                  <div className="text-tfpa_blue font-bold">ชื่อ</div>
                  <div className="text-tfpa_blue">
                    {!isEditing ? (
                      <span>{clientInfo.clientFirstName || "-"}</span>
                    ) : (
                      <input
                        type="text"
                        name="clientFirstName"
                        value={editedInfo.clientFirstName}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      />
                    )}
                  </div>
                </div>
                {/* Last Name */}
                <div className="grid grid-cols-2 items-center">
                  <div className="text-tfpa_blue font-bold">นามสกุล</div>
                  <div className="text-tfpa_blue">
                    {!isEditing ? (
                      <span>{clientInfo.clientLastName || "-"}</span>
                    ) : (
                      <input
                        type="text"
                        name="clientLastName"
                        value={editedInfo.clientLastName}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      />
                    )}
                  </div>
                </div>
                {/* Gender */}
                <div className="grid grid-cols-2 items-center">
                  <div className="text-tfpa_blue font-bold">เพศ</div>
                  <div className="text-tfpa_blue">
                    {!isEditing ? (
                      <span>
                        {genderMapping[clientInfo.clientGender] || "-"}
                      </span>
                    ) : (
                      <select
                        name="clientGender"
                        value={editedInfo.clientGender}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      >
                        {Object.entries(genderMapping).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                {/* Date of Birth */}
                <div className="grid grid-cols-2 items-center">
                  <div className="text-tfpa_blue font-bold">
                    วัน/เดือน/ปีเกิด(พ.ศ.)
                  </div>
                  <div className="text-tfpa_blue">
                    {!isEditing ? (
                      <span>
                        {formatDateOfBirth(clientInfo.clientDateOfBirth)}
                      </span>
                    ) : (
                      <DatePicker
                        selected={
                          editedInfo.clientDateOfBirth
                            ? new Date(editedInfo.clientDateOfBirth)
                            : null
                        }
                        onChange={(date) => {
                          const yyyy = date.getFullYear()
                          const mm = ("0" + (date.getMonth() + 1)).slice(-2)
                          const dd = ("0" + date.getDate()).slice(-2)
                          const formattedDate = `${yyyy}-${mm}-${dd}`
                          handleInputChange({
                            target: {
                              name: "clientDateOfBirth",
                              value: formattedDate,
                            },
                          })
                        }}
                        dateFormat="dd/MM/yyyy"
                        className="w-full border border-gray-300 rounded px-2 py-1"
                        popperPlacement="bottom-start"
                        calendarClassName="custom-datepicker"
                        readOnly={false}
                      />
                    )}
                  </div>
                </div>
                {/* Phone Number */}
                <div className="grid grid-cols-2 items-center">
                  <div className="text-tfpa_blue font-bold">เบอร์โทรศัพท์</div>
                  <div className="text-tfpa_blue">
                    {!isEditing ? (
                      <span>{clientInfo.clientPhoneNumber || "-"}</span>
                    ) : (
                      <input
                        type="text"
                        name="clientPhoneNumber"
                        value={editedInfo.clientPhoneNumber}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      />
                    )}
                  </div>
                </div>
                {/* Email */}
                <div className="grid grid-cols-2 items-center">
                  <div className="text-tfpa_blue font-bold">อีเมล</div>
                  <div className="text-tfpa_blue">
                    {!isEditing ? (
                      <span>{clientInfo.clientEmail || "-"}</span>
                    ) : (
                      <input
                        type="email"
                        name="clientEmail"
                        value={editedInfo.clientEmail}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      />
                    )}
                  </div>
                </div>
              </div>
              {/* Edit / Save / Cancel Buttons */}
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
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
