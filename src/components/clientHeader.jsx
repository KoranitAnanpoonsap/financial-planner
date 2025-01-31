import React from "react"
import { useNavigate } from "react-router-dom"
import logo from "../assets/TFPA_logo.png"

export default function ClientHeader() {
  const navigate = useNavigate()
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto flex justify-between items-center py-4">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="TFPA Logo" className="h-12" />
        </div>
        <nav className="space-x-4">
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
            onClick={() => navigate(`/planners`)}
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
            onClick={() => navigate(`/faq`)}
            className="text-tfpa_blue hover:underline cursor-pointer"
          >
            FAQ
          </span>
          <button
            onClick={() => navigate(`/client-login`)}
            className="bg-tfpa_blue hover:bg-tfpa_blue_hover text-white px-4 py-2 rounded"
          >
            Login
          </button>
        </nav>
      </div>
    </header>
  )
}
