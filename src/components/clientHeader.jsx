import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import logo from "../assets/TFPA_logo.png"

export default function ClientHeader() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto flex justify-between items-center py-4">
        <div className="flex items-center space-x-4">
          <img
            src={logo}
            alt="TFPA Logo"
            className="h-12"
          />
        </div>
        <nav className="space-x-4">
          <Link to="/client-homepage" className="font-bold text-tfpa_blue mt-1">
            หน้าหลัก
          </Link>
          <Link to="/about" className="font-bold text-tfpa_blue mt-1">
            เกี่ยวกับสมาคม
          </Link>
          <Link to="/planners" className="font-bold text-tfpa_blue mt-1">
            รายชื่อนักวางแผนการเงิน
          </Link>
          <Link to="/plans" className="font-bold text-tfpa_blue mt-1">
            วางแผน
          </Link>
          <Link to="/faq" className="font-bold text-tfpa_blue mt-1">
            FAQ
          </Link>
          <Link to="/client-login" className="bg-tfpa_blue hover:bg-tfpa_blue_hover text-white px-6 py-2 rounded font-ibm"> 
            Login
          </Link>
        </nav>
      </div>
    </header>
  )
}

// "bg-blue-500 text-white px-4 py-2 rounded"
// "text-blue-500 hover:underline"