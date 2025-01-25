import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../assets/TFPA_logo.png"

export default function Header() {
  const [cfpFirstName, setCfpFirstName] = useState(
    localStorage.getItem("cfpFirstName") || ""
  )
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [cfpUuid] = useState(localStorage.getItem("cfpUuid") || "")
  const navigate = useNavigate()

  // Fetch CFP first name based on cfpUuid only if not already stored
  useEffect(() => {
    const fetchCfpInfo = async () => {
      if (!cfpFirstName) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_KEY}api/cfp/${cfpUuid}`
          )
          if (!response.ok) {
            throw new Error("Error fetching CFP information")
          }

          const firstName = await response.text()
          setCfpFirstName(firstName)
          localStorage.setItem("cfpFirstName", firstName) // Store in localStorage
        } catch (error) {
          console.error("Error fetching CFP info:", error)
        }
      }
    }

    fetchCfpInfo()
  }, [cfpUuid, cfpFirstName])

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const handleHomePage = () => {
    navigate(`/cfp-homepage/`)
  }

  const handleLogout = () => {
    // Clear data on logout
    localStorage.removeItem("cfpFirstName")
    setCfpFirstName("")
    navigate("/")
  }

  return (
    <header className="flex items-center justify-between p-4 bg-white drop-shadow-md z-10">
      <div
        className="w-[306.67px] h-[65px] bg-no-repeat bg-contain"
        style={{ backgroundImage: `url(${logo})` }}
      />
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="bg-tfpa_blue hover:bg-tfpa_blue_hover text-white px-6 py-2 rounded font-ibm"
        >
          CFP {cfpFirstName}
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 bg-white shadow-md mt-2 rounded">
            <button
              onClick={handleHomePage}
              className="block text-sm px-4 py-2 text-left w-full hover:bg-gray-200 font-ibm"
            >
              หน้าแรก
            </button>
            <button
              onClick={handleLogout}
              className="block text-sm px-4 py-2 text-left w-full hover:bg-gray-200 font-ibm"
            >
              ออกจากระบบ
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
