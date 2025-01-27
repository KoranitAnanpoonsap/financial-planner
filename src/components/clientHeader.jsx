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
          <h1 className="text-xl font-bold">Thai Financial Planners Association</h1>
        </div>
        <nav className="space-x-4">
          <Link to="/" className="text-blue-500 hover:underline">
            หน้าหลัก
          </Link>
          <Link to="/about" className="text-blue-500 hover:underline">
            เกี่ยวกับสมาคม
          </Link>
          <Link to="/planners" className="text-blue-500 hover:underline">
            รายชื่อนักวางแผนการเงิน
          </Link>
          <Link to="/plans" className="text-blue-500 hover:underline">
            วางแผน
          </Link>
          <Link to="/faq" className="text-blue-500 hover:underline">
            FAQ
          </Link>
          <Link to="/client_login" className="bg-blue-500 text-white px-4 py-2 rounded">
            Login
          </Link>
        </nav>
      </div>
    </header>
  )
}