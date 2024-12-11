import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import logo from "../assets/TFPA_logo.png"

export default function Header() {
  const [cfpFirstName, setCfpFirstName] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { cfpId } = useParams()
  const navigate = useNavigate()

  // Fetch CFP first name based on cfpId
  useEffect(() => {
    const fetchCfpInfo = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/cfp/${cfpId}`)
        if (!response.ok) {
          throw new Error("Error fetching CFP information")
        }

        const firstName = await response.text()
        setCfpFirstName(firstName)
      } catch (error) {
        console.error("Error fetching CFP info:", error)
      }
    }

    fetchCfpInfo()
  }, [cfpId])

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const handleHomePage = () => {
    navigate(`/cfp-homepage/${cfpId}`)
  }

  const handleLogout = () => {
    // Implement logout logic if needed (e.g., clear tokens)
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
          className="bg-blue-500 text-white px-6 py-2 rounded"
        >
          CFP {cfpFirstName}
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 bg-white shadow-md mt-2 rounded">
            <button
              onClick={handleHomePage}
              className="block text-sm px-4 py-2 text-left w-full hover:bg-gray-200"
            >
              หน้าแรก
            </button>
            <button
              onClick={handleLogout}
              className="block text-sm px-4 py-2 text-left w-full hover:bg-gray-200"
            >
              ออกจากระบบ
            </button>
          </div>
        )}
      </div>
    </header>
  )
}