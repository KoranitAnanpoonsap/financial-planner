import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../assets/TFPA_logo.png"

export default function ClientHeader() {
  const navigate = useNavigate()
  const [clientLoginUuid, setClientLoginUuid] = useState(
    localStorage.getItem("clientLoginUuid") || "0"
  )
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.setItem("clientLoginUuid", "0")
    setClientLoginUuid("0")
    navigate("/client-login")
  }

  return (
    <header className="bg-white border-b border-gray-200 relative z-50 drop-shadow-md font-ibm">
      <div className="container mx-auto flex justify-between items-center py-4">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="TFPA Logo" className="h-12" />
        </div>
        <nav className="space-x-4 relative">
          <span
            onClick={() => navigate(`/client-homepage`)}
            className="text-tfpa_blue hover:underline cursor-pointer"
          >
            หน้าหลัก
          </span>
          <span
            onClick={() => navigate(`/client-aboutTFPA`)}
            className="text-tfpa_blue hover:underline cursor-pointer"
          >
            เกี่ยวกับสมาคม
          </span>
          <span
            onClick={() => navigate(`/client-marketplace`)}
            className="text-tfpa_blue hover:underline cursor-pointer"
          >
            รายชื่อนักวางแผนการเงิน
          </span>
          <span
            onClick={() => navigate(`/client-precalculation-page`)}
            className="text-tfpa_blue hover:underline cursor-pointer"
          >
            วางแผน
          </span>
          <span
            onClick={() => navigate(`/client-faq`)}
            className="text-tfpa_blue hover:underline cursor-pointer"
          >
            FAQ
          </span>
          {clientLoginUuid === "0" ? (
            <button
              onClick={() => navigate(`/client-login`)}
              className="bg-tfpa_blue hover:bg-tfpa_blue_hover text-white px-4 py-2 rounded-lg"
            >
              Login
            </button>
          ) : (
            <div className="inline-block" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="bg-tfpa_blue hover:bg-tfpa_blue_hover text-white px-4 py-2 rounded-lg"
              >
                Account
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
                  <button
                    onClick={() => {
                      setDropdownOpen(false)
                      navigate(`/client-information`)
                    }}
                    className="block text-sm px-4 py-2 text-left w-full hover:bg-gray-200 font-ibm"
                  >
                    ข้อมูลส่วนตัว
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false)
                      navigate(`/client-status`)
                    }}
                    className="block text-sm px-4 py-2 text-left w-full hover:bg-gray-200 font-ibm"
                  >
                    สถานะปรึกษากับ CFP
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false)
                      handleLogout()
                    }}
                    className="block text-sm px-4 py-2 text-left w-full hover:bg-gray-200 font-ibm"
                  >
                    ออกจากระบบ
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
